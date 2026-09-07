import type { RowCount } from '@/lib/pagination';

export function RowCountSelect({
  value,
  onChange,
}: {
  value: RowCount;
  onChange: (value: RowCount) => void;
}) {
  return (
    <label>
      Rows per page
      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value === 'all'
              ? 'all'
              : (Number(event.target.value) as RowCount),
          )
        }
      >
        {[10, 25, 50, 100].map((count) => (
          <option key={count} value={count}>
            {count}
          </option>
        ))}
        <option value="all">All</option>
      </select>
    </label>
  );
}
