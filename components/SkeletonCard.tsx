export default function SkeletonCard() {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 animate-pulse">
      <div className="w-full h-32 bg-gray-700 rounded mb-4"></div>
      <div className="w-3/4 h-6 bg-gray-700 rounded mb-2"></div>
      <div className="w-full h-4 bg-gray-700 rounded mb-3"></div>
      <div className="w-1/2 h-4 bg-gray-700 rounded"></div>
    </div>
  );
}