
export default function CalendarLegend() {
  return (
    <div className="flex flex-wrap gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-green-500 rounded-full" />
        <span>Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
        <span>Limited spots</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-red-500 rounded-full" />
        <span>Fully booked</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-gray-300 rounded-full" />
        <span>Unavailable</span>
      </div>
    </div>
  );
}
