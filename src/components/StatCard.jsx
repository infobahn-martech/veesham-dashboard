import clsx from "clsx";
import "./StatCard.css";

function StatCard({ icon: Icon, label, value, variant = "neutral", meta }) {
  return (
    <div className="card stat-card">
      <div className={clsx("stat-card__icon", `stat-card__icon--${variant}`)}>
        <Icon size={18} strokeWidth={2} />
      </div>
      <div>
        <p className="stat-card__value">{value}</p>
        <p className="stat-card__label">{label}</p>
        {/* {meta && <p className={clsx("stat-card__meta", `stat-card__meta--${meta.tone}`)}>{meta.text}</p>} */}
      </div>
    </div>
  );
}

export default StatCard;
