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
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">{brand}</div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
