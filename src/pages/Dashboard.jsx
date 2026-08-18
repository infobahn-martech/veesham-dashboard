import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Briefcase,
  Activity,
  CalendarClock,
  CheckCircle2,
  AlertTriangle,
  PauseCircle,
} from "lucide-react";
import { useJobsData } from "../context/jobsData";
import { STATUS_STYLES, DEFAULT_STATUS_STYLE } from "../data/statusStyles";
import { getInitials } from "../utils/initials";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import "./Dashboard.css";

const todayStr = new Date().toISOString().slice(0, 10);
const currentMonthKey = todayStr.slice(0, 7);
const previousMonthKey = (() => {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 7);
})();

const TOOLTIP_STYLE = {
  contentStyle: {
    borderRadius: 10,
    border: "1px solid #e2e6ec",
    boxShadow: "0 4px 12px rgba(16, 24, 40, 0.08)",
    fontSize: 13,
  },
  labelStyle: { fontWeight: 600, color: "#1b2430" },
  cursor: { fill: "rgba(216, 155, 43, 0.06)" },
};

function statusColor(status) {
  return (STATUS_STYLES[status] || DEFAULT_STATUS_STYLE).color;
}

function Dashboard() {
  const { jobs: allJobs } = useJobsData();
  const jobs = useMemo(() => allJobs.filter((j) => !j.archived), [allJobs]);

  const stats = useMemo(() => {
    const total = jobs.length;
    const active = jobs.filter(
      (j) => j.status === "In Progress" || j.status === "Partially Delivered"
    ).length;
    const dueToday = jobs.filter((j) => j.deliveryDate === todayStr).length;
    const completed = jobs.filter((j) => j.status === "Completed").length;
    const delayed = jobs.filter((j) => j.status === "Delayed").length;
    const onHold = jobs.filter((j) => j.status === "Hold").length;
    return { total, active, dueToday, completed, delayed, onHold };
  }, [jobs]);

  const completedThisMonth = useMemo(
    () => jobs.filter((j) => j.status === "Completed" && j.deliveryDate.startsWith(currentMonthKey)).length,
    [jobs]
  );

  const completedLastMonth = useMemo(
    () => jobs.filter((j) => j.status === "Completed" && j.deliveryDate.startsWith(previousMonthKey)).length,
    [jobs]
  );

  const completedTrend = useMemo(() => {
    if (completedLastMonth === 0) {
      if (completedThisMonth === 0) return { text: "— 0% vs last month", tone: "neutral" };
      return { text: "↑ New vs last month", tone: "positive" };
    }
    const change = Math.round(
      ((completedThisMonth - completedLastMonth) / completedLastMonth) * 100
    );
    if (change > 0) return { text: `↑ ${change}% vs last month`, tone: "positive" };
    if (change < 0) return { text: `↓ ${Math.abs(change)}% vs last month`, tone: "negative" };
    return { text: "— 0% vs last month", tone: "neutral" };
  }, [completedThisMonth, completedLastMonth]);

  const dueTodayUrgent = useMemo(
    () => jobs.filter((j) => j.deliveryDate === todayStr && j.status !== "Completed").length,
    [jobs]
  );

  const statusDistribution = useMemo(() => {
    const counts = {};
    jobs.forEach((j) => {
      counts[j.status] = (counts[j.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [jobs]);

  const bySalesperson = useMemo(() => {
    const counts = {};
    jobs.forEach((j) => {
      counts[j.salesperson] = (counts[j.salesperson] || 0) + 1;
    });
    return Object.entries(counts).map(([name, jobCount]) => ({
      name: name.split(" ")[0],
      jobs: jobCount,
    }));
  }, [jobs]);

  const deliveryTrend = useMemo(() => {
    const byDate = {};
    jobs.forEach((j) => {
      byDate[j.deliveryDate] = (byDate[j.deliveryDate] || 0) + j.deliveredQty;
    });
    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, deliveredQty]) => ({
        date: date.slice(5),
        deliveredQty,
      }));
  }, [jobs]);

  const priorityJobs = useMemo(() => {
    const priorityOrder = { Delayed: 0, Hold: 1, WFA: 2, "In Progress": 3, Pending: 4 };
    return [...jobs]
      .sort((a, b) => {
        const pa = priorityOrder[a.status] ?? 9;
        const pb = priorityOrder[b.status] ?? 9;
        if (pa !== pb) return pa - pb;
        return a.deliveryDate.localeCompare(b.deliveryDate);
      })
      .slice(0, 8);
  }, [jobs]);

  const liveJobs = useMemo(() => {
    const priorityOrder = { Delayed: 0, Hold: 1, WFA: 2, "In Progress": 3, Pending: 4, "Partially Delivered": 5, Reprint: 6 };
    return jobs
      .filter((j) => j.status !== "Completed")
      .sort((a, b) => {
        const pa = priorityOrder[a.status] ?? 9;
        const pb = priorityOrder[b.status] ?? 9;
        if (pa !== pb) return pa - pb;
        return a.deliveryDate.localeCompare(b.deliveryDate);
      })
      .slice(0, 10);
  }, [jobs]);

  return (
    <div className="dashboard">
      <div className="dashboard__stats">
        <StatCard icon={Briefcase} label="Total Jobs" value={stats.total} variant="amber" />
        <StatCard icon={Activity} label="Active Jobs" value={stats.active} variant="cyan" />
        <StatCard
          icon={CalendarClock}
          label="Due Today"
          value={stats.dueToday}
          variant="amber-soft"
          meta={
            dueTodayUrgent > 0
              ? { text: `${dueTodayUrgent} urgent`, tone: "urgent" }
              : undefined
          }
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={stats.completed}
          variant="green"
          meta={completedTrend}
        />
        <StatCard icon={AlertTriangle} label="Delayed" value={stats.delayed} variant="coral" />
        <StatCard icon={PauseCircle} label="On Hold" value={stats.onHold} variant="slate" />
      </div>

      <div className="dashboard__charts">
        <div className="card dashboard__chart-card">
          <div className="dashboard__chart-header">
            <h2 className="section-title">Job Status Distribution</h2>
          </div>
          <div className="dashboard__pie-layout">
            <div className="dashboard__pie-wrap">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={54}
                    outerRadius={80}
                    paddingAngle={3}
                    animationDuration={700}
                  >
                    {statusDistribution.map((entry) => (
                      <Cell key={entry.status} fill={statusColor(entry.status)} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div className="dashboard__pie-total" aria-hidden="true">
                <span className="dashboard__pie-total-value">{stats.total}</span>
                <span className="dashboard__pie-total-label">Total</span>
              </div>
            </div>
            <ul className="dashboard__legend">
              {statusDistribution.map(({ status, count }) => (
                <li key={status}>
                  <span className="dashboard__legend-dot" style={{ background: statusColor(status) }} />
                  <span className="dashboard__legend-label">{status}</span>
                  <span className="dashboard__legend-count">{count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card dashboard__chart-card">
          <div className="dashboard__chart-header">
            <h2 className="section-title">Jobs by Salesperson</h2>
            <span className="dashboard__chart-subtitle">This month</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={bySalesperson} barCategoryGap="32%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ec" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#69758a" }} axisLine={{ stroke: "#e2e6ec" }} tickLine={false} />
              <YAxis hide allowDecimals={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar
                dataKey="jobs"
                fill="#d89b2b"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
                animationDuration={700}
                label={{ position: "top", fontSize: 12, fontWeight: 700, fill: "#1b2430" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card dashboard__chart-card dashboard__chart-card--wide">
          <div className="dashboard__chart-header">
            <h2 className="section-title">Live Job Status</h2>
            <span className="dashboard__live-tag">
              <span className="dashboard__live-dot" />
              LIVE
            </span>
          </div>
          <div className="dashboard__table-wrap">
            <table className="dashboard__live-table">
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
                {liveJobs.map((job) => {
                  const progress = job.totalQty > 0 ? Math.min(100, (job.deliveredQty / job.totalQty) * 100) : 0;
                  return (
                    <tr key={job.id}>
                      <td className="dashboard__jobno">{job.jobNo}</td>
                      <td>
                        <div className="dashboard__client">
                          <span className="dashboard__client-avatar">{getInitials(job.client)}</span>
                          <span>{job.client}</span>
                        </div>
                      </td>
                      <td>{job.item}</td>
                      <td className="num">{job.totalQty.toLocaleString()}</td>
                      <td className="num">
                        <div className="dashboard__live-delivered">
                          <span>{job.deliveredQty.toLocaleString()}</span>
                          <span className="dashboard__live-progress-track">
                            <span className="dashboard__live-progress-fill" style={{ width: `${progress}%` }} />
                          </span>
                        </div>
                      </td>
                      <td className={`num ${job.balanceQty === 0 ? "dashboard__live-balance--zero" : "dashboard__live-balance--pending"}`}>
                        {job.balanceQty.toLocaleString()}
                      </td>
                      <td className="dashboard__date">
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
                {liveJobs.length === 0 && (
                  <tr>
                    <td colSpan={8} className="dashboard__live-empty">
                      No active jobs right now.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card dashboard__chart-card dashboard__chart-card--wide">
          <div className="dashboard__chart-header">
            <h2 className="section-title">Delivery Trend</h2>
            <span className="dashboard__chart-subtitle">Delivered quantity by date</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={deliveryTrend} margin={{ top: 12, right: 8, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="deliveryFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d89b2b" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#d89b2b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ec" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#69758a" }} axisLine={{ stroke: "#e2e6ec" }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#69758a" }} axisLine={false} tickLine={false} width={60} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Area
                type="monotone"
                dataKey="deliveredQty"
                stroke="#111827"
                strokeWidth={2.5}
                fill="url(#deliveryFill)"
                dot={{ r: 3, fill: "#ffffff", stroke: "#d89b2b", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: "#d89b2b", stroke: "#111827", strokeWidth: 1.5 }}
                animationDuration={700}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card dashboard__table-card">
        <div className="dashboard__chart-header">
          <h2 className="section-title">Priority Jobs</h2>
          <span className="dashboard__chart-subtitle">
            {priorityJobs.length} of {jobs.length}
          </span>
        </div>
        <div className="dashboard__table-wrap">
          <table className="data-table dashboard__table">
            <thead>
              <tr>
                <th>Job No.</th>
                <th>Client</th>
                <th>Item</th>
                <th className="num">Balance</th>
                <th>Delivery Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {priorityJobs.map((job) => (
                <tr key={job.id}>
                  <td className="dashboard__jobno">{job.jobNo}</td>
                  <td>
                    <div className="dashboard__client">
                      <span className="dashboard__client-avatar">{getInitials(job.client)}</span>
                      <span>{job.client}</span>
                    </div>
                  </td>
                  <td>{job.item}</td>
                  <td className="num">{job.balanceQty.toLocaleString()}</td>
                  <td className="dashboard__date">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
