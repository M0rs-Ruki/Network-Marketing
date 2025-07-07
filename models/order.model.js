
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  }

}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;