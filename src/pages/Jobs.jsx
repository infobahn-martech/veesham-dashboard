import { useMemo, useState } from "react";
import { Search, Plus, Eye, Pencil, RefreshCcw, Archive, X, CalendarCheck } from "lucide-react";
import clsx from "clsx";
import { useJobsData } from "../context/jobsData";
import { useToast } from "../context/toast";
import { STATUSES } from "../data/jobs";
import { formatDate, formatNumber } from "../utils/format";
import { getInitials } from "../utils/initials";
import ActionMenu from "../components/ActionMenu";
import DatePicker from "../components/DatePicker";
import StatusBadge from "../components/StatusBadge";
import JobFormModal from "../components/JobFormModal";
import JobViewModal from "../components/JobViewModal";
import JobStatusModal from "../components/JobStatusModal";
import ConfirmDialog from "../components/ConfirmDialog";
import Pagination from "../components/Pagination";
import "./Jobs.css";
import "../components/Pagination.css";

const todayStr = new Date().toISOString().slice(0, 10);
const PAGE_SIZE = 10;

function Jobs() {
  const { jobs, archiveJob } = useJobsData();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [salespersonFilter, setSalespersonFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [todayOnly, setTodayOnly] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [page, setPage] = useState(1);

  const [formJob, setFormJob] = useState(undefined);
  const [viewJob, setViewJob] = useState(null);
  const [statusJob, setStatusJob] = useState(null);
  const [archiveTarget, setArchiveTarget] = useState(null);

  const salespeople = useMemo(
    () => [...new Set(jobs.map((j) => j.salesperson))].sort(),
    [jobs]
  );

  const baseJobs = useMemo(() => jobs.filter((j) => (showArchived ? true : !j.archived)), [jobs, showArchived]);

  const hasActiveFilters =
    search.trim() !== "" || statusFilter !== "All" || salespersonFilter !== "All" || dateFilter !== "" || todayOnly;

  const filteredJobs = useMemo(() => {
    const term = search.trim().toLowerCase();
    return baseJobs.filter((job) => {
      const matchesSearch =
        !term ||
        job.jobNo.toLowerCase().includes(term) ||
        job.client.toLowerCase().includes(term) ||
        job.item.toLowerCase().includes(term) ||
        job.salesperson.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "All" || job.status === statusFilter;
      const matchesSalesperson = salespersonFilter === "All" || job.salesperson === salespersonFilter;
      const matchesDate = !dateFilter || job.deliveryDate === dateFilter;
      const matchesToday = !todayOnly || job.deliveryDate === todayStr;
      return matchesSearch && matchesStatus && matchesSalesperson && matchesDate && matchesToday;
    });
  }, [baseJobs, search, statusFilter, salespersonFilter, dateFilter, todayOnly]);

  const filterKey = `${search}|${statusFilter}|${salespersonFilter}|${dateFilter}|${todayOnly}|${showArchived}`;
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedJobs = filteredJobs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setSalespersonFilter("All");
    setDateFilter("");
    setTodayOnly(false);
  }

  function handleArchiveConfirm() {
    archiveJob(archiveTarget.id);
    showToast("Job archived successfully");
    setArchiveTarget(null);
  }

  return (
    <div className="jobs-page">
      <div className="jobs-toolbar">
        <div className="jobs-toolbar__main">
          <div className="jobs-search">
            <Search size={18} strokeWidth={2} />
            <input
              type="text"
              aria-label="Search job no, client, item or salesperson"
              placeholder="Search job no, client, item or salesperson..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select className="jobs-filter" aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select className="jobs-filter" aria-label="Filter by salesperson" value={salespersonFilter} onChange={(e) => setSalespersonFilter(e.target.value)}>
            <option value="All">All Salespersons</option>
            {salespeople.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <DatePicker
            className="jobs-filter"
            ariaLabel="Filter by delivery date"
            placeholder="Delivery date"
            value={dateFilter}
            onChange={setDateFilter}
          />

          <button
            type="button"
            className={clsx("jobs-toggle", todayOnly && "jobs-toggle--active")}
            onClick={() => setTodayOnly((v) => !v)}
          >
            <CalendarCheck size={16} strokeWidth={2} />
            Today's Jobs
          </button>

          {hasActiveFilters && (
            <button type="button" className="jobs-reset" onClick={resetFilters}>
              <X size={14} strokeWidth={2} />
              Clear filters
            </button>
          )}
        </div>

        <div className="jobs-toolbar__side">
          <label className="jobs-archived-toggle">
            <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} />
            <span>Show archived</span>
          </label>

          <button type="button" className="btn btn-primary" onClick={() => setFormJob(null)}>
            <Plus size={16} strokeWidth={2.2} />
            Create Job
          </button>
        </div>
      </div>

      <div className="card jobs-table-card">
        <div className="jobs-table-wrap">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>Job No.</th>
                <th>Client</th>
                <th>Item</th>
                <th>Salesperson</th>
                <th className="num">Total Qty</th>
                <th className="num">Delivered</th>
                <th className="num">Balance</th>
                <th>Delivery Date</th>
                <th>Status</th>
                <th className="jobs-table__actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedJobs.map((job) => (
                <tr key={job.id} className={clsx(job.status === "Delayed" && "jobs-table__row--alert", job.archived && "jobs-table__row--archived")}>
                  <td className="jobs-table__jobno">{job.jobNo}</td>
                  <td>
                    <div className="jobs-table__client">
                      <span className="jobs-table__client-avatar">{getInitials(job.client)}</span>
                      <span>{job.client}</span>
                    </div>
                  </td>
                  <td className="jobs-table__item">{job.item}</td>
                  <td>{job.salesperson}</td>
                  <td className="num">{formatNumber(job.totalQty)}</td>
                  <td className="num">{formatNumber(job.deliveredQty)}</td>
                  <td className={clsx("num", job.balanceQty === 0 ? "jobs-table__balance--zero" : "jobs-table__balance--pending")}>
                    {formatNumber(job.balanceQty)}
                  </td>
                  <td className="jobs-table__date">{formatDate(job.deliveryDate)}</td>
                  <td>
                    <StatusBadge status={job.status} />
                  </td>
                  <td>
                    <ActionMenu
                      items={[
                        { label: "View", icon: Eye, onClick: () => setViewJob(job) },
                        { label: "Edit", icon: Pencil, onClick: () => setFormJob(job) },
                        { label: "Update Status", icon: RefreshCcw, onClick: () => setStatusJob(job) },
                        ...(job.archived
                          ? []
                          : [{ label: "Archive Job", icon: Archive, tone: "danger", onClick: () => setArchiveTarget(job) }]),
                      ]}
                    />
                  </td>
                </tr>
              ))}
              {filteredJobs.length === 0 && (
                <tr>
                  <td colSpan={10} className="jobs-table__empty">
                    No jobs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={currentPage} totalItems={filteredJobs.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>

      {formJob !== undefined && <JobFormModal job={formJob} onClose={() => setFormJob(undefined)} />}
      {viewJob && <JobViewModal job={viewJob} onClose={() => setViewJob(null)} />}
      {statusJob && <JobStatusModal job={statusJob} onClose={() => setStatusJob(null)} />}
      {archiveTarget && (
        <ConfirmDialog
          title="Archive Job"
          message={`Archive job ${archiveTarget.jobNo} for ${archiveTarget.client}? Archived jobs are hidden from the default view but can be shown with "Show archived".`}
          confirmLabel="Archive Job"
          tone="danger"
          onConfirm={handleArchiveConfirm}
          onCancel={() => setArchiveTarget(null)}
        />
      )}
    </div>
  );
}

export default Jobs;
