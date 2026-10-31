import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_TEXT_LENGTH, generateIcs, googleCalendarUrl, unconfiguredExtraction, validateText } from '../src/domain.js';

const event = { id:'a1', title:'Physiology CA 2', organization:'Physiology Department', date:'2026-11-09', startTime:'09:00', endTime:null, venue:'Old MLT Hall', sourceExcerpt:'Assessment holds at 9am.', status:'active', provenance:'sample', verified:false };
test('text cap is precise', () => { assert.equal(validateText('x'.repeat(MAX_TEXT_LENGTH)).length, MAX_TEXT_LENGTH); assert.throws(() => validateText('x'.repeat(MAX_TEXT_LENGTH + 1))); });
test('calendar uses Lagos floating time', () => { const ics = generateIcs([event]); assert.match(ics, /X-WR-TIMEZONE:Africa\/Lagos/); assert.match(ics, /DTSTART:20261109T090000/); assert.doesNotMatch(ics, /DTSTART:20261109T090000Z/); });
test('deadline-only exports an all-day span', () => { const ics = generateIcs([{ ...event, date:null, deadlineDate:'2026-11-06', startTime:null }]); assert.match(ics, /DTSTART;VALUE=DATE:20261106/); assert.match(ics, /DTEND;VALUE=DATE:20261107/); });
test('live extraction fails closed', () => assert.throws(unconfiguredExtraction, /has not been analysed/));
test('calendar link preserves Lagos time zone', () => assert.match(googleCalendarUrl(event), /ctz=Africa%2FLagos/));
