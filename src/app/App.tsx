import { RouterProvider } from "react-router";
import { I18nProvider } from "./components/I18nContext";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <I18nProvider>
      <>
        <RouterProvider router={router} />
        <Toaster position="top-center" />
      </>
    </I18nProvider>
  );
}
