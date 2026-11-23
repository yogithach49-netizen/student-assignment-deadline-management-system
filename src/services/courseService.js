const { httpError } = require('../utils/errors');
function createCourseService(store) {
  return {
    list(studentId) { return store.courses.filter(c => c.studentId === studentId); },
    create(studentId, name) {
      if (typeof name !== 'string' || !name.trim()) throw httpError('Course name is required');
      const course = { id: String(store.nextId++), studentId, name: name.trim() };
      store.courses.push(course);
      return course;
    }
  };
}
module.exports = { createCourseService };
