import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  setError("");
  setLoading(true);

  try {
    const response = await api.post(
      "/auth/login",
      formData
    );

    login(response.data);

    if (response.data.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else if (response.data.role === "RECRUITER") {
      navigate("/recruiter/dashboard");
    } else {
      navigate("/student/dashboard");
    }
  } catch (error) {
    console.error("Login failed:", error);

    setError(
      error.response?.data?.message ||
      "Login failed. Please check your credentials."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <h1>PlaceSync Login</h1>

      {error && (
        <p>{error}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <button
  type="submit"
  disabled={loading}
>
  {loading ? "Logging in..." : "Login"}
</button>
      </form>
    </div>
  );
}

export default Login;