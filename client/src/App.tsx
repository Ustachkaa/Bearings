import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Shell } from "./components/Shell";
import { HomePage } from "./pages/Home";
import { LearnPage } from "./pages/Learn";
import { LessonPage } from "./pages/Lesson";
import { ToolsPage } from "./pages/Tools";
import { ExplorePage } from "./pages/Explore";
import { WatchlistPage } from "./pages/Watchlist";
import { AlertsPage } from "./pages/Alerts";
import { PortfolioPage } from "./pages/Portfolio";
import { SettingsPage } from "./pages/Settings";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<HomePage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="learn/:id" element={<LessonPage />} />
          <Route path="tools" element={<ToolsPage />} />
          <Route path="tools/:tool" element={<ToolsPage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="explore/:symbol" element={<ExplorePage />} />
          <Route path="watchlist" element={<WatchlistPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </>
  );
}
