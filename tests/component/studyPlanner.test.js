const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { setup } = require('../helpers');

test('component: creates a plan from availability and an assignment', async () => {
  const { app } = setup();
  const course = await request(app).post('/api/courses').set('x-student-id', 's1').send({ name: 'Cloud' }).expect(201);
  const today = new Date();
  const dateKey = (offset) => { const d = new Date(today); d.setDate(d.getDate() + offset); return d.toISOString().slice(0, 10); };
  await request(app).post('/api/assignments').set('x-student-id', 's1')
    .send({ title: 'Project', courseId: course.body.id, dueDate: `${dateKey(5)}T23:00:00.000Z`, estimatedHours: 2 }).expect(201);
  const plan = await request(app).put('/api/plan/availability').set('x-student-id', 's1')
    .send({ hoursByDate: { [dateKey(1)]: 2 } }).expect(200);
  assert.equal(plan.body.sessions.length, 1);
});
test('component: rejects availability outside the allowed range', async () => {
  const { app } = setup();
  await request(app).put('/api/plan/availability').set('x-student-id', 's1')
    .send({ hoursByDate: { '2030-01-01': 13 } }).expect(400);
});
test('component: reports a missing study session when completing an unknown item', async () => {
  const { app } = setup();
  await request(app).patch('/api/plan/items/missing').set('x-student-id', 's1').send({}).expect(404);
});
