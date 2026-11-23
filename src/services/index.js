const { createAssignmentService } = require('./assignmentService');
const { createCourseService } = require('./courseService');
const { getDashboardSummary } = require('./dashboardService');
const { generatePlan } = require('./plannerService');

function createServices(store) {
  const planner = { generate: generatePlan };
  return {
    store,
    assignments: createAssignmentService(store, planner),
    courses: createCourseService(store),
    dashboard: { summary: (studentId) => getDashboardSummary(store.assignments.filter(a => a.studentId === studentId)) },
    planner: {
      setAvailability(studentId, hoursByDate) {
        for (const [date, hours] of Object.entries(hoursByDate || {})) {
          if (!Number.isInteger(hours) || hours < 0 || hours > 12) {
            const error = new Error('Available hours must be a whole number from 0 to 12');
            error.status = 400; throw error;
          }
          store.studyAvailability = store.studyAvailability.filter(x => !(x.studentId === studentId && x.date === date));
          store.studyAvailability.push({ studentId, date, hours });
        }
        return this.getPlan(studentId);
      },
      getPlan(studentId, now = new Date()) {
        const availability = {};
        store.studyAvailability.filter(x => x.studentId === studentId).forEach(x => availability[x.date] = x.hours);
        const assignments = store.assignments.filter(a => a.studentId === studentId);
        const plan = generatePlan(assignments, availability, now);
        store.planItems = store.planItems.filter(x => x.studentId !== studentId);
        plan.sessions.forEach(s => store.planItems.push({ ...s, studentId }));
        return plan;
      },
      completeSession(studentId, itemId) {
        const item = store.planItems.find(x => x.id === itemId && x.studentId === studentId);
        if (!item) { const error = new Error('Study session not found'); error.status = 404; throw error; }
        if (!item.done) {
          item.done = true;
          const assignment = store.assignments.find(a => a.id === item.assignmentId && a.studentId === studentId);
          if (assignment) assignment.hoursSpent = Math.min(assignment.estimatedHours, assignment.hoursSpent + item.hours);
        }
        return item;
      }
    }
  };
}
module.exports = { createServices };
