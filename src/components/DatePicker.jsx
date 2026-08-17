import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import "./DatePicker.css";

const POPOVER_WIDTH = 280;
const POPOVER_HEIGHT_ESTIMATE = 360;

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseISO(value) {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function formatDisplay(value) {
  const date = parseISO(value);
  if (!date) return "";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function buildGrid(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    return { date, inMonth: date.getMonth() === month };
  });
}

function isSameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function DatePicker({ id, value, onChange, placeholder = "Select date", ariaLabel, className, clearable = true, min, max, disabled }) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => parseISO(value) || new Date());
  const [coords, setCoords] = useState(null);
  const rootRef = useRef(null);
  const popoverRef = useRef(null);

  const selected = parseISO(value);
  const today = new Date();
  const minDate = parseISO(min);
  const maxDate = parseISO(max);

  useLayoutEffect(() => {
    if (!open) return;
    function updatePosition() {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      const openUpward = rect.bottom + 6 + POPOVER_HEIGHT_ESTIMATE > window.innerHeight;
      const top = openUpward ? rect.top - 6 - POPOVER_HEIGHT_ESTIMATE : rect.bottom + 6;
      const left = Math.min(rect.left, window.innerWidth - POPOVER_WIDTH - 8);
      setCoords({ top: Math.max(top, 8), left: Math.max(left, 8) });
    }
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e) {
      if (rootRef.current?.contains(e.target) || popoverRef.current?.contains(e.target)) return;
      setOpen(false);
    }
    function handleEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }
    function handleScroll(e) {
      if (popoverRef.current?.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  function isDisabled(date) {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  }

  function selectDate(date) {
    if (isDisabled(date)) return;
    onChange(toISO(date));
    setOpen(false);
  }

  function changeMonth(delta) {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  }

  const grid = buildGrid(viewDate);

  return (
    <div className={clsx("date-picker", disabled && "date-picker--disabled")} data-open={open} ref={rootRef}>
      <button
        type="button"
        id={id}
        className={clsx("date-picker__trigger", className)}
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => {
          setOpen((v) => {
            const next = !v;
            if (next) setViewDate(selected || new Date());
            return next;
          });
        }}
      >
        <Calendar size={16} strokeWidth={2} className="date-picker__icon" />
        <span className={clsx("date-picker__value", !value && "date-picker__value--placeholder")}>
          {value ? formatDisplay(value) : placeholder}
        </span>
      </button>

      {open &&
        coords &&
        createPortal(
          <div
            className="date-picker__popover animate-in--scale"
            ref={popoverRef}
            role="dialog"
            style={{ top: coords.top, left: coords.left }}
          >
            <div className="date-picker__header">
              <button type="button" className="date-picker__nav" aria-label="Previous month" onClick={() => changeMonth(-1)}>
                <ChevronLeft size={16} strokeWidth={2} />
              </button>
              <span className="date-picker__month">
                {viewDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
              </span>
              <button type="button" className="date-picker__nav" aria-label="Next month" onClick={() => changeMonth(1)}>
                <ChevronRight size={16} strokeWidth={2} />
              </button>
            </div>

            <div className="date-picker__weekdays">
              {WEEKDAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="date-picker__grid">
              {grid.map(({ date, inMonth }) => (
                <button
                  type="button"
                  key={date.toISOString()}
                  className={clsx(
                    "date-picker__day",
                    !inMonth && "date-picker__day--muted",
                    isSameDay(date, today) && "date-picker__day--today",
                    isSameDay(date, selected) && "date-picker__day--selected"
                  )}
                  disabled={isDisabled(date)}
                  onClick={() => selectDate(date)}
                >
                  {date.getDate()}
                </button>
              ))}
            </div>

            <div className="date-picker__footer">
              {clearable ? (
                <button
                  type="button"
                  className="date-picker__footer-btn"
                  onClick={() => {
                    onChange("");
                    setOpen(false);
                  }}
                >
                  Clear
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                className="date-picker__footer-btn"
                onClick={() => {
                  if (!isDisabled(today)) selectDate(today);
                }}
              >
                Today
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default DatePicker;
