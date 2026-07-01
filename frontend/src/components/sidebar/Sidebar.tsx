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

const DESKTOP_BREAKPOINT = "(min-width: 901px)";

export default function Sidebar({ brand = "Assignment Portal", items }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia(DESKTOP_BREAKPOINT).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_BREAKPOINT);

    const updateIsDesktop = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop(event.matches);

      // Collapsing to an icon rail only makes sense on the desktop layout.
      // If the viewport drops below the desktop breakpoint, always fall
      // back to the fully expanded (labelled) state so mobile users never
      // get stuck with a nav that rendered as bare initials or hidden.
      if (!event.matches) {
        setCollapsed(false);
      }
    };

    updateIsDesktop(mediaQuery);
    mediaQuery.addEventListener("change", updateIsDesktop);

    return () => mediaQuery.removeEventListener("change", updateIsDesktop);
  }, []);

  const isRail = isDesktop && collapsed;

  const brandShortName = brand
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className={`sidebar${isRail ? " sidebar--collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand" title={brand}>
          {isRail ? brandShortName : brand}
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
            title={isRail ? item.label : undefined}
          >
            <span className="sidebar-link-label">
              {isRail ? item.label.split(" ").map((part) => part[0]).join("") : item.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}