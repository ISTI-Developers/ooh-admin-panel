const DetailedLegend = () => {
  const legendItems = [
    { label: "Parapet", color: "bg-blue-700" },
    { label: "Backlit", color: "bg-indigo-600" },
    { label: "Ticketbooth", color: "bg-sky-600" },
    { label: "Stairs", color: "bg-teal-500" },
    { label: "Taken", color: "bg-gray-500" },
    {
      label: "Blocked",
      custom: (
        <div className="relative w-4 h-4 rounded-full bg-neutral-400">
          <div className="absolute inset-0 before:content-[''] before:absolute before:w-[2px] before:h-full before:bg-white before:rotate-45 before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2" />
          <div className="absolute inset-0 after:content-[''] after:absolute after:w-[2px] after:h-full after:bg-white after:-rotate-45 after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2" />
        </div>
      ),
    },
  ];

  return (
    <div className="absolute z-10 left-4 top-4 flex flex-col gap-2 bg-white/90 rounded-xl shadow-md px-4 py-3 backdrop-blur-sm border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-800 mb-1">Legend</h3>

      {legendItems.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          {item.custom ? item.custom : <div className={`w-4 h-4 rounded-full ${item.color}`} />}
          <span className="text-sm text-gray-700">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default DetailedLegend;
