import { useMemo, useState } from "react";
import { Search, Plus, Eye, Pencil, Power, PowerOff, X } from "lucide-react";
import clsx from "clsx";
import { useJobsData } from "../context/jobsData";
import { useToast } from "../context/toast";
import { CATEGORIES } from "../data/items";
import { formatDate } from "../utils/format";
import CounterBar from "../components/CounterBar";
import ActionMenu from "../components/ActionMenu";
import ItemFormModal from "../components/ItemFormModal";
import ItemViewModal from "../components/ItemViewModal";
import "./Items.css";

function Items() {
  const { items, setItemStatus } = useJobsData();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formItem, setFormItem] = useState(undefined); // undefined = closed, null = add, object = edit
  const [viewItem, setViewItem] = useState(null);

  const hasActiveFilters = search.trim() !== "" || categoryFilter !== "All" || statusFilter !== "All";

  const counters = useMemo(() => {
    const active = items.filter((i) => i.status === "Active").length;
    const categories = new Set(items.map((i) => i.category)).size;
    return [
      { label: "Total Items", value: items.length },
      { label: "Active Items", value: active, tone: "positive" },
      { label: "Inactive Items", value: items.length - active },
      { label: "Categories", value: categories, tone: "amber" },
    ];
  }, [items]);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        !term ||
        item.itemCode.toLowerCase().includes(term) ||
        item.itemName.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term);
      const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, search, categoryFilter, statusFilter]);

  function resetFilters() {
    setSearch("");
    setCategoryFilter("All");
    setStatusFilter("All");
  }

  function toggleStatus(item) {
    const nextStatus = item.status === "Active" ? "Inactive" : "Active";
    setItemStatus(item.id, nextStatus);
    showToast(`${item.itemName} marked ${nextStatus.toLowerCase()}`);
  }

  return (
    <div className="items-page">
      <div className="items-page__header">
        <button type="button" className="btn btn-primary" onClick={() => setFormItem(null)}>
          <Plus size={16} strokeWidth={2.2} />
          Add Item
        </button>
      </div>

      <CounterBar items={counters} />

      <div className="items-toolbar">
        <div className="items-toolbar__main">
          <div className="items-search">
            <Search size={18} strokeWidth={2} />
            <input
              type="text"
              aria-label="Search item code, item name or category"
              placeholder="Search item code, item name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select className="items-filter" aria-label="Filter by category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select className="items-filter" aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {hasActiveFilters && (
            <button type="button" className="items-reset" onClick={resetFilters}>
              <X size={14} strokeWidth={2} />
              Reset filters
            </button>
          )}
        </div>
      </div>

      <div className="card items-table-card">
        <div className="items-table-wrap">
          <table className="items-table">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Status</th>
                <th>Updated</th>
                <th className="items-table__actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className="items-table__code">{item.itemCode}</td>
                  <td>{item.itemName}</td>
                  <td>{item.category}</td>
                  <td className="items-table__desc">{item.description || "—"}</td>
                  <td>
                    <span className={clsx("item-status-pill", `item-status-pill--${item.status.toLowerCase()}`)}>
                      {item.status}
                    </span>
                  </td>
                  <td className="items-table__date">{formatDate(item.updatedDate)}</td>
                  <td>
                    <ActionMenu
                      items={[
                        { label: "View", icon: Eye, onClick: () => setViewItem(item) },
                        { label: "Edit", icon: Pencil, onClick: () => setFormItem(item) },
                        {
                          label: item.status === "Active" ? "Deactivate" : "Activate",
                          icon: item.status === "Active" ? PowerOff : Power,
                          onClick: () => toggleStatus(item),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="items-table__empty">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formItem !== undefined && <ItemFormModal item={formItem} onClose={() => setFormItem(undefined)} />}
      {viewItem && <ItemViewModal item={viewItem} onClose={() => setViewItem(null)} />}
    </div>
  );
}

export default Items;
