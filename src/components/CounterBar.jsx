import clsx from "clsx";
import "./CounterBar.css";

function CounterBar({ items }) {
  return (
    <div className="counter-bar">
      {items.map(({ label, value, tone }) => (
        <div key={label} className="counter-bar__item">
          <span className={clsx("counter-bar__value", tone && `counter-bar__value--${tone}`)}>{value}</span>
          <span className="counter-bar__label">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default CounterBar;
