export interface BackendGenerationRecord {
  id: number;
  task_id: string;
  mode: string;
  seed_mode?: string | null;
  scene_description?: string | null;
  user_image_path?: string | null;
  scene_ref_image_path?: string | null;
  product_links_json?: string | null;
  product_images_json?: string | null; // JSON string of string[]
  generated_image_paths?: string | null; // JSON string of string[]
  generated_copy?: string | null;
  status: 0 | 1 | 2; // 0: success, 1: processing, 2: failed
  error_message?: string | null;
  credit_cost: number;
  duration?: number | null;
  created_at: string;
}

export interface GenerationHistory {
  id: string;
  timestamp: number;
  userImage: string;
  productImage: string;
  productImages: string[]; // Added support for multiple product images
  resultImage: string;
  resultImages: string[]; // Added support for multiple result images
  prompt: string;
  scene?: string;
  mode?: "copy" | "inspire";
  status: "success" | "processing" | "failed";
  duration?: number;
  generatedCopy?: string;
}

export async function getGenerations(userId: number | string): Promise<GenerationHistory[]> {
  console.log("getGenerations called", userId);
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found in localStorage");
      return [];
    }

    console.log("Sending request to /api/auth/user/history");
    const response = await fetch(`/api/auth/user/history`, {
      method: "GET", // Explicitly set method
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.dispatchEvent(new Event("scenew:unauthorized"));
      }
      console.error("Failed to fetch generation history:", response.statusText);
      return [];
    }

    const records: BackendGenerationRecord[] = await response.json();

    return records
      .filter(record => record.status !== 2) // Filter out failed records as per requirement
      .map(record => {
        // Parse JSON strings safely
        let productImages: string[] = [];
        try {
          if (record.product_images_json) {
            const parsed = JSON.parse(record.product_images_json);
            productImages = Array.isArray(parsed) ? parsed : [parsed];
          }
        } catch (e) {
          console.warn("Failed to parse product_images_json", e);
        }

        let resultImages: string[] = [];
        try {
          if (record.generated_image_paths) {
            const parsed = JSON.parse(record.generated_image_paths);
            resultImages = Array.isArray(parsed) ? parsed : [parsed];
          }
        } catch (e) {
          console.warn("Failed to parse generated_image_paths", e);
        }

        return {
          id: record.id.toString(),
          timestamp: new Date(record.created_at).getTime(),
          userImage: record.user_image_path || "",
          productImage: productImages[0] || "", // Fallback to first image
          productImages: productImages,
          resultImage: resultImages[0] || "", // Fallback to first image
          resultImages: resultImages,
          prompt: record.scene_description || "",
          scene: record.seed_mode || record.mode, // Use seed_mode or mode as scene name fallback
          mode: record.mode === "copy" ? "copy" : "inspire", // Normalize mode
          status: record.status === 1 ? "processing" : "success",
          duration: record.duration || 0,
          generatedCopy: record.generated_copy || ""
        };
      });
  } catch (e) {
    console.error("Failed to load generations", e);
    return [];
  }
}

// Mock data for demo if empty
export async function initializeMockData(userId: number | string) {
  const existing = await getGenerations(userId);
  // In a real app with backend, we don't need to initialize local mock data.
  // This function is kept to avoid breaking existing imports but now does nothing or logs.
  console.log("Mock data initialization skipped as we are using backend API.");
}

// Deprecated function kept for compatibility
export function saveGeneration(generation: Omit<GenerationHistory, "id" | "timestamp">) {
  console.warn("saveGeneration is deprecated. Please use backend API to create tasks.");
  return null;
}
