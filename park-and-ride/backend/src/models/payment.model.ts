import mongoose, { Document, Schema } from 'mongoose';

// Interface for Payment document
export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'wallet' | 'cash' | 'upi';
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';
  transactionId?: string;
  gatewayTransactionId?: string;
  bookingType: 'parking' | 'ride' | 'subscription';
  bookingId?: mongoose.Types.ObjectId;
  refundAmount?: number;
  refundReason?: string;
  cardDetails?: {
    last4: string;
    brand: string;
    expiryMonth: string;
    expiryYear: string;
  };
  upiDetails?: {
    id: string;
    provider: string;
  };
  billingAddress?: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  receiptUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      default: 'INR',
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'wallet', 'cash', 'upi'],
      required: [true, 'Payment method is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    gatewayTransactionId: {
      type: String,
      trim: true,
    },
    bookingType: {
      type: String,
      enum: ['parking', 'ride', 'subscription'],
      required: [true, 'Booking type is required'],
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      refPath: function() {
        if ((this as any).bookingType === 'parking') return 'ParkingBooking';
        if ((this as any).bookingType === 'ride') return 'Ride';
        return 'Subscription';
      }
    },
    refundAmount: {
      type: Number,
      min: [0, 'Refund amount must be positive'],
    },
    refundReason: {
      type: String,
      trim: true,
    },
    cardDetails: {
      last4: {
        type: String,
        trim: true,
      },
      brand: {
        type: String,
        trim: true,
      },
      expiryMonth: {
        type: String,
        trim: true,
      },
      expiryYear: {
        type: String,
        trim: true,
      },
    },
    upiDetails: {
      id: {
        type: String,
        trim: true,
      },
      provider: {
        type: String,
        trim: true,
      },
    },
    billingAddress: {
      name: {
        type: String,
        trim: true,
      },
      line1: {
        type: String,
        trim: true,
      },
      line2: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      postalCode: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
    },
    receiptUrl: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate a unique transaction ID
paymentSchema.pre('save', async function (next) {
  if (this.isNew && !this.transactionId) {
    const timestamp = new Date().getTime();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.transactionId = `TXN-${timestamp}-${randomStr}`;
  }
  next();
});

// Create indexes for efficient querying
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ bookingId: 1, bookingType: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ transactionId: 1 }, { unique: true, sparse: true });

const Payment = mongoose.model<IPayment>('Payment', paymentSchema);

export default Payment; 