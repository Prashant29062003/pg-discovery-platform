"use client";

import React from "react";
import NextImage from 'next/image';

interface Card {
  id: string | number;
  title: string;
  description?: string;
  image?: string;
  badges?: { label: string; color?: "blue" | "green" | "red" | "yellow" }[];
  stats?: { label: string; value: string | number }[];
  onEdit?: () => void;
  onDelete?: () => void;
}

interface CardGridProps {
  cards: Card[];
  onCardClick?: (card: Card) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  columns?: number;
}

const badgeColors = {
  blue: "bg-blue-100 text-blue-800",
  green: "bg-green-100 text-green-800",
  red: "bg-red-100 text-red-800",
  yellow: "bg-yellow-100 text-yellow-800",
};

export function CardGrid({
  cards,
  onCardClick,
  isLoading,
  emptyMessage = "No items available",
  columns = 3,
}: CardGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white py-12 col-span-full">
        <p className="text-center text-gray-500 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => onCardClick?.(card)}
          className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
        >
          {card.image && (
            <div className="w-full h-40 bg-gray-200 dark:bg-gray-800 overflow-hidden relative">
              <NextImage
                src={card.image}
                alt={card.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          )}

          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {card.title}
            </h3>

            {card.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {card.description}
              </p>
            )}

            {card.badges && card.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {card.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                      badgeColors[badge.color || "blue"]
                    }`}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            )}

            {card.stats && card.stats.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-3 py-2 border-t border-gray-200">
                {card.stats.map((stat, idx) => (
                  <div key={idx}>
                    <p className="text-xs text-gray-500 font-medium">
                      {stat.label}
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-3 border-t border-gray-200">
              {card.onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    card.onEdit?.();
                  }}
                  className="flex-1 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  Edit
                </button>
              )}
              {card.onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    card.onDelete?.();
                  }}
                  className="flex-1 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
