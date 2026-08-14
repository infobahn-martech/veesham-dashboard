import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Printer, AlertCircle, Eye, EyeOff, ShieldCheck, Zap, BarChart3 } from "lucide-react";
import { login } from "../utils/auth";
import "./Login.css";

const HIGHLIGHTS = [
  { icon: Zap, text: "Real-time job status tracking" },
  { icon: BarChart3, text: "Production insights at a glance" },
  { icon: ShieldCheck, text: "Secure, role-based access" },
];

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

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
      <div className="login__panel">
        <div className="login__panel-shape login__panel-shape--one" />
        <div className="login__panel-shape login__panel-shape--two" />
        <div className="login__panel-content">
          <div className="login__panel-brand">
            <div className="login__logo">
              <Printer size={24} strokeWidth={2.2} />
            </div>
            <span className="login__panel-brand-name">Veesham</span>
          </div>
          <h2 className="login__panel-heading">Production job tracking, simplified.</h2>
          <p className="login__panel-copy">
            Monitor every job from intake to delivery with a live, unified operations dashboard.
          </p>
          <ul className="login__panel-list">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text}>
                <Icon size={16} strokeWidth={2} />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="login__form-side">
        <div className="card login__card animate-in--scale">
          <div className="login__brand">
            <div className="login__logo login__logo--compact">
              <Printer size={22} strokeWidth={2.2} />
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
              <div className="login__password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="login__password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} strokeWidth={2} /> : <Eye size={17} strokeWidth={2} />}
                </button>
              </div>
            </label>

            <div className="login__row">
              <label className="login__checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary login__submit">
              Sign In
            </button>
          </form>

          <div className="login__demo">
            <span className="login__demo-label">Demo access</span>
            <code>admin@veesham.com / admin123</code>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
