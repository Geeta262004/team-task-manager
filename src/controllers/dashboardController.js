const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getDashboard = async (req, res) => {
  const userId = req.user.id;
  const now    = new Date();

  const [myTasks, overdue, byStatus, recentProjects] = await Promise.all([
    prisma.task.count({ where: { assigneeId: userId } }),

    prisma.task.count({
      where: { assigneeId: userId, dueDate: { lt: now }, status: { not: 'DONE' } }
    }),

    prisma.task.groupBy({
      by: ['status'],
      where: { assigneeId: userId },
      _count: true
    }),

    prisma.project.findMany({
      where:   { members: { some: { userId } } },
      take:    5,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { tasks: true } } }
    })
  ]);

  res.json({ myTasks, overdue, byStatus, recentProjects });
}; 
