import { useNavigate } from "react-router-dom";
import { UserCircle, Mail, ShieldCheck, Building2, KeyRound, LogOut } from "lucide-react";
import { getCurrentUser, logout } from "../utils/auth";
import "./MyAccount.css";

function MyAccount() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const fields = [
    { icon: UserCircle, label: "Name", value: user?.name },
    { icon: Mail, label: "Email", value: user?.email },
    { icon: ShieldCheck, label: "Role", value: user?.role },
    { icon: Building2, label: "Company", value: user?.company },
  ];

  return (
    <div className="my-account">
      <div className="card my-account__profile">
        <div className="my-account__avatar">
          <UserCircle size={64} strokeWidth={1.3} />
        </div>
        <h2 className="my-account__name">{user?.name}</h2>
        <span className="my-account__role-badge">{user?.role}</span>
        <p className="my-account__company">{user?.company}</p>
      </div>

      <div className="card my-account__details">
        <h3 className="section-title">Account Information</h3>
        <div className="my-account__fields">
          {fields.map(({ icon: Icon, label, value }) => (
            <div key={label} className="my-account__field">
              <Icon size={18} strokeWidth={2} className="my-account__field-icon" />
              <div>
                <p className="my-account__field-label">{label}</p>
                <p className="my-account__field-value">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="my-account__actions">
          <button type="button" className="btn btn-secondary">
            <KeyRound size={16} strokeWidth={2} />
            Change Password
          </button>
          <button type="button" className="btn btn-primary" onClick={handleLogout}>
            <LogOut size={16} strokeWidth={2} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyAccount;
