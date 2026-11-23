const test = require('node:test');
const assert = require('node:assert/strict');
const { generatePlan } = require('../../src/services/plannerService');
const { sampleAssignment } = require('../helpers');

test('schedules work within available daily hours', () => {
  const plan = generatePlan([sampleAssignment({ dueDate: '2030-01-04T00:00:00Z', estimatedHours: 2 })],
    { '2030-01-01': 2 }, new Date('2030-01-01T00:00:00Z'));
  assert.equal(plan.sessions.reduce((n, s) => n + s.hours, 0), 2);
  assert.deepEqual(plan.atRisk, []);
});
test('marks an assignment at risk when there is not enough time', () => {
  const plan = generatePlan([sampleAssignment({ dueDate: '2030-01-02T00:00:00Z', estimatedHours: 5 })],
    { '2030-01-01': 2 }, new Date('2030-01-01T00:00:00Z'));
  assert.equal(plan.atRisk[0].shortfallHours, 3);
});
test('does not schedule completed assignments', () => {
  const plan = generatePlan([sampleAssignment({ status: 'Completed' })],
    { '2030-01-01': 5 }, new Date('2030-01-01T00:00:00Z'));
  assert.equal(plan.sessions.length, 0);
});
