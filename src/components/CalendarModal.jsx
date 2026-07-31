import { useState, useMemo } from "react";
import { X, ChevronLeft, ChevronRight, Sparkles, UtensilsCrossed, PawPrint, Brush, TrendingUp, Star } from "lucide-react";
import { todayStr, getMonthGrid, DAY_LABELS, DOT_COLORS } from "../lib/helpers";

export default function CalendarModal({ dayMap, onClose, onDelete }) {
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [selected, setSelected] = useState(todayStr());

  const cells = useMemo(() => getMonthGrid(ym.y, ym.m), [ym]);
  const monthLabel = new Date(ym.y, ym.m, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const goMonth = (delta) => {
    let m = ym.m + delta,
      y = ym.y;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
    if (m > 11) {
      m = 0;
      y += 1;
    }
    setYm({ y, m });
  };

  const selectedData = dayMap[selected];
  const selectedItems = useMemo(() => {
    if (!selectedData) return [];
    const items = [
      ...selectedData.zoomies.map((e) => ({ ...e, type: "zoomies" })),
      ...selectedData.feedings.map((e) => ({ ...e, type: "feedings" })),
      ...selectedData.litter.map((e) => ({ ...e, type: "litter" })),
      ...selectedData.grooming.map((e) => ({ ...e, type: "grooming" })),
      ...selectedData.weights.map((e) => ({ ...e, type: "weights" })),
      ...selectedData.milestones.map((e) => ({ ...e, type: "milestones" })),
    ];
    return items.sort((a, b) => new Date(a.time || a.date) - new Date(b.time || b.date));
  }, [selectedData]);

  const labelFor = (item) => {
    if (item.type === "zoomies") return "Zoomies";
    if (item.type === "feedings") return `Fed${item.amount ? ` — ${item.amount}` : ""}${item.food ? ` (${item.food})` : ""}`;
    if (item.type === "litter") return "Litter box";
    if (item.type === "grooming") return item.kind || "Groomed";
    if (item.type === "weights") return `Weighed in — ${item.value} kg`;
    if (item.type === "milestones") return item.description;
    return "";
  };

  const iconFor = (type) => {
    const props = { size: 14, className: "shrink-0" };
    if (type === "zoomies") return <Sparkles {...props} color={DOT_COLORS.zoomies} />;
    if (type === "feedings") return <UtensilsCrossed {...props} color={DOT_COLORS.feedings} />;
    if (type === "litter") return <PawPrint {...props} color={DOT_COLORS.litter} />;
    if (type === "grooming") return <Brush {...props} color={DOT_COLORS.grooming} />;
    if (type === "weights") return <TrendingUp {...props} color={DOT_COLORS.weights} />;
    if (type === "milestones") return <Star {...props} color="#E2793D" />;
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#FBF3E7" }}>
      <div className="px-4 py-4 border-b" style={{ borderColor: "#EFE3CE" }}>
        <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
          <h3 className="font-display text-lg font-semibold" style={{ color: "#2E2A26" }}>
            History
          </h3>
          <button onClick={onClose} aria-label="Close">
            <X size={20} color="#6B6259" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => goMonth(-1)} className="p-1.5 rounded-full hover:bg-black/5" aria-label="Previous month">
            <ChevronLeft size={18} color="#6B6259" />
          </button>
          <span className="font-display font-semibold text-sm" style={{ color: "#2E2A26" }}>
            {monthLabel}
          </span>
          <button onClick={() => goMonth(1)} className="p-1.5 rounded-full hover:bg-black/5" aria-label="Next month">
            <ChevronRight size={18} color="#6B6259" />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {DAY_LABELS.map((d, i) => (
            <div key={i} className="text-center text-xs font-mono" style={{ color: "#B5AA9C" }}>
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-6">
          {cells.map((dateStr, i) => {
            if (!dateStr) return <div key={i} />;
            const dNum = parseInt(dateStr.slice(-2), 10);
            const isSel = dateStr === selected;
            const isTod = dateStr === todayStr();
            const dayData = dayMap[dateStr];
            const cats = dayData
              ? Object.entries(dayData)
                  .filter(([k, v]) => k !== "milestones" && v.length > 0)
                  .map(([k]) => k)
              : [];
            const hasMilestone = dayData && dayData.milestones.length > 0;
            return (
              <button
                key={dateStr}
                onClick={() => setSelected(dateStr)}
                className="aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-xs relative focus:outline-none"
                style={{
                  background: isSel ? "#E2793D" : "transparent",
                  color: isSel ? "#FFFCF7" : "#2E2A26",
                  fontWeight: isTod ? 700 : 400,
                  border: isTod && !isSel ? "1px solid #E2793D" : "1px solid transparent",
                }}
              >
                {hasMilestone && (
                  <Star
                    size={8}
                    color={isSel ? "#FFFCF7" : "#E2793D"}
                    fill={isSel ? "#FFFCF7" : "#E2793D"}
                    className="absolute top-1 right-1"
                  />
                )}
                <span>{dNum}</span>
                <div className="flex gap-0.5">
                  {cats.slice(0, 4).map((c) => (
                    <div key={c} className="w-1 h-1 rounded-full" style={{ background: isSel ? "#FFFCF7" : DOT_COLORS[c] }} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl p-5" style={{ background: "#FFFCF7", border: "1px solid #EFE3CE" }}>
          <h4 className="font-display font-semibold text-sm mb-3" style={{ color: "#2E2A26" }}>
            {new Date(selected + "T00:00:00").toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h4>
          {selectedItems.length === 0 ? (
            <p className="text-sm italic" style={{ color: "#B5AA9C" }}>
              Nothing logged this day.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {selectedItems.map((item) => (
                <li key={item.id} className="flex items-center gap-3 text-sm group">
                  {iconFor(item.type)}
                  <span className="flex-1" style={{ color: "#2E2A26" }}>
                    {labelFor(item)}
                  </span>
                  {item.time && (
                    <span className="font-mono text-xs" style={{ color: "#B5AA9C" }}>
                      {new Date(item.time).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                    </span>
                  )}
                  <button
                    onClick={() => onDelete(item.type, item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete entry"
                  >
                    <X size={12} color="#B5AA9C" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
