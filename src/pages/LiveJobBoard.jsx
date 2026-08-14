import { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw, CalendarCheck } from "lucide-react";
import clsx from "clsx";
import { jobs, STATUSES } from "../data/jobs";
import StatusBadge from "../components/StatusBadge";
import "./LiveJobBoard.css";

const REFRESH_INTERVAL_MS = 15000;
const todayStr = new Date().toISOString().slice(0, 10);

function formatDateTime(date) {
  return {
    time: date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    day: date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
  };
}

function LiveJobBoard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [todayOnly, setTodayOnly] = useState(false);
  const [now, setNow] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const clockTimer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(clockTimer);
  }, []);

  useEffect(() => {
    const refreshTimer = setInterval(() => {
      setRefreshing(true);
      setTimeout(() => setRefreshing(false), 900);
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(refreshTimer);
  }, []);

  const filteredJobs = useMemo(() => {
    const term = search.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesSearch =
        !term ||
        job.jobNo.toLowerCase().includes(term) ||
        job.client.toLowerCase().includes(term) ||
        job.item.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "All" || job.status === statusFilter;
      const matchesToday = !todayOnly || job.deliveryDate === todayStr;
      return matchesSearch && matchesStatus && matchesToday;
    });
  }, [search, statusFilter, todayOnly]);

  const { time, day } = formatDateTime(now);

  return (
    <div className="job-board">
      <div className="job-board__toolbar">
        <div className="job-board__search">
          <Search size={18} strokeWidth={2} />
          <input
            type="text"
            placeholder="Search job no, client or item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="job-board__filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <button
          type="button"
          className={clsx("job-board__toggle", todayOnly && "job-board__toggle--active")}
          onClick={() => setTodayOnly((v) => !v)}
        >
          <CalendarCheck size={16} strokeWidth={2} />
          Today's Jobs
        </button>

        <div className="job-board__clock">
          <div className="job-board__refresh">
            <RefreshCw size={14} strokeWidth={2} className={clsx(refreshing && "job-board__refresh-icon--spin")} />
            <span>Auto-refresh</span>
          </div>
          <div className="job-board__time">{time}</div>
          <div className="job-board__day">{day}</div>
        </div>
      </div>

      <div className="job-board__board-wrap">
        <table className="job-board__table">
          <thead>
            <tr>
              <th>Job No.</th>
              <th>Client</th>
              <th>Item</th>
              <th>Total Qty</th>
              <th>Delivered</th>
              <th>Balance</th>
              <th>Delivery Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr
                key={job.id}
                className={clsx(
                  (job.status === "Delayed" || job.status === "Hold") && "job-board__row--alert"
                )}
              >
                <td className="job-board__jobno">{job.jobNo}</td>
                <td>{job.client}</td>
                <td>{job.item}</td>
                <td>{job.totalQty.toLocaleString()}</td>
                <td>{job.deliveredQty.toLocaleString()}</td>
                <td>{job.balanceQty.toLocaleString()}</td>
                <td>{job.deliveryDate}</td>
                <td>
                  <StatusBadge status={job.status} />
                </td>
              </tr>
            ))}
            {filteredJobs.length === 0 && (
              <tr>
                <td colSpan={8} className="job-board__empty">
                  No jobs match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LiveJobBoard;
