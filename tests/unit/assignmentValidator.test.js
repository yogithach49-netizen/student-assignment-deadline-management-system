const test = require('node:test');
const assert = require('node:assert/strict');
const { validateAssignment } = require('../../src/validators/assignmentValidator');
const valid = { title: 'Essay', courseId: 'c1', dueDate: '2030-12-01', estimatedHours: 2, priority: 'High', status: 'Pending' };

test('accepts a valid assignment', () => {
  assert.equal(validateAssignment(valid).valid, true);
});
test('rejects a blank title', () => {
  const result = validateAssignment({ ...valid, title: '  ' });
  assert.equal(result.valid, false);
  assert.ok(result.errors.includes('Title is required'));
});
test('rejects an invalid estimated-hours value', () => {
  assert.equal(validateAssignment({ ...valid, estimatedHours: 0 }).valid, false);
});
