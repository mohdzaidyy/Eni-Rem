import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customer.routes.js';
import tailorRoutes from './routes/tailor.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import invoiceRoutes from './routes/invoice.routes.js';
import measurementCategoryRoutes from './routes/measurementCategory.routes.js';
import measurementRoutes from './routes/measurement.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import uploadRoutes from './routes/upload.routes.js';

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
app.use(express.static("public"))
app.use(cookieParser())

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/tailors', tailorRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/measurement-categories', measurementCategoryRoutes);
app.use('/api/measurements', measurementRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/uploads', uploadRoutes);

export default app