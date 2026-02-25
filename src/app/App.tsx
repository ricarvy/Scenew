import { RouterProvider } from "react-router";
import { I18nProvider } from "./components/I18nContext";
import { router } from "./routes";

export default function App() {
  return (
    <I18nProvider>
      <RouterProvider router={router} />
    </I18nProvider>
  );
}
