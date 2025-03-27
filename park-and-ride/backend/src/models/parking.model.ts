import mongoose, { Document, Schema } from 'mongoose';

// Interface for ParkingFacility document
export interface IParkingFacility extends Document {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  totalSpots: number;
  availableSpots: number;
  hourlyRate: number;
  dailyRate: number;
  amenities: string[];
  images: string[];
  rating: number;
  reviews: {
    userId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
  operatingHours: {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }[];
  vehicleTypeRates: {
    vehicleType: string;
    hourlyMultiplier: number;
  }[];
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: Date;
  updatedAt: Date;
}

const parkingFacilitySchema = new Schema<IParkingFacility>(
  {
    name: {
      type: String,
      required: [true, 'Facility name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required'],
      trim: true,
    },
    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'Latitude is required'],
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required'],
      },
    },
    totalSpots: {
      type: Number,
      required: [true, 'Total spots is required'],
      min: [0, 'Total spots must be a positive number'],
    },
    availableSpots: {
      type: Number,
      required: [true, 'Available spots is required'],
      min: [0, 'Available spots must be a positive number'],
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rate is required'],
      min: [0, 'Hourly rate must be a positive number'],
    },
    dailyRate: {
      type: Number,
      required: [true, 'Daily rate is required'],
      min: [0, 'Daily rate must be a positive number'],
    },
    amenities: [{
      type: String,
      trim: true,
    }],
    images: [{
      type: String,
    }],
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be between 0 and 5'],
      max: [5, 'Rating must be between 0 and 5'],
    },
    reviews: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: [1, 'Rating must be between 1 and 5'],
        max: [5, 'Rating must be between 1 and 5'],
      },
      comment: {
        type: String,
        trim: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    operatingHours: [{
      day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
      open: {
        type: String,
        required: function() {
          return !(this as any).isClosed;
        },
      },
      close: {
        type: String,
        required: function() {
          return !(this as any).isClosed;
        },
      },
      isClosed: {
        type: Boolean,
        default: false,
      },
    }],
    vehicleTypeRates: [{
      vehicleType: {
        type: String,
        required: true,
        trim: true,
      },
      hourlyMultiplier: {
        type: Number,
        required: true,
        min: [0, 'Multiplier must be a positive number'],
      },
    }],
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for faster geospatial queries
parkingFacilitySchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });

const ParkingFacility = mongoose.model<IParkingFacility>('ParkingFacility', parkingFacilitySchema);

export default ParkingFacility; 