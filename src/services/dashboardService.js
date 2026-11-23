function getDashboardSummary(assignments, now = new Date()) {
  const total = assignments.length;
  const completed = assignments.filter(a => a.status === 'Completed').length;
  const pending = assignments.filter(a => a.status !== 'Completed').length;
  const overdue = assignments.filter(a => a.status !== 'Completed' && new Date(a.dueDate) < now).length;
  const upcoming = assignments
    .filter(a => a.status !== 'Completed' && new Date(a.dueDate) >= now)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);
  return {
    total, pending, completed, overdue,
    completionPercentage: total === 0 ? 0 : Math.round((completed / total) * 100),
    upcoming
  };
}
module.exports = { getDashboardSummary };
