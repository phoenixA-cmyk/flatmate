export const fmtSleep = (h) => {
  const x = h % 24;
  return `${x % 12 || 12} ${x >= 12 ? 'PM' : 'AM'}`;
};
export const fmtK = (n) => (n >= 1000 ? `${Math.round(n / 100) / 10}K`.replace('.0K', 'K') : n);
export const fmtBudget = (a, b) => `₹${fmtK(a)}–${fmtK(b)}`;
export const AREAS = ['Koramangala', 'HSR Layout', 'Indiranagar', 'Whitefield', 'Bellandur', 'Marathahalli', 'BTM Layout', 'JP Nagar', 'Jayanagar', 'Electronic City'];
export const BUDGETS = [
  [5000, 10000], [10000, 15000], [15000, 20000], [20000, 30000], [30000, 50000],
];
export const SLEEP = [21, 22, 23, 24, 25, 26];
const COLORS = ['#ec4899', '#4ade80', '#fcd34d', '#4aa8ff', '#a78bfa', '#fb923c'];
export const colorFor = (name = '') => COLORS[[...name].reduce((s, c) => s + c.charCodeAt(0), 0) % COLORS.length];
export const timeAgo = (d) => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return 'now';
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
};
