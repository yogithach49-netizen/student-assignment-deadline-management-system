function createStore() {
  return {
    students: [],
    courses: [],
    assignments: [],
    reminders: [],
    studyAvailability: [],
    planItems: [],
    nextId: 1
  };
}
module.exports = { createStore };
