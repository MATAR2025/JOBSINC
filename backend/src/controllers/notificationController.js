const prisma = require('../config/prisma');

function dto(notification) {
  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    link: notification.link,
    read: notification.read,
    createdAt: notification.createdAt,
  };
}

exports.list = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    const unreadCount = await prisma.notification.count({ where: { userId: req.user.userId, read: false } });
    res.json({ data: notifications.map(dto), unreadCount });
  } catch (_) {
    res.status(500).json({ error: 'Impossible de charger les messages.' });
  }
};

exports.markRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { id: req.params.id, userId: req.user.userId },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (_) {
    res.status(500).json({ error: 'Impossible de mettre à jour le message.' });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.userId, read: false },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (_) {
    res.status(500).json({ error: 'Impossible de mettre à jour les messages.' });
  }
};