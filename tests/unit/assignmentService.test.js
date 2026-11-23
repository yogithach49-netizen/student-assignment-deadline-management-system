const test = require('node:test');
const assert = require('node:assert/strict');
const { createStore } = require('../../src/data/store');
const { createAssignmentService } = require('../../src/services/assignmentService');

function serviceWithCourse() {
  const store = createStore();
  store.courses.push({ id: 'c1', studentId: 's1', name: 'Cloud Computing' });
  return { store, service: createAssignmentService(store, {}) };
}
const input = { title: 'Lab 1', courseId: 'c1', dueDate: '2030-12-01', estimatedHours: 2 };

test('creates an assignment and a reminder', () => {
  const { store, service } = serviceWithCourse();
  const created = service.create('s1', input);
  assert.equal(created.title, 'Lab 1');
  assert.equal(store.reminders.length, 1);
});
test('prevents a student from using another student course', () => {
  const { service } = serviceWithCourse();
  assert.throws(() => service.create('s2', input), /Course not found/);
});
test('updates an assignment status', () => {
  const { service } = serviceWithCourse();
  const created = service.create('s1', input);
  const updated = service.update('s1', created.id, { status: 'Completed' });
  assert.equal(updated.status, 'Completed');
});
