export default function Loading() {
  return (
    <div className="p-6 space-y-4">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}
