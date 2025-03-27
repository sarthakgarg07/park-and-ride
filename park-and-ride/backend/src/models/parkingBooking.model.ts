import mongoose, { Document, Schema } from 'mongoose';

// Interface for ParkingBooking document
export interface IParkingBooking extends Document {
  userId: mongoose.Types.ObjectId;
  facilityId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  vehicleType: string;
  vehicleLicensePlate?: string;
  price: number;
  bookingStatus: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: 'card' | 'wallet' | 'cash' | 'upi';
  transactionId?: string;
  bookingCode: string;
  isExtended: boolean;
  originalEndTime?: Date;
  extensionFee?: number;
  cancellationReason?: string;
  cancellationFee?: number;
  specialInstructions?: string;
  feedback?: {
    rating: number;
    comment: string;
    submittedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const parkingBookingSchema = new Schema<IParkingBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    facilityId: {
      type: Schema.Types.ObjectId,
      ref: 'ParkingFacility',
      required: [true, 'Facility ID is required'],
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required'],
    },
    vehicleType: {
      type: String,
      required: [true, 'Vehicle type is required'],
      trim: true,
    },
    vehicleLicensePlate: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'wallet', 'cash', 'upi'],
    },
    transactionId: {
      type: String,
    },
    bookingCode: {
      type: String,
      required: [true, 'Booking code is required'],
      unique: true,
    },
    isExtended: {
      type: Boolean,
      default: false,
    },
    originalEndTime: {
      type: Date,
    },
    extensionFee: {
      type: Number,
      min: [0, 'Extension fee must be positive'],
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    cancellationFee: {
      type: Number,
      min: [0, 'Cancellation fee must be positive'],
    },
    specialInstructions: {
      type: String,
      trim: true,
    },
    feedback: {
      rating: {
        type: Number,
        min: [1, 'Rating must be between 1 and 5'],
        max: [5, 'Rating must be between 1 and 5'],
      },
      comment: {
        type: String,
        trim: true,
      },
      submittedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate a unique booking code
parkingBookingSchema.pre('save', async function (next) {
  if (this.isNew) {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.bookingCode = `PK-${randomCode}`;
  }
  next();
});

// Create indexes for efficient querying
parkingBookingSchema.index({ userId: 1, startTime: -1 });
parkingBookingSchema.index({ facilityId: 1, startTime: 1, endTime: 1 });
parkingBookingSchema.index({ bookingCode: 1 }, { unique: true });
parkingBookingSchema.index({ bookingStatus: 1 });

const ParkingBooking = mongoose.model<IParkingBooking>('ParkingBooking', parkingBookingSchema);

export default ParkingBooking;
