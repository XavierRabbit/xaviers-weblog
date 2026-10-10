import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-surface-blue pt-6 mt-8 font-mono text-sm">
      {currentPage > 1 ? (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="text-accent-red hover:underline"
        >
          ← Previous
        </Link>
      ) : (
        <span className="text-text-light opacity-30 cursor-not-allowed">← Previous</span>
      )}

      <span className="text-text-light opacity-60">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="text-accent-red hover:underline"
        >
          Next →
        </Link>
      ) : (
        <span className="text-text-light opacity-30 cursor-not-allowed">Next →</span>
      )}
    </div>
  );
}