import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Printer, AlertCircle } from "lucide-react";
import { login } from "../utils/auth";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (login(email, password)) {
      navigate("/dashboard", { replace: true });
    } else {
      setError("Invalid email or password. Please try again.");
    }
  }

  return (
    <div className="login">
      <div className="card login__card">
        <div className="login__brand">
          <div className="login__logo">
            <Printer size={24} strokeWidth={2.2} />
          </div>
          <h1 className="login__brand-name">Veesham</h1>
          <p className="login__brand-tagline">Production Job Dashboard</p>
        </div>

        <form className="login__form" onSubmit={handleSubmit}>
          {error && (
            <div className="login__error">
              <AlertCircle size={16} strokeWidth={2} />
              <span>{error}</span>
            </div>
          )}

          <label className="login__field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@veesham.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="login__field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          <button type="submit" className="btn btn-primary login__submit">
            Sign In
          </button>
        </form>

        <p className="login__hint">Demo credentials: admin@veesham.com / admin123</p>
      </div>
    </div>
  );
}

export default Login;
