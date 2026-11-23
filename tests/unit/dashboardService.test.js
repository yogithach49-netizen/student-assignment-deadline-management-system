const test = require('node:test');
const assert = require('node:assert/strict');
const { getDashboardSummary } = require('../../src/services/dashboardService');
const { sampleAssignment } = require('../helpers');

test('calculates total, pending, completed and completion percentage', () => {
  const result = getDashboardSummary([
    sampleAssignment(), sampleAssignment({ id: 'a2', status: 'Completed' })
  ], new Date('2030-01-01'));
  assert.equal(result.total, 2);
  assert.equal(result.pending, 1);
  assert.equal(result.completed, 1);
  assert.equal(result.completionPercentage, 50);
});
test('counts overdue unfinished work but not completed work', () => {
  const result = getDashboardSummary([
    sampleAssignment({ dueDate: '2020-01-01' }),
    sampleAssignment({ id: 'a2', dueDate: '2020-01-01', status: 'Completed' })
  ], new Date('2030-01-01'));
  assert.equal(result.overdue, 1);
});
test('returns zero completion percentage for an empty list', () => {
  assert.equal(getDashboardSummary([]).completionPercentage, 0);
});
