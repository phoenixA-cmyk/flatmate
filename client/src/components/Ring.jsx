export default function Ring({ value, size = 72 }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const color = value >= 80 ? '#4ade80' : value >= 60 ? '#fcd34d' : '#ec4899';
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#262626" strokeWidth="6" fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="6" fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: 'stroke-dashoffset .8s ease' }}
        />
      </svg>
      <b style={{ color }}>{value}%</b>
    </div>
  );
}
