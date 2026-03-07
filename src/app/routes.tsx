import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./components/HomePage";
import { TryItPage } from "./components/TryItPage";
import { PricingPage } from "./components/PricingPage";
import { GenerationsPage } from "./components/GenerationsPage";
import { PrivacyPage } from "./components/PrivacyPage";
import { TermsPage } from "./components/TermsPage";
import { BlogListPage } from "./components/BlogListPage";
import { BlogDetailPage } from "./components/BlogDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "try", Component: TryItPage },
      { path: "pricing", Component: PricingPage },
      { path: "blog", Component: BlogListPage },
      { path: "blog/:id", Component: BlogDetailPage },
      { path: "generations", Component: GenerationsPage },
      { path: "privacy", Component: PrivacyPage },
      { path: "terms", Component: TermsPage },
    ],
  },
]);