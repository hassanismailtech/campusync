import test from 'node:test';
import assert from 'node:assert/strict';
import { organizations } from '../src/data.js';

test('directory contains the six CampusSync organization categories', () => {
  const categories = new Set(organizations.map((organization) => organization.category));
  assert.equal(categories.size, 6);
  assert.ok(organizations.length >= 60);
});

test('directory never invents unverified contact information', () => {
  assert.ok(organizations.every((organization) => organization.contact === 'Contact information to be confirmed'));
});
