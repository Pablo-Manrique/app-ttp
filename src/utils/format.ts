export const formatMinutes = (minutes: number | null) => minutes == null ? '—' : minutes <= 0 ? 'Ahora' : `${minutes} min`;
export const relativeRefresh = (iso: string) => {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  return seconds < 10 ? 'ahora' : seconds < 60 ? `hace ${seconds}s` : `hace ${Math.round(seconds / 60)} min`;
};
