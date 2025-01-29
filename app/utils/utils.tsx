export function optimizeName(name: string): string {
  name = name.replace("\r", "").replace(/(-\s*\d{2,4})|vod|fhd|hd|360p|4k|h264|h265|24fps|60fps|720p|1080p|vod|x264|x265|\.avi|\.mp4|\.mkv|\[.*]|\(.*\)|\{.*\}|-|_|\./gim, " ").replace(/(- \d\d\d\d$)/, "");
  name = name.replace("   ", " ");
  name = name.replace("  ", " ");
  return name.trim();
}

interface TimeConversionResult {
  hours: number;
  minutes: number;
  finalTime: string;
}

export function minutesToHrs(totalMinutes: number): string {
  const hours: number = Math.floor(totalMinutes / 60);          
  const minutes: number = totalMinutes % 60;

  const finalTime: string = (hours > 0 ? hours + ' Hr ' : '') + minutes + ' Min';

  return finalTime;
}

interface HmsResult {
  h: number;
  m: number;
  s: number;
}

export function secondsToHms(d: number): string {
  d = Number(d);
  const h: number = Math.floor(d / 3600);
  const m: number = Math.floor(d % 3600 / 60);
  const s: number = Math.floor(d % 3600 % 60);
  return `${h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
}

interface IsFutureDate {
  (date: Date): boolean;
}

export const isFutureDate: IsFutureDate = (date) => {
  const dateToCheck = new Date(date);
  const today = new Date();
  return dateToCheck > today;
};