const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createProject = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Project name is required' });

  const project = await prisma.project.create({
    data: {
      name, description,
      ownerId: req.user.id,
      members: { create: { userId: req.user.id, role: 'ADMIN' } }
    }
  });
  res.status(201).json(project);
};

exports.getProjects = async (req, res) => {
  const projects = await prisma.project.findMany({
    where: { members: { some: { userId: req.user.id } } },
    include: {
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
      _count: { select: { tasks: true } }
    }
  });
  res.json(projects);
};

exports.getProject = async (req, res) => {
  const project = await prisma.project.findFirst({
    where: { id: req.params.id, members: { some: { userId: req.user.id } } },
    include: {
      tasks:   { include: { assignee: { select: { id: true, name: true } } } },
      members: { include: { user:    { select: { id: true, name: true, email: true } } } }
    }
  });
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
};

exports.updateProject = async (req, res) => {
  const { name, description } = req.body;
  const project = await prisma.project.update({
    where: { id: req.params.id },
    data:  { name, description }
  });
  res.json(project);
};

exports.deleteProject = async (req, res) => {
  await prisma.task.deleteMany({ where: { projectId: req.params.id } });
  await prisma.projectMember.deleteMany({ where: { projectId: req.params.id } });
  await prisma.project.delete({ where: { id: req.params.id } });
  res.json({ message: 'Project deleted' });
};

exports.addMember = async (req, res) => {
  const { userId, role } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  const membership = await prisma.projectMember.create({
    data: { userId, projectId: req.params.id, role: role || 'MEMBER' }
  });
  res.status(201).json(membership);
}; 
