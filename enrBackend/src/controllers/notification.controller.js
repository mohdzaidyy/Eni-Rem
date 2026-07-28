import Notification from '../models/notification.model.js';

// GET /api/notifications - returns notifications for the logged-in user
// owner/tailor are stored against the User model; customers against Customer
export async function getMyNotifications(req, res) {
  try {
    const recipientModel = req.user.role === 'customer' ? 'Customer' : 'User';

    const notifications = await Notification.find({
      recipientId: req.user.id,
      recipientModel,
    }).sort({ scheduledFor: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: err.message });
  }
}

// used internally (cron jobs, order/payment side-effects) rather than exposed to the frontend directly
export async function createNotification({ type, recipientId, recipientModel, message, scheduledFor }) {
  return Notification.create({ type, recipientId, recipientModel, message, scheduledFor });
}

// PATCH /api/notifications/:id/read
export async function markAsRead(req, res) {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark notification as read', error: err.message });
  }
}

export async function deleteNotification(req, res) {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete notification', error: err.message });
  }
}