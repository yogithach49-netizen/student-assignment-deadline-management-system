const VALID_PRIORITIES = ['High', 'Medium', 'Low'];
const VALID_STATUSES = ['Pending', 'In Progress', 'Completed'];

function validateAssignment(input) {
  const errors = [];
  if (!input || typeof input.title !== 'string' || !input.title.trim()) {
    errors.push('Title is required');
  }
  if (!input || !input.courseId) errors.push('Course is required');
  if (!input || !input.dueDate || Number.isNaN(Date.parse(input.dueDate))) {
    errors.push('A valid due date is required');
  }
  if (input && input.priority !== undefined && !VALID_PRIORITIES.includes(input.priority)) {
    errors.push('Priority must be High, Medium or Low');
  }
  if (input && input.status !== undefined && !VALID_STATUSES.includes(input.status)) {
    errors.push('Status must be Pending, In Progress or Completed');
  }
  if (input && input.estimatedHours !== undefined &&
      (typeof input.estimatedHours !== 'number' || input.estimatedHours < 0.5 || input.estimatedHours > 100)) {
    errors.push('Estimated hours must be between 0.5 and 100');
  }
  return { valid: errors.length === 0, errors };
}
module.exports = { validateAssignment, VALID_PRIORITIES, VALID_STATUSES };
