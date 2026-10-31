export const MAX_TEXT_LENGTH = 2000;
export const CATEGORIES = ['Exam', 'Academic', 'Association', 'Event', 'Opportunity'];
export const LEVELS = ['100L', '200L', '300L', '400L', '500L', '600L', 'All'];
export const PROGRAMMES = ['MBBS', 'BDS', 'Pharmacy', 'Physiology', 'MLS', 'Radiography', 'Physiotherapy', 'Nursing', 'All'];

export function validateText(text) {
  if (typeof text !== 'string' || !text.trim() || text.length > MAX_TEXT_LENGTH) throw new Error(`Enter between 1 and ${MAX_TEXT_LENGTH.toLocaleString()} characters.`);
  return text.trim();
}

export function validateImage(file) {
  const allowed = ['image/png', 'image/jpeg', 'image/webp'];
  if (!file || !allowed.includes(file.type) || file.size === 0 || file.size > 5 * 1024 * 1024) throw new Error('Choose a PNG, JPEG, or WEBP flyer under 5 MB.');
  return file;
}

const escapeIcs = value => String(value || '').replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
const compact = value => String(value).replace(/[-:]/g, '');
const tomorrow = date => { const d = new Date(`${date}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10); };

export function generateIcs(events) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CampusSync//Campus actions//EN', 'CALSCALE:GREGORIAN', 'X-WR-TIMEZONE:Africa/Lagos'];
  events.filter(event => event.status !== 'superseded').forEach(event => {
    const date = event.date || event.deadlineDate;
    const allDay = !event.startTime;
    const start = allDay ? `DTSTART;VALUE=DATE:${compact(date)}` : `DTSTART:${compact(date)}T${compact(event.startTime)}00`;
    const end = allDay ? `DTEND;VALUE=DATE:${compact(tomorrow(date))}` : `DTEND:${compact(date)}T${compact(event.endTime || `${String(Math.min(23, Number(event.startTime.slice(0, 2)) + 1)).padStart(2, '0')}:${event.startTime.slice(3)}`)}00`;
    lines.push('BEGIN:VEVENT', `UID:${escapeIcs(event.id)}@campusync.local`, `SEQUENCE:${event.revision ? 1 : 0}`, start, end, `SUMMARY:${escapeIcs(`[${event.provenance === 'sample' ? 'Sample' : 'Notice'}] ${event.title}`)}`, `LOCATION:${escapeIcs(event.venue || 'Not stated')}`, `DESCRIPTION:${escapeIcs(`${event.verified ? 'Locally verified by you' : 'Unverified'}\\nSource: ${event.organization}\\nEvidence: ${event.sourceExcerpt}`)}`, 'END:VEVENT');
  });
  return `${lines.concat('END:VCALENDAR').join('\r\n')}\r\n`;
}

export function googleCalendarUrl(event) {
  const date = event.date || event.deadlineDate;
  const start = event.startTime ? `${compact(date)}T${compact(event.startTime)}00` : compact(date);
  const end = event.startTime ? `${compact(date)}T${compact(event.endTime || event.startTime)}00` : compact(tomorrow(date));
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({ action: 'TEMPLATE', text: event.title, dates: `${start}/${end}`, details: `Source: ${event.organization}\nEvidence: ${event.sourceExcerpt}`, location: event.venue || '', ctz: 'Africa/Lagos' })}`;
}

export function unconfiguredExtraction() { throw new Error('Gemma 4 extraction is not configured yet. Your upload has not been analysed. Use a labelled sample, or connect the server-side DigitalOcean endpoint.'); }
