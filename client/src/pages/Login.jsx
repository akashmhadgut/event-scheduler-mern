import { useState } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // After login go back or go to /
  const redirectTo = location.state?.from || "/";

  // Handle input change
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);

      const { token, user } = res.data.data;
      const userData = { ...user, token };

      // Save login
      localStorage.setItem("user", JSON.stringify(userData));
      login(userData);

      toast.success("Login successful!");
      navigate(redirectTo, { replace: true });

    } catch (err) {
      const message = err.response?.data?.error || "Invalid credentials";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Login to manage your events and join new ones.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 
                         focus:ring-2 focus:ring-blue-400 focus:border-transparent 
                         outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 
                         focus:ring-2 focus:ring-blue-400 focus:border-transparent 
                         outline-none transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white 
                        font-semibold py-2.5 rounded-lg transition duration-200 shadow-sm ${
              loading && "opacity-70 cursor-not-allowed"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-5">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
