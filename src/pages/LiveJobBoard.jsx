import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Search, RefreshCw, CalendarCheck, Maximize, Minimize } from "lucide-react";
import clsx from "clsx";
import { jobs, STATUSES } from "../data/jobs";
import { getInitials } from "../utils/initials";
import StatusBadge from "../components/StatusBadge";
import "./LiveJobBoard.css";

const REFRESH_INTERVAL_MS = 15000;
const PAGE_SIZE = 12;
const todayStr = new Date().toISOString().slice(0, 10);

function formatDateTime(date) {
  return {
    time: date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    day: date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
  };
}

function LiveJobBoard() {
  const { setIsChromeHidden } = useOutletContext();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [todayOnly, setTodayOnly] = useState(false);
  const [now, setNow] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [isTvMode, setIsTvMode] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [appliedFilters, setAppliedFilters] = useState({ search, statusFilter, todayOnly });

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

  useEffect(() => {
    function handleFullscreenChange() {
      if (!document.fullscreenElement) {
        setIsTvMode(false);
        setIsChromeHidden(false);
      }
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [setIsChromeHidden]);

  useEffect(() => {
    return () => setIsChromeHidden(false);
  }, [setIsChromeHidden]);

  if (
    appliedFilters.search !== search ||
    appliedFilters.statusFilter !== statusFilter ||
    appliedFilters.todayOnly !== todayOnly
  ) {
    setAppliedFilters({ search, statusFilter, todayOnly });
    setVisibleCount(PAGE_SIZE);
  }

  async function toggleTvMode() {
    if (!isTvMode) {
      try {
        await document.documentElement.requestFullscreen();
      } catch {
        // Fullscreen may be denied/unsupported — still switch to the maximized layout.
      }
      setIsTvMode(true);
      setIsChromeHidden(true);
    } else {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      setIsTvMode(false);
      setIsChromeHidden(false);
    }
  }

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

  const visibleJobs = filteredJobs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredJobs.length;

  const { time, day } = formatDateTime(now);

  return (
    <div className={clsx("job-board", isTvMode && "job-board--tv")}>
      <div className="job-board__toolbar">
        <div className="job-board__toolbar-main">
          <div className="job-board__search">
            <Search size={18} strokeWidth={2} />
            <input
              type="text"
              aria-label="Search job no, client or item"
              placeholder="Search job no, client or item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="job-board__filter"
            aria-label="Filter by status"
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
        </div>

        <div className="job-board__toolbar-status">
          <div className="job-board__live">
            <span className="job-board__live-dot" />
            LIVE
          </div>

          <div className="job-board__clock">
            <div className="job-board__refresh">
              <RefreshCw size={13} strokeWidth={2} className={clsx(refreshing && "job-board__refresh-icon--spin")} />
              <span>Auto-refresh</span>
            </div>
            <div className="job-board__time">{time}</div>
            <div className="job-board__day">{day}</div>
          </div>

          <button
            type="button"
            className="job-board__tv-btn"
            onClick={toggleTvMode}
            aria-label={isTvMode ? "Exit TV mode" : "Enter TV mode"}
            title={isTvMode ? "Exit TV mode" : "Enter TV mode"}
          >
            {isTvMode ? <Minimize size={18} strokeWidth={2} /> : <Maximize size={18} strokeWidth={2} />}
          </button>
        </div>
      </div>

      <div className="card job-board__table-card">
        <div className="job-board__board-wrap">
          <table className="job-board__table">
            <thead>
              <tr>
                <th>Job No.</th>
                <th>Client</th>
                <th>Item</th>
                <th className="num">Total Qty</th>
                <th className="num">Delivered</th>
                <th className="num">Balance</th>
                <th>Delivery Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleJobs.map((job) => {
                const progress = job.totalQty > 0 ? Math.min(100, (job.deliveredQty / job.totalQty) * 100) : 0;
                return (
                  <tr key={job.id} className={clsx(job.status === "Delayed" && "job-board__row--alert")}>
                    <td className="job-board__jobno">{job.jobNo}</td>
                    <td>
                      <div className="job-board__client">
                        <span className="job-board__client-avatar">{getInitials(job.client)}</span>
                        <span>{job.client}</span>
                      </div>
                    </td>
                    <td className="job-board__item">{job.item}</td>
                    <td className="num">{job.totalQty.toLocaleString()}</td>
                    <td className="num">
                      <div className="job-board__delivered">
                        <span>{job.deliveredQty.toLocaleString()}</span>
                        <span className="job-board__progress-track">
                          <span className="job-board__progress-fill" style={{ width: `${progress}%` }} />
                        </span>
                      </div>
                    </td>
                    <td className={clsx("num", job.balanceQty === 0 ? "job-board__balance--zero" : "job-board__balance--pending")}>
                      {job.balanceQty.toLocaleString()}
                    </td>
                    <td className="job-board__date">
                      {new Date(job.deliveryDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <StatusBadge status={job.status} />
                    </td>
                  </tr>
                );
              })}
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

        {filteredJobs.length > 0 && (
          <div className="job-board__footer">
            <span className="job-board__footer-count">
              Showing {visibleJobs.length} of {filteredJobs.length} jobs
            </span>
            {hasMore && (
              <button
                type="button"
                className="job-board__load-more"
                onClick={() => setVisibleCount((v) => Math.min(v + PAGE_SIZE, filteredJobs.length))}
              >
                Load more
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LiveJobBoard;
