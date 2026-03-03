# Scenew - Product Link Scraping Architecture

## Overview

When a user pastes a product link (Taobao, JD, Tmall, etc.) and clicks "Add", the frontend sends the URL to a backend scraping service. The backend attempts to extract product info (title, image, price). If the target platform requires login (e.g. Taobao anti-bot), the backend starts a remote browser session and asks the frontend to present a login UI so the user can authenticate. After login, the backend captures the session cookies and retries the extraction.

## System Architecture

```
+──────────────────────────────────────────────────────────────────+
|  Frontend (React)                                                |
|                                                                  |
|  TryItSection.tsx                                                |
|    +──────────────+     +─────────────────+                      |
|    | Link Input   |────>| fetchProductInfo|                      |
|    | (addLink)    |     | (productScraper)|                      |
|    +──────────────+     +──────┬──────────+                      |
|                                |                                 |
|           +────────────────────+────────────────────+            |
|           v                    v                    v            |
|    [200: Success]       [401: NeedLogin]      [5xx: Error]       |
|    Update card          Open login modal      Show error +       |
|    with product info    (BrowserLoginModal)   retry button       |
|                                |                                 |
|  BrowserLoginModal.tsx         |                                 |
|    +───────────────────────────v──────────────────────+          |
|    | 1. GET /api/auth/login-page?task_id=xxx          |          |
|    |    -> returns ws_endpoint                         |          |
|    | 2. Connect WebSocket (CDP protocol)               |          |
|    | 3. Stream Page.screencastFrame to <canvas>        |          |
|    | 4. Forward mouse/keyboard events to remote browser|          |
|    | 5. User completes login (QR code / SMS / etc.)    |          |
|    | 6. Click "Login Complete"                          |          |
|    | 7. POST /api/auth/confirm { task_id }             |          |
|    |    -> backend extracts cookies, re-crawls          |          |
|    |    -> returns ProductInfo                          |          |
|    +──────────────────────────────────────────────────+          |
+──────────────────────────────────────────────────────────────────+
                              |
                              v
+──────────────────────────────────────────────────────────────────+
|  Backend (Node/Python - http://120.76.142.91:8910)               |
|                                                                  |
|  POST /api/extract                                               |
|    Input:  { url: string, cookies?: string }                     |
|    Output: { success, data?: ProductInfo }                       |
|            or 401 { need_login: true, task_id: string }          |
|                                                                  |
|  GET /api/auth/login-page?task_id=xxx                            |
|    Output: { ws_endpoint: string }                               |
|    (Launches headless browser, opens platform login page,        |
|     exposes CDP WebSocket endpoint for screencast)               |
|                                                                  |
|  POST /api/auth/confirm                                          |
|    Input:  { task_id: string }                                   |
|    Output: { success, data?: ProductInfo }                       |
|    (Extracts cookies from browser session, closes browser,       |
|     re-crawls the original URL with captured cookies)            |
+──────────────────────────────────────────────────────────────────+
```

## API Endpoints

### 1. `POST /api/extract` - Extract product info

**Request:**
```json
{
  "url": "https://item.taobao.com/item.htm?id=123456",
  "cookies": "(optional) cookie string from previous login"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "title": "Product name here",
    "image": "https://img.alicdn.com/...",
    "platform": "taobao",
    "price": "99.00"
  }
}
```

**Response (Login Required - 401):**
```json
{
  "success": false,
  "need_login": true,
  "task_id": "task_abc123",
  "error": "Platform login required"
}
```

**Response (Error - 5xx):**
```json
{
  "success": false,
  "error": "Crawl failed: timeout / blocked / invalid URL"
}
```

### 2. `GET /api/auth/login-page` - Start remote browser login session

**Query Parameters:**
- `task_id` (required): The task ID returned from the 401 response

**Response (200):**
```json
{
  "ws_endpoint": "ws://120.76.142.91:8910/devtools/browser/xxxx"
}
```

The backend:
1. Launches a headless Chromium browser (via Playwright / Puppeteer)
2. Navigates to the platform's login page
3. Exposes the CDP (Chrome DevTools Protocol) WebSocket endpoint
4. Frontend connects to this endpoint for real-time screencast + input forwarding

### 3. `POST /api/auth/confirm` - Confirm login & re-extract

**Request:**
```json
{
  "task_id": "task_abc123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "title": "Product name here",
    "image": "https://img.alicdn.com/...",
    "platform": "taobao",
    "price": "99.00"
  }
}
```

The backend:
1. Captures all cookies from the browser session
2. Closes the remote browser
3. Re-crawls the original product URL with captured cookies
4. Returns the extracted product info

## Frontend Flow (Step by Step)

### Normal Extraction (No Login Required)

```
User pastes URL ─> clicks "Add"
      |
      v
addLink(url)
  ├─ Validate URL format
  ├─ Check duplicate & max limit (5)
  ├─ detectPlatform(url) -> PlatformInfo (icon, color, name)
  ├─ Create ProductLinkItem { status: "fetching" }
  ├─ Render card with loading spinner + platform badge
  └─ fetchProductInfo(item)
        |
        v
  extractProduct(url)  ->  POST /api/extract { url }
        |
        v
  200 OK: { success: true, data: ProductInfo }
        |
        v
  Update item: { status: "success", product: { title, image, price } }
        |
        v
  Card shows product thumbnail, title, price, platform badge
```

