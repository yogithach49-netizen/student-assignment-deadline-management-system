const { createStore } = require('../src/data/store');
const { createApp } = require('../src/app');
function sampleAssignment(overrides = {}) {
  return {
    id: 'a1', studentId: 's1', courseId: 'c1', title: 'Cloud homework',
    dueDate: '2030-12-10T12:00:00.000Z', priority: 'Medium', status: 'Pending',
    estimatedHours: 4, hoursSpent: 0, ...overrides
  };
}
function setup() {
  const store = createStore();
  const app = createApp(store);
  return { store, app };
}
module.exports = { sampleAssignment, setup };
