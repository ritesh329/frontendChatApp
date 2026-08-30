// Extracts a stable string id whether given a raw id, a populated object,
// or something already normalized.
export function getId(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  return String(value._id || value.id || '') || null;
}

// Given a personal chat's participants array + "my" id, returns the id of
// the other participant.
export function getOtherParticipantId(chat, myId) {
  if (!chat?.participants) return null;
  const other = chat.participants.find((p) => getId(p) !== myId);
  return other ? getId(other) : null;
}

export function truncate(str, len = 40) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len).trimEnd() + '…' : str;
}

export function formatTime(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatFileSize(bytes) {
  if (bytes === null || bytes === undefined) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

// Best-effort guess of media kind from a bare URL, used when a socket
// echo only carries the raw link in `content` with no file metadata.
export function guessMediaKindFromUrl(url) {
  if (typeof url !== 'string') return null;
  const clean = url.trim();
  if (!/^https?:\/\//i.test(clean)) return null;
  if (/\.(jpe?g|png|gif|webp|bmp|svg)(\?.*)?$/i.test(clean)) return 'image';
  if (/\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i.test(clean)) return 'video';
  if (/\.(mp3|wav|ogg|m4a|aac|flac)(\?.*)?$/i.test(clean)) return 'audio';
  return null;
}
