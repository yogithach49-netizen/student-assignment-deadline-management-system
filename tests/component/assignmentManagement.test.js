const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { setup } = require('../helpers');

test('component: student creates a course and an assignment successfully', async () => {
  const { app } = setup();
  const course = await request(app).post('/api/courses').set('x-student-id', 's1').send({ name: 'Cloud' }).expect(201);
  const assignment = await request(app).post('/api/assignments').set('x-student-id', 's1')
    .send({ title: 'Lab 1', courseId: course.body.id, dueDate: '2030-12-01', estimatedHours: 2 }).expect(201);
  assert.equal(assignment.body.title, 'Lab 1');
});
test('component: rejects an assignment with invalid input', async () => {
  const { app } = setup();
  await request(app).post('/api/assignments').set('x-student-id', 's1')
    .send({ title: '', courseId: 'c1', dueDate: 'not-a-date' }).expect(400);
});
test('component: prevents access without student authentication', async () => {
  const { app } = setup();
  await request(app).get('/api/assignments').expect(401);
});
