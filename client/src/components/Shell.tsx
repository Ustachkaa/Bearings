import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { CompassRose, IcBell, IcBook, IcBriefcase, IcCalc, IcHome, IcList, IcMenu, IcMoon, IcSearch, IcSettings, IcSun, IcX } from "./icons";
import { TickerSearch } from "./TickerSearch";
import { useTheme } from "@/lib/theme";
import { useAlertEvents, useAlertStatus } from "@/lib/queries";
import "./shell.css";

const NAV = [
  { to: "/", label: "Home", icon: IcHome, end: true },
  { to: "/learn", label: "Learn", icon: IcBook },
  { to: "/tools", label: "Tools", icon: IcCalc },
  { to: "/explore", label: "Explore", icon: IcSearch },
  { to: "/watchlist", label: "Watchlist", icon: IcList },
  { to: "/alerts", label: "Alerts", icon: IcBell },
  { to: "/portfolio", label: "Practice", icon: IcBriefcase },
  { to: "/settings", label: "Settings", icon: IcSettings },
];

export function Shell() {
  const { theme, toggle } = useTheme();
  const { data: events } = useAlertEvents(20);
  const { data: status } = useAlertStatus();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname]);
  const unread = events?.unread ?? 0;

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <NavLink to="/" className="brand">
          <CompassRose size={38} />
          <div>
            <div className="brand-name">Bearings</div>
            <div className="brand-sub">learn · plan · follow</div>
          </div>
        </NavLink>
        <nav className="nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
              <n.icon size={18} />
              <span>{n.label}</span>
              {n.to === "/alerts" && unread > 0 && <span className="nav-count">{unread}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div className="engine">
            <span className={`engine-dot ${status ? (status.emailConfigured ? "on" : "warn") : ""}`} />
            <div className="col" style={{ gap: 0 }}>
              <span className="tiny" style={{ fontWeight: 600 }}>
                Alert engine {status ? "running" : "…"}
              </span>
              <span className="tiny muted-3">{status ? (status.emailConfigured ? "email connected" : "email not set up") : "connecting"}</span>
            </div>
          </div>
          <button className="btn ghost sm theme-btn" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? <IcSun size={16} /> : <IcMoon size={16} />}
            {theme === "dark" ? "Daylight" : "Night watch"}
          </button>
        </div>
      </aside>
      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}

      <div className="main">
        <header className="topbar">
          <button className="btn ghost icon menu-btn" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <IcX /> : <IcMenu />}
          </button>
          <TickerSearch compact />
          <div className="topbar-right">
            <NavLink to="/alerts" className="btn ghost icon" aria-label="Alerts">
              <IcBell />
              {unread > 0 && <span className="bell-dot" />}
            </NavLink>
          </div>
        </header>
        <main className="content" key={loc.pathname}>
          <Outlet />
        </main>
        <footer className="foot">
          <span>Bearings is a learning tool. Signals describe current prices, they do not predict the future. Not financial advice.</span>
        </footer>
      </div>

      <nav className="bottom-nav">
        {NAV.slice(0, 5).map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `bn-item ${isActive ? "active" : ""}`}>
            <n.icon size={20} />
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
