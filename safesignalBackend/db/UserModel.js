import mongoose from "mongoose";
import validator from "validator";

const victimFormSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
      maxLength: 50,
      minLength: 4,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    disasterType: {
      type: String,
      lowercase: true,
      required: true,
      enum: {
        values: [
          "flood",
          "cyclone",
          "earthquake",
          "tsunami",
          "draught",
          "landslide",
          "wildfire",
          "avalanche",
        ],
        message: "${VALUE} IS NOT SUPPORTED",
      },
      set: (value) => value.toLowerCase(),
    },
    dateAndTime: {
      type: Date,
      required: true,
      min: new Date("2020-01-01"),
      max: new Date("2100-01-01"),
    },
    immediateNeeds: {
      type: String,
      lowercase: true,
      required: true,
      enum: {
        values: [
          "food and water",
          "shelter",
          "medical assistance",
          "clothing",
          "hygiene kits",
        ],
        message: "${VALUE} IS NOT SUPPORTED",
      },
      set: (value) => value.toLowerCase(),
    },
    numberOfPeople: {
      type: Number,
      min: 1,
      max: 100000,
      required: true,
    },
    medicalConditions: {
      type: String,
      required: true,
      lowercase: true,
      enum: {
        values: ["chronic illness", "injuries", "disabilities"],
        message: "${VALUE} IS NOT SUPPORTED",
      },
      set: (value) => value.toLowerCase(),
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    role: {
      type: Number,
      default: 1,
    },
    requests: {
      type: [Object],
      ref: "Emergency Requests",
    },
  },
  { timestamps: true }
);

const volunteerFormSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
      maxLength: 50,
      minLength: 4,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    teamsize: {
      type: Number,
      min: 1,
      max: 1000,
      required: true,
    },
    dateAndTime: {
      type: Date,
      required: true,
      min: new Date("2020-01-01"),
      max: new Date("2100-01-01"),
    },
    expertise: {
      type: [String],
      lowercase: true,
      enum: {
        values: [
          "medical and health services",
          "search and rescue",
          "shelter support",
          "food and water",
          "communication and it",
          "logistics and transportation",
        ],
        message: "${VALUE} IS NOT SUPPORTED",
      },
      set: (value) => value.toLowerCase(),
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    role: {
      type: Number,
      default: 2,
    },
    requests: {
      type: [Object],
      ref: "Emergency Requests",
    },
  },
  { timestamps: true }
);

victimFormSchema.index({ location: "2dsphere" });
volunteerFormSchema.index({ location: "2dsphere" });

export const victimForm = mongoose.model("victimForm", victimFormSchema);
export const volunteerForm = mongoose.model(
  "volunteerForm",
  volunteerFormSchema
);
