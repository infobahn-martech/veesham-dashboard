import { ChevronLeft, ChevronRight } from "lucide-react";

function getPageNumbers(page, totalPages) {
  const pages = [];
  const start = Math.max(1, page - 1);
  const end = Math.min(totalPages, start + 2);
  for (let p = Math.max(1, end - 2); p <= end; p++) pages.push(p);
  return pages;
}

function Pagination({ page, totalItems, pageSize, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalItems === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(totalItems, page * pageSize);
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="pagination">
      <span className="pagination__summary">
        Showing {from}-{to} of {totalItems}
      </span>

      <div className="pagination__controls">
        <button
          type="button"
          className="pagination__btn"
          aria-label="Previous page"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} strokeWidth={2} />
        </button>

        {pageNumbers[0] > 1 && (
          <>
            <button type="button" className="pagination__page" onClick={() => onPageChange(1)}>
              1
            </button>
            {pageNumbers[0] > 2 && <span className="pagination__ellipsis">…</span>}
          </>
        )}

        {pageNumbers.map((p) => (
          <button
            key={p}
            type="button"
            className={p === page ? "pagination__page pagination__page--active" : "pagination__page"}
            aria-current={p === page ? "page" : undefined}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="pagination__ellipsis">…</span>}
            <button type="button" className="pagination__page" onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </button>
          </>
        )}

        <button
          type="button"
          className="pagination__btn"
          aria-label="Next page"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
