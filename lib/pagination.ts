export type RowCount = 10 | 25 | 50 | 100 | 'all';

export function paginate<T>(rows: T[], page: number, rowCount: RowCount) {
  const size = rowCount === 'all' ? Math.max(1, rows.length) : rowCount;
  const pageCount = Math.max(1, Math.ceil(rows.length / size));
  const current = Math.max(0, Math.min(page, pageCount - 1));
  return {
    pageCount,
    current,
    visible: rows.slice(current * size, (current + 1) * size),
  };
}
