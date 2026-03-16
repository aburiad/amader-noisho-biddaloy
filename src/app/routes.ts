import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { AboutPage } from "./pages/AboutPage";
import { AcademicPage } from "./pages/AcademicPage";
import { AdmissionPage } from "./pages/AdmissionPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import BlogPage from "./pages/BlogPage";
import { ContactPage } from "./pages/ContactPage";
import { GalleryPage } from "./pages/GalleryPage";
import { HomePage } from "./pages/HomePage";
import { NoticesPage } from "./pages/NoticesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "about", Component: AboutPage },
      { path: "academic", Component: AcademicPage },
      { path: "admission", Component: AdmissionPage },
      { path: "notices", Component: NoticesPage },
      { path: "gallery", Component: GalleryPage },
      { path: "contact", Component: ContactPage },
      { path: "blog", Component: BlogPage },
      { path: "blog/:slug", Component: BlogDetailsPage },
      
    ],
  },
]);
