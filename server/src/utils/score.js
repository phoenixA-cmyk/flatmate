const CLEAN = { daily: 3, weekly: 2, rarely: 1 };
const PARTY = { never: 0, sometimes: 1, often: 2 };

export const fmtSleep = (h) => {
  const x = h % 24;
  return `${x % 12 || 12} ${x >= 12 ? 'PM' : 'AM'}`;
};

/**
 * Lifestyle compatibility, 0-100. Weights sum to 100.
 * budget 28, location 25, sleep 15, cleaning 15, smoking 10, pets 4, parties 3
 */
export function compatibility(a, b) {
  let score = 0;
  const good = [];
  const clash = [];

  const lo = Math.max(a.budgetMin, b.budgetMin);
  const hi = Math.min(a.budgetMax, b.budgetMax);
  const span = Math.max(1, Math.min(a.budgetMax - a.budgetMin, b.budgetMax - b.budgetMin));
  if (hi >= lo) {
    score += 28 * Math.min(1, (hi - lo + 1) / span);
    good.push('Budget fits');
  } else {
    if (lo - hi <= 3000) score += 8;
    clash.push('Budget gap');
  }

  if (a.area && a.area === b.area) { score += 25; good.push(`Both in ${a.area}`); }
  else if (a.city === b.city) { score += 12; }
  else clash.push('Different city');

  const sd = Math.abs(a.sleepBy - b.sleepBy);
  score += 15 * Math.max(0, 1 - sd / 4);
  if (sd <= 1) good.push(`Sleep ~${fmtSleep(a.sleepBy)}`);
  else if (sd >= 3) clash.push('Sleep clash');

  const cd = Math.abs(CLEAN[a.cleaning] - CLEAN[b.cleaning]);
  score += cd === 0 ? 15 : cd === 1 ? 7 : 0;
  if (cd === 0) good.push(`Cleans ${a.cleaning}`);
  else if (cd === 2) clash.push('Cleaning clash');

  if (a.smoking === b.smoking) { score += 10; good.push(a.smoking ? 'Both smoke' : 'Both smoke-free'); }
  else clash.push('Smoking mismatch');

  if (a.pets === b.pets) { score += 4; if (a.pets) good.push('Pet people'); }

  const pd = Math.abs(PARTY[a.partying] - PARTY[b.partying]);
  score += pd === 0 ? 3 : pd === 1 ? 1.5 : 0;
  if (pd === 2) clash.push('Party clash');

  return { score: Math.round(Math.min(100, score)), good, clash };
}
