import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Printer, AlertCircle, Eye, EyeOff, Lock } from "lucide-react";
import { login } from "../utils/auth";
import "./Login.css";

const DEMO_EMAIL = "admin@veesham.com";
const DEMO_PASSWORD = "admin123";

const PRESS_JOBS = [
  { id: "#4819", area: "Line 1 · Finishing", status: "complete" },
  { id: "#4823", area: "Die-cut · Bay 2", status: "queued" },
  { id: "#4817", area: "Press 1 · Digital", status: "running" },
  { id: "#4814", area: "Line 2 · Binding", status: "complete" },
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
      <div className="login__brand-panel">
        <div className="login__grid-bg" aria-hidden="true" />
        <div className="login__vignette" aria-hidden="true" />

        <div className="login__top-row">
          <span className="login__kicker">
            <span className="login__reg-mark" aria-hidden="true" />
            Production systems
          </span>
          <div className="login__cmyk" aria-hidden="true">
            <span className="login__cmyk-dot login__cmyk-dot--c" />
            <span className="login__cmyk-dot login__cmyk-dot--m" />
            <span className="login__cmyk-dot login__cmyk-dot--y" />
            <span className="login__cmyk-dot login__cmyk-dot--k" />
            <span className="login__reg-mark" />
          </div>
        </div>

        <div className="login__brand-content">
          <h1 className="login__wordmark">VEESHAM</h1>
          <p className="login__tagline">Production Job Dashboard</p>

          <div className="login__press-floor">
            <div className="login__press-floor-header">
              <span className="login__press-floor-title">
                <span className="login__status-dot login__status-dot--live" />
                Live press floor
              </span>
              <span className="login__press-floor-meta">03 lines active</span>
            </div>
            <ul className="login__press-floor-list">
              {PRESS_JOBS.map((job) => (
                <li key={job.id} className="login__press-floor-row">
                  <span className={`login__status-dot login__status-dot--${job.status}`} />
                  <span className="login__job-id">JOB {job.id}</span>
                  <span className="login__job-area">{job.area}</span>
                  <span className={`login__job-status login__job-status--${job.status}`}>{job.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="login__footer-mark">
          <span className="login__reg-mark" aria-hidden="true" />
          Press floor network · Uptime 99.98%
        </div>
      </div>

      <div className="login__form-side">
        <div className="login__form-wrap">
          <div className="login__form-header">
            <div className="login__logo">
              <Printer size={20} strokeWidth={2.2} />
            </div>
            <h2 className="login__heading">Sign in</h2>
            <p className="login__subtitle">Enter your production dashboard credentials</p>
          </div>

          <form className="login__form" onSubmit={handleSubmit}>
            {error && (
              <div className="login__error" role="alert">
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
              <button type="button" className="login__forgot">
                Forgot password?
              </button>
            </div>

            <button type="submit" className="login__submit">
              Sign in
            </button>
          </form>

          <div className="login__demo">
            <div className="login__demo-divider">
              <span />
              Demo access
              <span />
            </div>
            <div className="login__demo-chips">
              <button type="button" className="login__chip" onClick={() => setEmail(DEMO_EMAIL)}>
                {DEMO_EMAIL}
              </button>
              <button type="button" className="login__chip" onClick={() => setPassword(DEMO_PASSWORD)}>
                {DEMO_PASSWORD}
              </button>
            </div>
          </div>

          <p className="login__security">
            <Lock size={12} strokeWidth={2.2} />
            Secured connection · SSO available
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
