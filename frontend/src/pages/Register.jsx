import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setSuccess("");

    try {
      await api.post(
        "/auth/register",
        formData
      );

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("Registration failed:", error);

      setError(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    }
  };

  return (
    <div>
      <h1>Create PlaceSync Account</h1>

      {error && (
        <p>{error}</p>
      )}

      {success && (
        <p>{success}</p>
      )}

      <form onSubmit={handleSubmit}>

        <div>
          <label>Name</label>
          <br />

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <br />

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
            minLength="8"
            required
          />
        </div>

        <br />

        <div>
          <label>Role</label>
          <br />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="STUDENT">
              Student
            </option>

            <option value="ADMIN">
              Admin
            </option>
          </select>
        </div>

        <br />

        <button type="submit">
          Register
        </button>

      </form>
    </div>
  );
}

export default Register;