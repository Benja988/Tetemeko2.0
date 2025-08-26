export default function NewsLoader() {
  return (
    <div className="animate-pulse p-6 space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="w-14 h-10 bg-gray-300 rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-300 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
