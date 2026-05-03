const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createTask = async (req, res) => {
  const { title, description, assigneeId, dueDate } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const task = await prisma.task.create({
    data: {
      title, description,
      projectId:  req.params.projectId,
      assigneeId: assigneeId || null,
      dueDate:    dueDate ? new Date(dueDate) : null
    }
  });
  res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
  const { status, assigneeId } = req.query;
  const tasks = await prisma.task.findMany({
    where: {
      projectId: req.params.projectId,
      ...(status     && { status }),
      ...(assigneeId && { assigneeId })
    },
    include: { assignee: { select: { id: true, name: true } } }
  });
  res.json(tasks);
};

exports.updateTask = async (req, res) => {
  const { title, description, status, assigneeId, dueDate } = req.body;
  const task = await prisma.task.update({
    where: { id: req.params.taskId },
    data: {
      title, description, status,
      assigneeId: assigneeId || null,
      dueDate:    dueDate ? new Date(dueDate) : null
    }
  });
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  await prisma.task.delete({ where: { id: req.params.taskId } });
  res.json({ message: 'Task deleted' });
}; 
