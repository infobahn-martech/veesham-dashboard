import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { jobs } from "../data/jobs";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import "./Dashboard.css";

const STATUS_COLORS = {
  Pending: "#52606d",
  "In Progress": "#2f80ed",
  "Partially Delivered": "#6b46c1",
  Completed: "#12875b",
  Delayed: "#c0322a",
  Hold: "#b5720a",
  WFA: "#e0a800",
  Reprint: "#d1495b",
};

const todayStr = new Date().toISOString().slice(0, 10);

const TOOLTIP_STYLE = {
  contentStyle: {
    borderRadius: 10,
    border: "1px solid #e2e6ec",
    boxShadow: "0 4px 12px rgba(16, 24, 40, 0.08)",
    fontSize: 13,
  },
  labelStyle: { fontWeight: 600, color: "#1b2430" },
  cursor: { fill: "rgba(47, 128, 237, 0.06)" },
};

function Dashboard() {
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
  }, []);

  const statusDistribution = useMemo(() => {
    const counts = {};
    jobs.forEach((j) => {
      counts[j.status] = (counts[j.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, []);

  const bySalesperson = useMemo(() => {
    const counts = {};
    jobs.forEach((j) => {
      counts[j.salesperson] = (counts[j.salesperson] || 0) + 1;
    });
    return Object.entries(counts).map(([name, jobCount]) => ({
      name: name.split(" ")[0],
      jobs: jobCount,
    }));
  }, []);

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
  }, []);

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
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard__stats">
        <StatCard icon={Briefcase} label="Total Jobs" value={stats.total} variant="primary" />
        <StatCard icon={Activity} label="Active Jobs" value={stats.active} variant="primary" />
        <StatCard icon={CalendarClock} label="Due Today" value={stats.dueToday} variant="warning" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} variant="success" />
        <StatCard icon={AlertTriangle} label="Delayed" value={stats.delayed} variant="danger" />
        <StatCard icon={PauseCircle} label="On Hold" value={stats.onHold} variant="neutral" />
      </div>

      <div className="dashboard__charts">
        <div className="card dashboard__chart-card">
          <div className="dashboard__chart-header">
            <h2 className="section-title">Job Status Distribution</h2>
          </div>
          <div className="dashboard__pie-layout">
            <ResponsiveContainer width="60%" height={220}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={58}
                  outerRadius={88}
                  paddingAngle={3}
                  animationDuration={700}
                >
                  {statusDistribution.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip {...TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="dashboard__legend">
              {statusDistribution.map(({ status, count }) => (
                <li key={status}>
                  <span className="dashboard__legend-dot" style={{ background: STATUS_COLORS[status] }} />
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
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={bySalesperson} barCategoryGap="28%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ec" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#667085" }} axisLine={{ stroke: "#e2e6ec" }} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="jobs" fill="#2f80ed" radius={[6, 6, 0, 0]} maxBarSize={44} animationDuration={700} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card dashboard__chart-card dashboard__chart-card--wide">
          <div className="dashboard__chart-header">
            <h2 className="section-title">Delivery Trend</h2>
            <span className="dashboard__chart-subtitle">Delivered quantity by date</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={deliveryTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ec" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#667085" }} axisLine={{ stroke: "#e2e6ec" }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} width={44} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Line
                type="monotone"
                dataKey="deliveredQty"
                stroke="#1e3a5f"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#1e3a5f", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                animationDuration={700}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card dashboard__table-card">
        <h2 className="section-title">Priority Jobs</h2>
        <div className="dashboard__table-wrap">
          <table className="data-table">
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
                  <td>{job.client}</td>
                  <td>{job.item}</td>
                  <td className="num">{job.balanceQty.toLocaleString()}</td>
                  <td>
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
