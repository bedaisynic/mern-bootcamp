type PaginationProps = {
  page: number; // 0-indexed
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export default function Pagination({ page, hasNext, onPrev, onNext }: PaginationProps) {
  return (
    <div className="pagination">
      <button onClick={onPrev} disabled={page === 0}>
        ← Prev
      </button>
      <span>Page {page + 1}</span>
      <button onClick={onNext} disabled={!hasNext}>
        Next →
      </button>
    </div>
  );
}
