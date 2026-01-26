"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      (page >= currentPage - 1 && page <= currentPage + 1)
  );

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="px-3 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
      >
        Previous
      </button>

      {visiblePages[0] !== 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
          >
            1
          </button>
          {visiblePages[0] > 2 && <span className="text-gray-500">...</span>}
        </>
      )}

      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={isLoading}
          className={`px-3 py-2 rounded border font-medium text-sm transition-colors ${
            currentPage === page
              ? "bg-blue-600 text-white border-blue-600"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {page}
        </button>
      ))}

      {visiblePages[visiblePages.length - 1] !== totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="text-gray-500">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="px-3 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
      >
        Next
      </button>
    </div>
  );
}
