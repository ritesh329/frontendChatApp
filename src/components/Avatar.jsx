import React from 'react';

// Each person gets a stable two-tone gradient derived from their name, so
// avatars stay visually distinct without needing real profile photos.
const PALETTES = [
  ['#7C6FF0', '#A78BFA'],
  ['#22D3C8', '#0EA5A3'],
  ['#F472B6', '#FB7185'],
  ['#F59E0B', '#F97316'],
  ['#60A5FA', '#3B82F6'],
  ['#34D399', '#10B981'],
];

function hashName(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

const SIZE_CLASSES = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

export default function Avatar({ name = '?', size = 'md' }) {
  const initials =
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('') || '?';

  const [from, to] = PALETTES[hashName(name) % PALETTES.length];

  return (
    <div
      className={`flex items-center justify-center shrink-0 rounded-full font-semibold text-white shadow-sm ring-1 ring-white/10 ${SIZE_CLASSES[size] || SIZE_CLASSES.md}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {initials}
    </div>
  );
}
