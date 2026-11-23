const express = require('express');
const { requireStudent } = require('../middleware/auth');

function createRoutes(services) {
  const router = express.Router();
  router.post('/auth/register', (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password || String(password).length < 6) return res.status(400).json({ error: 'Email and password (at least 6 characters) are required' });
    if (services.store.students.some(s => s.email === email)) return res.status(409).json({ error: 'Email already registered' });
    const student = { id: String(services.store.nextId++), email, passwordHash: `demo-hash-${password}` };
    services.store.students.push(student);
    res.status(201).json({ id: student.id, email: student.email });
  });
  router.post('/auth/login', (req, res) => {
    const { email, password } = req.body || {};
    const student = services.store.students.find(s => s.email === email && s.passwordHash === `demo-hash-${password}`);
    if (!student) return res.status(401).json({ error: 'Invalid email or password' });
    res.json({ studentId: student.id, token: `demo-token-${student.id}` });
  });
  router.use(requireStudent);
  router.get('/courses', (req, res) => res.json(services.courses.list(req.studentId)));
  router.post('/courses', (req, res) => res.status(201).json(services.courses.create(req.studentId, req.body.name)));
  router.get('/assignments', (req, res) => res.json(services.assignments.list(req.studentId)));
  router.post('/assignments', (req, res) => res.status(201).json(services.assignments.create(req.studentId, req.body)));
  router.patch('/assignments/:id', (req, res) => res.json(services.assignments.update(req.studentId, req.params.id, req.body)));
  router.delete('/assignments/:id', (req, res) => res.json(services.assignments.remove(req.studentId, req.params.id)));
  router.get('/dashboard', (req, res) => res.json(services.dashboard.summary(req.studentId)));
  router.put('/plan/availability', (req, res) => res.json(services.planner.setAvailability(req.studentId, req.body.hoursByDate)));
  router.get('/plan/today', (req, res) => res.json(services.planner.getPlan(req.studentId)));
  router.patch('/plan/items/:id', (req, res) => res.json(services.planner.completeSession(req.studentId, req.params.id)));
  return router;
}
module.exports = { createRoutes };
