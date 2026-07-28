import Order from '../models/order.model.js';
import Payment from '../models/payment.model.js';

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

// GET /api/dashboard/stats - powers the Home Page's stat cards + chart
export async function getDashboardStats(req, res) {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      todayDeliveries,
      tomorrowDeliveries,
      totalOrders,
      pendingPayments,
      advancePayments,
      monthlyRevenueAgg,
      deliveriesPerDay,
    ] = await Promise.all([
      Order.countDocuments({
        deliveryDate: { $gte: startOfDay(today), $lte: endOfDay(today) },
      }),
      Order.countDocuments({
        deliveryDate: { $gte: startOfDay(tomorrow), $lte: endOfDay(tomorrow) },
      }),
      Order.countDocuments({}),
      // fully unpaid or partially unpaid orders that are not yet delivered
      Order.countDocuments({ balanceDue: { $gt: 0 }, orderStatus: { $ne: 'Delivered' } }),
      // orders with some payment made but still not fully paid off
      Order.countDocuments({ advancePaid: { $gt: 0 }, balanceDue: { $gt: 0 } }),
      Payment.aggregate([
        { $match: { paymentDate: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Order.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$deliveryDate' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 30 },
      ]),
    ]);

    res.status(200).json({
      todayDeliveries,
      tomorrowDeliveries,
      totalOrders,
      pendingPayments,
      advancePayments,
      monthlyRevenue: monthlyRevenueAgg[0]?.total || 0,
      deliveriesPerDay: deliveriesPerDay.map((d) => ({ date: d._id, count: d.count })),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: err.message });
  }
}