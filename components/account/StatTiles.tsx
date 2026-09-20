export default function StatTiles({
  stats,
}: {
  stats: { orders: number; designs: number; inProduction: number; delivered: number };
}) {
  const tiles = [
    { label: "Orders", value: stats.orders },
    { label: "Designs", value: stats.designs },
    { label: "In production", value: stats.inProduction },
    { label: "Delivered", value: stats.delivered },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {tiles.map((t) => (
        <div key={t.label} className="rounded-xl border border-border bg-surface p-4">
          <p className="text-display text-2xl text-text">{t.value}</p>
          <p className="mt-1 text-xs text-text-faint">{t.label}</p>
        </div>
      ))}
    </div>
  );
}
