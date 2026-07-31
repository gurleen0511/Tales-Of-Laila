import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  PawPrint,
  UtensilsCrossed,
  Sparkles,
  TrendingUp,
  Star,
  Settings,
  Plus,
  Cat,
  Trash2,
  Brush,
  Calendar,
  X,
} from "lucide-react";
import { useLailaData } from "./lib/useLailaData";
import { FeedModal, WeightModal, MilestoneModal, GroomModal, SettingsModal } from "./components/Modals";
import CalendarModal from "./components/CalendarModal";
import { todayStr, isToday, timeAgo, formatDateTime, ageFromBirthdate, chaosLevel } from "./lib/helpers";

export default function App() {
  const { profile, data, loading, error, setError, insertRow, deleteRow, saveProfile } = useLailaData();

  const [showSettings, setShowSettings] = useState(false);
  const [showFeedForm, setShowFeedForm] = useState(false);
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [showGroomForm, setShowGroomForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const todayZoomiesEntries = useMemo(() => data.zoomies.filter((z) => isToday(z.time)), [data.zoomies]);
  const todayZoomies = todayZoomiesEntries.length;
  const todayFeedings = useMemo(() => data.feedings.filter((f) => isToday(f.time)).length, [data.feedings]);
  const todayLitter = useMemo(() => data.litter.filter((l) => isToday(l.time)).length, [data.litter]);
  const todayGrooming = useMemo(() => data.grooming.filter((g) => isToday(g.time)).length, [data.grooming]);
  const level = chaosLevel(todayZoomies);

  const activity = useMemo(() => {
    const all = [
      ...data.zoomies.map((e) => ({ ...e, type: "zoomies" })),
      ...data.feedings.map((e) => ({ ...e, type: "feedings" })),
      ...data.litter.map((e) => ({ ...e, type: "litter" })),
      ...data.grooming.map((e) => ({ ...e, type: "grooming" })),
    ];
    return all.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 25);
  }, [data]);

  const chartData = useMemo(() => data.weights.map((w) => ({ date: w.date.slice(5), value: w.value })), [data.weights]);

  const weightTicks = useMemo(() => {
    if (data.weights.length === 0) return undefined;
    const values = data.weights.map((w) => w.value);
    const min = Math.floor(Math.min(...values) / 0.5) * 0.5;
    const max = Math.ceil(Math.max(...values) / 0.5) * 0.5;
    const ticks = [];
    for (let v = min; v <= max + 1e-9; v += 0.5) ticks.push(Math.round(v * 100) / 100);
    return ticks;
  }, [data.weights]);

  const dayMap = useMemo(() => {
    const map = {};
    const addTo = (dateStr, bucket, entry) => {
      if (!map[dateStr]) map[dateStr] = { zoomies: [], feedings: [], litter: [], grooming: [], weights: [], milestones: [] };
      map[dateStr][bucket].push(entry);
    };
    data.zoomies.forEach((e) => addTo(e.time.slice(0, 10), "zoomies", e));
    data.feedings.forEach((e) => addTo(e.time.slice(0, 10), "feedings", e));
    data.litter.forEach((e) => addTo(e.time.slice(0, 10), "litter", e));
    data.grooming.forEach((e) => addTo(e.time.slice(0, 10), "grooming", e));
    data.weights.forEach((e) => addTo(e.date, "weights", e));
    data.milestones.forEach((e) => addTo(e.date, "milestones", e));
    return map;
  }, [data]);

  if (loading) {
    return (
      <div style={{ background: "#FBF3E7" }} className="min-h-screen flex items-center justify-center p-8">
        <div className="text-[#6B6259] font-serif italic">waking up the dashboard…</div>
      </div>
    );
  }

  return (
    <div style={{ background: "#FBF3E7" }} className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <div style={{ background: "#E2793D" }} className="w-11 h-11 rounded-full flex items-center justify-center shrink-0">
              <Cat size={22} color="#FBF3E7" strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold" style={{ color: "#2E2A26" }}>
                Tales of Laila
              </h1>
              <p className="text-sm" style={{ color: "#6B6259" }}>
                {ageFromBirthdate(profile?.birthdate) || "Age unknown — set her birthdate"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowCalendar(true)}
              className="p-2 rounded-full hover:bg-black/5 transition-colors focus:outline-none focus-visible:ring-2"
              style={{ ["--tw-ring-color"]: "#E2793D" }}
              aria-label="View calendar"
            >
              <Calendar size={18} color="#6B6259" />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full hover:bg-black/5 transition-colors focus:outline-none focus-visible:ring-2"
              style={{ ["--tw-ring-color"]: "#E2793D" }}
              aria-label="Settings"
            >
              <Settings size={18} color="#6B6259" />
            </button>
          </div>
        </div>

        {error && (
          <div
            className="mb-4 px-4 py-2 rounded-lg text-sm flex items-center justify-between gap-3"
            style={{ background: "#FBEAEA", color: "#B84A4A" }}
          >
            <span>{error}</span>
            <button onClick={() => setError("")} aria-label="Dismiss">
              <X size={14} color="#B84A4A" />
            </button>
          </div>
        )}

        {/* Chaos Trail */}
        <div className="rounded-2xl p-6 mb-4 relative overflow-hidden" style={{ background: "#FFFCF7", border: "1px solid #EFE3CE" }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs uppercase tracking-wider font-mono" style={{ color: "#6B6259" }}>
              Today's chaos trail
            </span>
            <span className="font-mono text-xs" style={{ color: "#6B6259" }}>
              {todayZoomies} logged
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <h2 className="font-display text-3xl font-bold" style={{ color: "#E2793D" }}>
              {level.label}
            </h2>
            <span className="text-sm" style={{ color: "#6B6259" }}>
              {level.sub}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
            {todayZoomies === 0 && <span className="text-sm italic" style={{ color: "#B5AA9C" }}>No paw prints yet today…</span>}
            {todayZoomiesEntries.map((entry, i) => (
              <button
                key={entry.id}
                onClick={() => deleteRow("zoomies", entry.id)}
                aria-label="Remove this zoomies log"
                title="Tap to undo"
                className="focus:outline-none"
              >
                <PawPrint
                  size={20}
                  color={i >= 9 ? "#E15B72" : "#E2793D"}
                  fill={i >= 9 ? "#E15B72" : "#E2793D"}
                  className="pop-in"
                  style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 12}deg)` }}
                />
              </button>
            ))}
          </div>
          <p className="text-xs mb-3" style={{ color: "#B5AA9C" }}>
            Tap a paw print to undo it.
          </p>
          <button
            onClick={() => insertRow("zoomies", {})}
            className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-transform active:scale-95 focus:outline-none focus-visible:ring-2"
            style={{ background: "#E2793D", color: "#FFFCF7", ["--tw-ring-color"]: "#E2793D" }}
          >
            <Sparkles size={16} /> Log zoomies
          </button>
        </div>

        {/* Quick log row */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <button
            onClick={() => setShowFeedForm(true)}
            className="rounded-xl p-3.5 flex flex-col items-start gap-2 transition-transform active:scale-95 focus:outline-none focus-visible:ring-2"
            style={{ background: "#FFFCF7", border: "1px solid #EFE3CE", ["--tw-ring-color"]: "#E2793D" }}
          >
            <div style={{ background: "#F3D9A0" }} className="w-8 h-8 rounded-full flex items-center justify-center">
              <UtensilsCrossed size={14} color="#8A5A1F" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-xs" style={{ color: "#2E2A26" }}>Feed</div>
              <div className="text-xs font-mono" style={{ color: "#6B6259" }}>{todayFeedings} today</div>
            </div>
          </button>

          <button
            onClick={() => insertRow("litter", {})}
            className="rounded-xl p-3.5 flex flex-col items-start gap-2 transition-transform active:scale-95 focus:outline-none focus-visible:ring-2"
            style={{ background: "#FFFCF7", border: "1px solid #EFE3CE", ["--tw-ring-color"]: "#7C9473" }}
          >
            <div style={{ background: "#D8E3D2" }} className="w-8 h-8 rounded-full flex items-center justify-center">
              <PawPrint size={14} color="#4E6B45" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-xs" style={{ color: "#2E2A26" }}>Litter</div>
              <div className="text-xs font-mono" style={{ color: "#6B6259" }}>{todayLitter} today</div>
            </div>
          </button>

          <button
            onClick={() => setShowGroomForm(true)}
            className="rounded-xl p-3.5 flex flex-col items-start gap-2 transition-transform active:scale-95 focus:outline-none focus-visible:ring-2"
            style={{ background: "#FFFCF7", border: "1px solid #EFE3CE", ["--tw-ring-color"]: "#8A7FBF" }}
          >
            <div style={{ background: "#E1DCF3" }} className="w-8 h-8 rounded-full flex items-center justify-center">
              <Brush size={14} color="#5B4E96" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-xs" style={{ color: "#2E2A26" }}>Groom</div>
              <div className="text-xs font-mono" style={{ color: "#6B6259" }}>{todayGrooming} today</div>
            </div>
          </button>
        </div>

        {/* Weight chart */}
        <div className="rounded-2xl p-6 mb-4" style={{ background: "#FFFCF7", border: "1px solid #EFE3CE" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} color="#E2793D" />
              <h3 className="font-display text-lg font-semibold" style={{ color: "#2E2A26" }}>Growth</h3>
            </div>
            <button
              onClick={() => setShowWeightForm(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 focus:outline-none focus-visible:ring-2"
              style={{ background: "#F3E4CC", color: "#8A5A1F", ["--tw-ring-color"]: "#E2793D" }}
            >
              <Plus size={12} /> Add weight
            </button>
          </div>
          {chartData.length === 0 ? (
            <p className="text-sm italic py-6 text-center" style={{ color: "#B5AA9C" }}>
              No weigh-ins yet — add her first one above.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFE3CE" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6B6259" }} axisLine={{ stroke: "#EFE3CE" }} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6B6259" }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                  unit="kg"
                  ticks={weightTicks}
                  domain={weightTicks ? [weightTicks[0], weightTicks[weightTicks.length - 1]] : ["auto", "auto"]}
                />
                <Tooltip
                  contentStyle={{ background: "#2E2A26", border: "none", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#FBF3E7" }}
                  itemStyle={{ color: "#F3D9A0" }}
                  formatter={(v) => [`${v} kg`, "Weight"]}
                />
                <Line type="monotone" dataKey="value" stroke="#E2793D" strokeWidth={2.5} dot={{ r: 3, fill: "#E2793D" }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Milestones */}
        <div className="rounded-2xl p-6 mb-4" style={{ background: "#FFFCF7", border: "1px solid #EFE3CE" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star size={16} color="#E2793D" />
              <h3 className="font-display text-lg font-semibold" style={{ color: "#2E2A26" }}>Milestones</h3>
            </div>
            <button
              onClick={() => setShowMilestoneForm(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 focus:outline-none focus-visible:ring-2"
              style={{ background: "#F3E4CC", color: "#8A5A1F", ["--tw-ring-color"]: "#E2793D" }}
            >
              <Plus size={12} /> Add
            </button>
          </div>
          {data.milestones.length === 0 ? (
            <p className="text-sm italic py-2" style={{ color: "#B5AA9C" }}>No milestones logged yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.milestones.map((m) => (
                <li key={m.id} className="flex items-start gap-3 group">
                  <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: "#E2793D" }} />
                  <div className="flex-1">
                    <div className="text-sm" style={{ color: "#2E2A26" }}>{m.description}</div>
                    <div className="text-xs font-mono" style={{ color: "#B5AA9C" }}>{m.date}</div>
                  </div>
                  <button
                    onClick={() => deleteRow("milestones", m.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    aria-label="Delete milestone"
                  >
                    <Trash2 size={13} color="#B5AA9C" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent activity */}
        <div className="rounded-2xl p-6" style={{ background: "#FFFCF7", border: "1px solid #EFE3CE" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold" style={{ color: "#2E2A26" }}>Recent activity</h3>
            <button
              onClick={() => setShowCalendar(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 focus:outline-none focus-visible:ring-2"
              style={{ background: "#F3E4CC", color: "#8A5A1F", ["--tw-ring-color"]: "#E2793D" }}
            >
              <Calendar size={12} /> Full history
            </button>
          </div>
          {activity.length === 0 ? (
            <p className="text-sm italic" style={{ color: "#B5AA9C" }}>Nothing logged yet — use the buttons above.</p>
          ) : (
            <ul className="space-y-2 overflow-y-auto pr-1" style={{ maxHeight: "168px" }}>
              {activity.map((e) => (
                <li key={e.id} className="flex items-center gap-3 text-sm group">
                  {e.type === "zoomies" && <Sparkles size={14} color="#E15B72" className="shrink-0" />}
                  {e.type === "feedings" && <UtensilsCrossed size={14} color="#8A5A1F" className="shrink-0" />}
                  {e.type === "litter" && <PawPrint size={14} color="#4E6B45" className="shrink-0" />}
                  {e.type === "grooming" && <Brush size={14} color="#5B4E96" className="shrink-0" />}
                  <span style={{ color: "#2E2A26" }} className="flex-1">
                    {e.type === "zoomies" && "Zoomies"}
                    {e.type === "feedings" && `Fed${e.amount ? ` — ${e.amount}` : ""}${e.food ? ` (${e.food})` : ""}`}
                    {e.type === "litter" && "Litter box"}
                    {e.type === "grooming" && (e.kind || "Groomed")}
                  </span>
                  <span className="font-mono text-xs text-right shrink-0" style={{ color: "#B5AA9C" }}>
                    <div>{timeAgo(e.time)}</div>
                    <div style={{ fontSize: "10px" }}>{formatDateTime(e.time)}</div>
                  </span>
                  <button
                    onClick={() => deleteRow(e.type, e.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete entry"
                  >
                    <Trash2 size={12} color="#B5AA9C" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-center text-xs mt-8" style={{ color: "#B5AA9C" }}>
          Made for {profile?.name || "Laila"} 🐾
        </p>
      </div>

      {showFeedForm && (
        <FeedModal
          onClose={() => setShowFeedForm(false)}
          onSubmit={async (row) => {
            await insertRow("feedings", row);
            setShowFeedForm(false);
          }}
        />
      )}
      {showWeightForm && (
        <WeightModal
          onClose={() => setShowWeightForm(false)}
          onSubmit={async (row) => {
            await insertRow("weights", row);
            setShowWeightForm(false);
          }}
        />
      )}
      {showMilestoneForm && (
        <MilestoneModal
          onClose={() => setShowMilestoneForm(false)}
          onSubmit={async (row) => {
            await insertRow("milestones", row);
            setShowMilestoneForm(false);
          }}
        />
      )}
      {showGroomForm && (
        <GroomModal
          onClose={() => setShowGroomForm(false)}
          onSubmit={async (row) => {
            await insertRow("grooming", row);
            setShowGroomForm(false);
          }}
        />
      )}
      {showCalendar && (
        <CalendarModal dayMap={dayMap} onClose={() => setShowCalendar(false)} onDelete={(type, id) => deleteRow(type, id)} />
      )}
      {(showSettings || !profile) && (
        <SettingsModal
          profile={profile}
          onClose={() => setShowSettings(false)}
          onSubmit={async (next) => {
            await saveProfile(next);
            setShowSettings(false);
          }}
        />
      )}
    </div>
  );
}