### Login-Required Extraction (401 Flow)

```
extractProduct(url)  ->  POST /api/extract { url }
      |
      v
401: { need_login: true, task_id: "xxx" }
      |
      v
throw NeedLoginError(task_id)
      |
      v
fetchProductInfo catches NeedLoginError
  ├─ Update item: { status: "need_login", taskId }
  ├─ Set browserLoginTaskId, browserLoginLinkId
  └─ Open BrowserLoginModal
            |
            v
      BrowserLoginModal mounts
        ├─ startLoginSession(taskId) -> GET /api/auth/login-page?task_id=xxx
        ├─ Receives ws_endpoint
        ├─ Connects WebSocket to CDP endpoint
        ├─ Sends Page.startScreencast command
        └─ Rendering loop:
              Page.screencastFrame -> decode base64 JPEG -> draw to <canvas>
              Mouse/Keyboard events -> CDP Input.dispatch* commands
            |
            v
      User completes login (scans QR code / enters SMS code / etc.)
            |
            v
      User clicks "Login Complete" button
            |
            v
      confirmLogin(taskId) -> POST /api/auth/confirm { task_id }
            |
            v
      200 OK: { success: true, data: ProductInfo }
            |
            v
      handleBrowserLoginSuccess(product)
        ├─ Update item: { status: "success", product }
        └─ Close modal
```

### Error Recovery

```
extractProduct(url) throws (non-401 error)
      |
      v
fetchProductInfo catches generic error
  ├─ Build detailed error string (type, message, status, URL, stack)
  ├─ Update item: { status: "error", error: errDetail }
  └─ Card shows:
        ├─ "Info unavailable" message
        ├─ "Retry" button -> retryLink(id)
        └─ "Details" button -> alert with full error info
```

## Frontend Files

| File | Responsibility |
|------|---------------|
| `productScraper.ts` | API client functions (`extractProduct`, `startLoginSession`, `confirmLogin`), platform detection, error classes |
| `BrowserLoginModal.tsx` | CDP screencast viewer, mouse/keyboard forwarding, login confirmation flow |
| `TryItSection.tsx` | Form UI, link management (add/remove/retry), state orchestration, modal lifecycle |
| `I18nContext.tsx` | All translatable strings (zh/en) for the scraping & login flow |

## ProductLinkItem State Machine

```
          addLink()
              |
              v
        ┌─────────────┐
        │  "fetching"  │ <── retryLink()
        └──────┬───────┘
               |
      extractProduct(url)
               |
     ┌─────────┼──────────┐
     v         v          v
┌─────────┐ ┌──────────┐ ┌─────────┐
│"success"│ │"need_login│ │ "error" │
└─────────┘ └─────┬────┘ └────┬────┘
                   |           |
          BrowserLoginModal    | retryLink()
             confirmLogin      |     |
                   |           |     v
                   v           | "fetching"
              "success"        |
                               v
                          (loops back)
```

## Key Design Decisions

### Why CDP Screencast Instead of iframe?

1. **Cross-Origin Restrictions**: An `<iframe>` loading `https://login.taobao.com` would be blocked by `X-Frame-Options: DENY` and CSP headers that most platforms set.
2. **Cookie Capture**: Even if an iframe rendered, JavaScript cannot read cookies from a cross-origin iframe (SameSite, HttpOnly restrictions). The cookies live in the user's browser, not accessible to our app.
3. **Mixed Content**: Our app may run on HTTPS while the backend is HTTP. Browsers block mixed content in iframes.
4. **CDP Approach**: The login happens in a server-side Chromium instance. The backend has full access to cookies. The frontend only displays a video-like stream of screenshots and forwards user input events. No cross-origin issues.

### Platform Detection

Frontend detects the platform from the URL before sending to backend (for immediate UI feedback: icon, color, name). This is a best-effort match using regex patterns. The backend performs authoritative platform detection during crawling.

### Error Resilience

- Links with `status: "error"` or `status: "need_login"` still count as added links (shown with platform badge + URL)
- Users can retry failed links without re-entering the URL
- The "Details" debug button shows full error info for developer troubleshooting
- BrowserLoginModal handles WebSocket disconnection gracefully

## Backend Implementation Notes (for backend developers)

### POST /api/extract
1. Receive `{ url, cookies? }`
2. If cookies provided, set them in the crawler session
3. Attempt to fetch the product page (using Playwright/Puppeteer/requests)
4. If anti-bot / login wall detected:
   - Create a task record with the original URL
   - Return 401 with `{ need_login: true, task_id }`
5. If successful, parse HTML for product info (title, main image, price)
6. Return `{ success: true, data: { title, image, platform, price } }`

### GET /api/auth/login-page
1. Receive `task_id`
2. Look up the original URL from the task record
3. Launch a Chromium instance (Playwright recommended)
4. Navigate to the platform's login page
5. Enable CDP access (expose WebSocket endpoint)
6. Return `{ ws_endpoint }`
7. Keep the browser alive until `/api/auth/confirm` or timeout (e.g. 5 minutes)

### POST /api/auth/confirm
1. Receive `{ task_id }`
2. Extract all cookies from the Chromium session
3. Store cookies for future crawls (per-platform cookie cache)
4. Close the browser
5. Re-crawl the original URL with the captured cookies
6. Return the product info
