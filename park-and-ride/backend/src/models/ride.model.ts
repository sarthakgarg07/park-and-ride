import mongoose, { Document, Schema } from 'mongoose';

// Interface for Ride document
export interface IRide extends Document {
  userId: mongoose.Types.ObjectId;
  origin: {
    name: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  destination: {
    name: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  rideType: 'standard' | 'express' | 'premium' | 'auto-rickshaw' | 'shared';
  scheduledTime: Date;
  estimatedArrival: Date;
  distance: number; // in km
  duration: number; // in minutes
  fare: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'wallet' | 'cash' | 'upi';
  driverId?: mongoose.Types.ObjectId;
  driverRating?: number;
  userRating?: number;
  routeCoordinates: Array<{
    latitude: number;
    longitude: number;
  }>;
  currentPosition?: {
    latitude: number;
    longitude: number;
  };
  stops: Array<{
    name: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    estimatedTime: Date;
    status: 'pending' | 'completed';
  }>;
  vehicleDetails?: {
    type: string;
    model: string;
    color: string;
    licensePlate: string;
  };
  cancellationReason?: string;
  cancellationFee?: number;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

const rideSchema = new Schema<IRide>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    origin: {
      name: {
        type: String,
        required: [true, 'Origin name is required'],
        trim: true,
      },
      address: {
        type: String,
        required: [true, 'Origin address is required'],
        trim: true,
      },
      coordinates: {
        latitude: {
          type: Number,
          required: [true, 'Origin latitude is required'],
        },
        longitude: {
          type: Number,
          required: [true, 'Origin longitude is required'],
        },
      },
    },
    destination: {
      name: {
        type: String,
        required: [true, 'Destination name is required'],
        trim: true,
      },
      address: {
        type: String,
        required: [true, 'Destination address is required'],
        trim: true,
      },
      coordinates: {
        latitude: {
          type: Number,
          required: [true, 'Destination latitude is required'],
        },
        longitude: {
          type: Number,
          required: [true, 'Destination longitude is required'],
        },
      },
    },
    rideType: {
      type: String,
      enum: ['standard', 'express', 'premium', 'auto-rickshaw', 'shared'],
      default: 'standard',
    },
    scheduledTime: {
      type: Date,
      required: [true, 'Scheduled time is required'],
    },
    estimatedArrival: {
      type: Date,
      required: [true, 'Estimated arrival time is required'],
    },
    distance: {
      type: Number,
      required: [true, 'Distance is required'],
      min: [0, 'Distance must be positive'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [0, 'Duration must be positive'],
    },
    fare: {
      type: Number,
      required: [true, 'Fare is required'],
      min: [0, 'Fare must be positive'],
    },
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
      default: 'scheduled',
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
    driverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    driverRating: {
      type: Number,
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
    },
    userRating: {
      type: Number,
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
    },
    routeCoordinates: [
      {
        latitude: {
          type: Number,
          required: true,
        },
        longitude: {
          type: Number,
          required: true,
        },
      },
    ],
    currentPosition: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
    stops: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        address: {
          type: String,
          required: true,
          trim: true,
        },
        coordinates: {
          latitude: {
            type: Number,
            required: true,
          },
          longitude: {
            type: Number,
            required: true,
          },
        },
        estimatedTime: {
          type: Date,
          required: true,
        },
        status: {
          type: String,
          enum: ['pending', 'completed'],
          default: 'pending',
        },
      },
    ],
    vehicleDetails: {
      type: {
        type: String,
        trim: true,
      },
      model: {
        type: String,
        trim: true,
      },
      color: {
        type: String,
        trim: true,
      },
      licensePlate: {
        type: String,
        trim: true,
      },
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
  },
  {
    timestamps: true,
  }
);

// Create indexes for efficient querying
rideSchema.index({ userId: 1, scheduledTime: -1 });
rideSchema.index({ status: 1 });
rideSchema.index({ driverId: 1, status: 1 });

const Ride = mongoose.model<IRide>('Ride', rideSchema);

export default Ride; 