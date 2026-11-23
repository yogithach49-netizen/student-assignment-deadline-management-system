function requireStudent(req, res, next) {
  const studentId = req.header('x-student-id');
  if (!studentId) return res.status(401).json({ error: 'Authentication required' });
  req.studentId = studentId;
  next();
}
module.exports = { requireStudent };
