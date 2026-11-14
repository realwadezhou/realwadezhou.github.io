'use client';

import { useState, type ReactNode } from 'react';
import { TableHead } from '@/components/ui/table';

export type SortValue = string | number | null | undefined;
export type SortState = { key: string; dir: 'asc' | 'desc' } | null;

/**
 * Click-to-sort for a table. `accessors` maps a column key to the value to sort by.
 * First click sorts ascending (text) or descending (numbers), the second reverses,
 * the third returns to the original order. Missing values always sort last.
 */
export function useSortable<T>(
  rows: T[],
  accessors: Record<string, (row: T) => SortValue>,
) {
  const [sort, setSort] = useState<SortState>(null);
  const sorted = (() => {
    if (!sort) return rows;
    const get = accessors[sort.key];
    const sign = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const x = get(a);
      const y = get(b);
      if (x == null || x === '') return y == null || y === '' ? 0 : 1;
      if (y == null || y === '') return -1;
      if (typeof x === 'number' && typeof y === 'number') return (x - y) * sign;
      return String(x).localeCompare(String(y), undefined, { numeric: true }) * sign;
    });
  })();
  const toggle = (key: string, numeric: boolean) =>
    setSort((s) => {
      const first = numeric ? 'desc' : 'asc';
      if (!s || s.key !== key) return { key, dir: first };
      if (s.dir === first) return { key, dir: first === 'asc' ? 'desc' : 'asc' };
      return null;
    });
  return { sorted, sort, toggle };
}

export function SortableHead({
  label,
  column,
  sort,
  onSort,
  numeric = false,
  className,
  title,
}: {
  label: ReactNode;
  column: string;
  sort: SortState;
  onSort: (column: string, numeric: boolean) => void;
  numeric?: boolean;
  className?: string;
  title?: string;
}) {
  const active = sort?.key === column;
  const arrow = active ? (sort.dir === 'asc' ? '▲' : '▼') : '↕';
  return (
    <TableHead
      className={className}
      aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <button
        type="button"
        className="sort-head"
        title={title ? `${title} — click to sort` : 'Click to sort'}
        onClick={() => onSort(column, numeric)}
      >
        {label}
        <span className={active ? 'sort-arrow active' : 'sort-arrow'} aria-hidden>
          {arrow}
        </span>
      </button>
    </TableHead>
  );
}
