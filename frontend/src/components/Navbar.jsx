import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
  <nav
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 24px",
      backgroundColor: "#ffffff",
      borderBottom: "1px solid #e5e7eb",
      marginBottom: "24px",
    }}
  >
    <div>
      <h2>PlaceSync</h2>
    </div>

    {user && (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div>
          <strong>{user.name}</strong>

          <span
            style={{
              marginLeft: "8px",
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            ({user.role})
          </span>
        </div>

        <button
          onClick={() => {
            if (user.role === "ADMIN") {
              navigate("/admin/dashboard");
            } else {
              navigate("/student/dashboard");
            }
          }}
        >
          Dashboard
        </button>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    )}
  </nav>
);
}

export default Navbar;