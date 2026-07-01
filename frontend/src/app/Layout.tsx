import { Outlet } from "react-router-dom";
import Sidebar, { type SidebarItem } from "../components/sidebar/Sidebar"

const sidebarItems: SidebarItem[] = [
  { label: "Customer Dashboard", to: "/customer" },
  { label: "Shipment Dashboard", to: "/shipment" },
  { label: "Chatbot", to: "/chatbot" },
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