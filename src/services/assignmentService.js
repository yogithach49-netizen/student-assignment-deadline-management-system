const { validateAssignment } = require('../validators/assignmentValidator');
const { httpError } = require('../utils/errors');

function createAssignmentService(store, plannerService) {
  return {
    list(studentId) {
      return store.assignments.filter(a => a.studentId === studentId);
    },
    create(studentId, input) {
      const validation = validateAssignment(input);
      if (!validation.valid) throw httpError(validation.errors.join('; '));
      const course = store.courses.find(c => c.id === input.courseId && c.studentId === studentId);
      if (!course) throw httpError('Course not found for this student', 404);
      const assignment = {
        id: String(store.nextId++), studentId, courseId: input.courseId,
        title: input.title.trim(), dueDate: new Date(input.dueDate).toISOString(),
        priority: input.priority || 'Medium', status: input.status || 'Pending',
        estimatedHours: input.estimatedHours === undefined ? 1 : input.estimatedHours,
        hoursSpent: 0
      };
      store.assignments.push(assignment);
      store.reminders.push({ id: String(store.nextId++), assignmentId: assignment.id, studentId, sent: false });
      return assignment;
    },
    update(studentId, id, changes) {
      const assignment = store.assignments.find(a => a.id === id && a.studentId === studentId);
      if (!assignment) throw httpError('Assignment not found', 404);
      const candidate = { ...assignment, ...changes };
      const validation = validateAssignment(candidate);
      if (!validation.valid) throw httpError(validation.errors.join('; '));
      Object.assign(assignment, changes);
      return assignment;
    },
    remove(studentId, id) {
      const index = store.assignments.findIndex(a => a.id === id && a.studentId === studentId);
      if (index < 0) throw httpError('Assignment not found', 404);
      store.assignments.splice(index, 1);
      store.reminders = store.reminders.filter(r => r.assignmentId !== id);
      return { deleted: true };
    }
  };
}
module.exports = { createAssignmentService };
