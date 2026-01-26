"use client";

import React from "react";
import { cn } from "@/utils";

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T;
    render?: (value: any, row: T) => React.ReactNode;
  }[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  onEdit,
  onDelete,
  isLoading,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white py-12">
        <p className="text-center text-gray-500 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-6 py-3 text-left font-semibold text-gray-700"
              >
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={row.id || rowIdx}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="px-6 py-4 text-gray-900">
                  {col.render
                    ? col.render(row[col.accessor], row)
                    : String(row[col.accessor] || "-")}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
