import { Outlet } from "react-router-dom";
import Sidebar, { type SidebarItem } from "../components/sidebar/Sidebar"
import "../components/sidebar/Sidebar.css";

const sidebarItems: SidebarItem[] = [
  { label: "Customer Dashboard", to: "/customer" },
  { label: "Shipment Dashboard", to: "/shipment" },
];

export default function Layout() {
  return (
    <div className="app-shell">
      <Sidebar items={sidebarItems} />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
