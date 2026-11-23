function generatePlan(assignments, availability, now = new Date()) {
  const dailyHours = {};
  for (let offset = 0; offset < 14; offset++) {
    const day = new Date(now);
    day.setDate(day.getDate() + offset);
    const key = day.toISOString().slice(0, 10);
    dailyHours[key] = Number(availability[key] || 0);
  }

  const tasks = assignments
    .filter(a => a.status !== 'Completed')
    .map(a => ({ ...a, remaining: Math.max(0, Number(a.estimatedHours || 0) - Number(a.hoursSpent || 0)) }))
    .filter(a => a.remaining > 0)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate) ||
      ({ High: 3, Medium: 2, Low: 1 }[b.priority] - { High: 3, Medium: 2, Low: 1 }[a.priority]));

  const sessions = [];
  const atRisk = [];
  for (const task of tasks) {
    let remaining = task.remaining;
    const deadline = new Date(task.dueDate);
    for (const dayKey of Object.keys(dailyHours)) {
      if (remaining <= 0) break;
      const day = new Date(`${dayKey}T00:00:00`);
      if (day >= deadline || dailyHours[dayKey] <= 0) continue;
      const alreadyScheduled = sessions.filter(s => s.date === dayKey && s.assignmentId === task.id)
        .reduce((sum, s) => sum + s.hours, 0);
      const capacity = Math.min(dailyHours[dayKey], 3) - alreadyScheduled;
      if (capacity <= 0) continue;
      const hours = Math.min(remaining, capacity);
      sessions.push({ id: `${task.id}-${dayKey}`, assignmentId: task.id, title: task.title, date: dayKey, hours, done: false });
      remaining -= hours;
      dailyHours[dayKey] -= hours;
    }
    if (remaining > 0) atRisk.push({ assignmentId: task.id, title: task.title, shortfallHours: Number(remaining.toFixed(2)) });
  }
  return { sessions, atRisk, generatedAt: now.toISOString() };
}
module.exports = { generatePlan };
