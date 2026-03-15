import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { AcademicPage } from "./pages/AcademicPage";
import { AdmissionPage } from "./pages/AdmissionPage";
import { NoticesPage } from "./pages/NoticesPage";
import { GalleryPage } from "./pages/GalleryPage";
import { ContactPage } from "./pages/ContactPage";
import { Layout } from "./components/Layout";

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
    ],
  },
]);
