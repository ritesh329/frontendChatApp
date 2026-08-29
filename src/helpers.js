export function truncate(str, n) {
  return !str ? '' : (str.length > n ? str.slice(0, n) + '…' : str);
}

export function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatFileSize(bytes) {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return size.toFixed(1) + ' ' + units[unitIndex];
}

export function getId(x) {
  if (!x) return null;
  return typeof x === 'object' ? x._id || x.id : x;
}

/**
 * Guess a media "kind" (image/video/audio/file) from a bare URL string.
 * This covers cases where a message arrives with only `content` set to a
 * file URL (e.g. via a socket echo) but without the proper `type`/`fileUrl`
 * fields, so we can still render it as media instead of raw text.
 */
export function guessMediaKindFromUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed) && !trimmed.startsWith('/')) return null;
  const clean = trimmed.split('?')[0].toLowerCase();
  if (/\.(png|jpe?g|gif|webp|bmp|svg)$/.test(clean)) return 'image';
  if (/\.(mp4|webm|mov|avi|mkv|m4v)$/.test(clean)) return 'video';
  if (/\.(mp3|wav|m4a|aac|flac|ogg)$/.test(clean)) return 'audio';
  return null;
}

/** Find the "other" participant's id in a personal chat (not me). */
export function getOtherParticipantId(chat, meId) {
  if (!chat?.participants) return null;
  const other = chat.participants.find((p) => getId(p) !== meId);
  return other ? getId(other) : null;
}
