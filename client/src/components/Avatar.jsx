import { colorFor } from '../format';

export default function Avatar({ name, size = 56, square = false }) {
  const c = colorFor(name);
  return (
    <div
      className="avatar"
      style={{
        width: size, height: size, fontSize: size * 0.42,
        borderRadius: square ? 20 : '50%',
        background: `linear-gradient(135deg, ${c}, ${c}99)`,
      }}
    >
      {(name || '?')[0].toUpperCase()}
    </div>
  );
}
