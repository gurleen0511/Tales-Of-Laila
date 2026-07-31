export const todayStr = () => new Date().toISOString().slice(0, 10);
export const isToday = (iso) => iso.slice(0, 10) === todayStr();
export const nowTimeStr = () => new Date().toTimeString().slice(0, 5);

export function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function formatDateTime(iso) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " · " +
    d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
  );
}

export function ageFromBirthdate(birthdate) {
  if (!birthdate) return null;
  const birth = new Date(birthdate);
  const now = new Date();
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months -= 1;
  const days = Math.floor((now - birth) / 86400000);
  if (months < 1) return `${days} days old`;
  const weeks = Math.floor(days / 7);
  if (months < 2) return `${weeks} weeks old`;
  return `${months} months old`;
}

export const CHAOS_LEVELS = [
  { min: 0, label: "Chill", sub: "Currently a loaf." },
  { min: 3, label: "Spicy", sub: "Tail is twitching." },
  { min: 6, label: "Menace", sub: "Send help." },
  { min: 10, label: "FERAL MODE", sub: "Evacuate the plants." },
];

export function chaosLevel(count) {
  let level = CHAOS_LEVELS[0];
  for (const l of CHAOS_LEVELS) if (count >= l.min) level = l;
  return level;
}

export function getMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const startOffset = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(`${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  }
  return cells;
}

export const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export const DOT_COLORS = {
  zoomies: "#E15B72",
  feedings: "#E2793D",
  litter: "#7C9473",
  grooming: "#8A7FBF",
  weights: "#3B7DBF",
};

export const inputStyle = {
  background: "#FBF3E7",
  border: "1px solid #EFE3CE",
  color: "#2E2A26",
  width: "100%",
  boxSizing: "border-box",
};
