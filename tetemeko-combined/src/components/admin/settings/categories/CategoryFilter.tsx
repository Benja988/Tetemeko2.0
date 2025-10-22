interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function CategoryFilter({ value, onChange }: Props) {
  return (
    <div className="mb-4">
      <label className="mr-2 font-medium">Filter by type:</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="border px-3 py-1 rounded">
        <option value="">All</option>
        <option value="news">News</option>
        <option value="marketplace">Marketplace</option>
        <option value="podcast">Podcast</option>
      </select>
    </div>
  );
}
