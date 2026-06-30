import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-buttons">
        <button onClick={() => navigate("/customer")}>
          Customer Dashboard
        </button>
        <button onClick={() => navigate("/shipment")}>
          Shipment Dashboard
        </button>
      </div>
    </div>
  );
}