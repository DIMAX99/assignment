import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export type SidebarItem = {
  label: string;
  to: string;
  end?: boolean;
};

type SidebarProps = {
  brand?: string;
  items: SidebarItem[];
};

export default function Sidebar({ brand = "Assignment Portal", items }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 760px)");

    const updateCollapsed = (event: MediaQueryListEvent | MediaQueryList) => {
      setCollapsed(event.matches);
    };

    updateCollapsed(mediaQuery);
    mediaQuery.addEventListener("change", updateCollapsed);

    return () => mediaQuery.removeEventListener("change", updateCollapsed);
  }, []);

  const brandShortName = brand
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className={`sidebar${collapsed ? " sidebar--collapsed" : " sidebar--expanded"}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand" title={brand}>
          {collapsed ? brandShortName : brand}
        </div>

        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setCollapsed((current) => !current)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
        >
          {collapsed ? "Open" : "Close"}
        </button>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
            title={collapsed ? item.label : undefined}
          >
            <span className="sidebar-link-label">
              {collapsed ? item.label.split(" ").map((part) => part[0]).join("") : item.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
