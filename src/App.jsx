import { Route, Routes, useLocation } from "react-router";
import ScrollManager from "./components/ScrollManager.jsx";
import { NAV_ITEMS } from "./data/navigation.js";
import { useRouteTransition } from "./hooks/useRouteTransition.js";
import { useI18n } from "./i18n/useI18n.js";
import Contact from "./pages/Contact.jsx";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import Projects from "./pages/Projects.jsx";
import Resume from "./pages/Resume.jsx";
import Skills from "./pages/Skills.jsx";

export default function App() {
  const { t } = useI18n();
  const location = useLocation();
  const { displayLocation, viewRef, curtainRef, curtainPath } = useRouteTransition(location);
  const curtainItem = NAV_ITEMS.find((item) => item.path === curtainPath);

  return (
    <>
      <ScrollManager location={displayLocation} />
      <div className="route-view" ref={viewRef}>
        <Routes location={displayLocation}>
          <Route path="/" element={<Home />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <div className="route-curtain" ref={curtainRef} aria-hidden="true">
        <span>{curtainItem ? t(curtainItem.labelKey) : "404"}</span>
      </div>
    </>
  );
}
