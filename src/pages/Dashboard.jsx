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
  Legend,
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
          <h2 className="section-title">Job Status Distribution</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusDistribution}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
              >
                {statusDistribution.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card dashboard__chart-card">
          <h2 className="section-title">Jobs by Salesperson</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={bySalesperson}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ec" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="jobs" fill="#2f80ed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card dashboard__chart-card dashboard__chart-card--wide">
          <h2 className="section-title">Delivery Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={deliveryTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ec" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="deliveredQty"
                stroke="#1e3a5f"
                strokeWidth={2.5}
                dot={{ r: 3 }}
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
                <th>Balance</th>
                <th>Delivery Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {priorityJobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.jobNo}</td>
                  <td>{job.client}</td>
                  <td>{job.item}</td>
                  <td>{job.balanceQty.toLocaleString()}</td>
                  <td>{job.deliveryDate}</td>
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
