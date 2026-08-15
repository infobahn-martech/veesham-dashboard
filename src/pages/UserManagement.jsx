import { useMemo, useState } from "react";
import { Search, Plus, Eye, Pencil, KeyRound, Power, PowerOff, X, Users as UsersIcon, UserCheck, UserX, ShieldCheck } from "lucide-react";
import clsx from "clsx";
import { useUsersData } from "../context/usersData";
import { useToast } from "../context/toast";
import { getCurrentUser } from "../utils/auth";
import { ROLES } from "../data/roles";
import { formatDate, formatLastLogin } from "../utils/format";
import { getInitials } from "../utils/initials";
import StatCard from "../components/StatCard";
import ActionMenu from "../components/ActionMenu";
import UserFormModal from "../components/UserFormModal";
import UserViewModal from "../components/UserViewModal";
import ResetPasswordModal from "../components/ResetPasswordModal";
import ConfirmDialog from "../components/ConfirmDialog";
import "./UserManagement.css";

function UserManagement() {
  const { users, setUserStatus } = useUsersData();
  const { showToast } = useToast();
  const sessionUser = getCurrentUser();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [formUser, setFormUser] = useState(undefined);
  const [viewUser, setViewUser] = useState(null);
  const [resetUser, setResetUser] = useState(null);
  const [deactivateTarget, setDeactivateTarget] = useState(null);

  const stats = useMemo(() => {
    const active = users.filter((u) => u.status === "Active").length;
    const admins = users.filter((u) => u.role === "Administrator").length;
    return { total: users.length, active, inactive: users.length - active, admins };
  }, [users]);

  const hasActiveFilters = search.trim() !== "" || roleFilter !== "All" || statusFilter !== "All";

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        !term ||
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.role.toLowerCase().includes(term);
      const matchesRole = roleFilter === "All" || u.role === roleFilter;
      const matchesStatus = statusFilter === "All" || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  function resetFilters() {
    setSearch("");
    setRoleFilter("All");
    setStatusFilter("All");
  }

  function handleActivate(user) {
    setUserStatus(user.id, "Active");
    showToast(`${user.name} activated`);
  }

  function handleDeactivateConfirm() {
    setUserStatus(deactivateTarget.id, "Inactive");
    showToast(`${deactivateTarget.name} deactivated`);
    setDeactivateTarget(null);
  }

  return (
    <div className="users-page">
      <div className="users-page__stats">
        <StatCard icon={UsersIcon} label="Total Users" value={stats.total} variant="amber" />
        <StatCard icon={UserCheck} label="Active Users" value={stats.active} variant="green" />
        <StatCard icon={UserX} label="Inactive Users" value={stats.inactive} variant="slate" />
        <StatCard icon={ShieldCheck} label="Administrators" value={stats.admins} variant="cyan" />
      </div>

      <div className="users-toolbar">
        <div className="users-toolbar__main">
          <div className="users-search">
            <Search size={18} strokeWidth={2} />
            <input
              type="text"
              aria-label="Search name, email or role"
              placeholder="Search name, email or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select className="users-filter" aria-label="Filter by role" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="All">All Roles</option>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.value}
              </option>
            ))}
          </select>

          <select className="users-filter" aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {hasActiveFilters && (
            <button type="button" className="users-reset" onClick={resetFilters}>
              <X size={14} strokeWidth={2} />
              Clear filters
            </button>
          )}
        </div>

        <button type="button" className="btn btn-primary" onClick={() => setFormUser(null)}>
          <Plus size={16} strokeWidth={2.2} />
          Add User
        </button>
      </div>

      <div className="card users-table-card">
        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Created</th>
                <th className="users-table__actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const isSelf = sessionUser?.email === u.email;
                return (
                  <tr key={u.id}>
                    <td>
                      <div className="users-table__user">
                        <span className="users-table__avatar">{getInitials(u.name)}</span>
                        <div className="users-table__user-text">
                          <span className="users-table__name">{u.name}</span>
                          {isSelf && <span className="users-table__you">You</span>}
                        </div>
                      </div>
                    </td>
                    <td className="users-table__email">{u.email}</td>
                    <td>
                      <span className="user-role-pill">{u.role}</span>
                    </td>
                    <td>
                      <span className={clsx("user-status-pill", `user-status-pill--${u.status.toLowerCase()}`)}>{u.status}</span>
                    </td>
                    <td className="users-table__login">{formatLastLogin(u.lastLogin)}</td>
                    <td className="users-table__date">{formatDate(u.createdDate)}</td>
                    <td>
                      <ActionMenu
                        items={[
                          { label: "View", icon: Eye, onClick: () => setViewUser(u) },
                          { label: "Edit", icon: Pencil, onClick: () => setFormUser(u) },
                          { label: "Reset Password", icon: KeyRound, onClick: () => setResetUser(u) },
                          ...(isSelf
                            ? []
                            : u.status === "Active"
                              ? [{ label: "Deactivate User", icon: PowerOff, tone: "danger", onClick: () => setDeactivateTarget(u) }]
                              : [{ label: "Activate User", icon: Power, onClick: () => handleActivate(u) }]),
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="users-table__empty">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formUser !== undefined && <UserFormModal user={formUser} onClose={() => setFormUser(undefined)} />}
      {viewUser && <UserViewModal user={viewUser} onClose={() => setViewUser(null)} />}
      {resetUser && <ResetPasswordModal user={resetUser} onClose={() => setResetUser(null)} />}
      {deactivateTarget && (
        <ConfirmDialog
          title="Deactivate User"
          message="Are you sure you want to deactivate this user? They will no longer be able to access the system."
          confirmLabel="Deactivate User"
          tone="danger"
          onConfirm={handleDeactivateConfirm}
          onCancel={() => setDeactivateTarget(null)}
        />
      )}
    </div>
  );
}

export default UserManagement;
