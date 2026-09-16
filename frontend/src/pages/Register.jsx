import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/register", formData);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">
          <div className="auth-logo">P</div>

          <h1>Create your account</h1>

          <p>
            Join PlaceSync and manage your placement journey.
          </p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="auth-form-group">
            <label htmlFor="name">
              Full name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              minLength="8"
              autoComplete="new-password"
              required
            />

            <span className="auth-helper-text">
              Password must contain at least 8 characters.
            </span>
          </div>

          <button
            className="auth-submit-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>

          <button
            type="button"
            className="auth-link-button"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </div>

      </div>
    </main>
  );
}

export default Register;