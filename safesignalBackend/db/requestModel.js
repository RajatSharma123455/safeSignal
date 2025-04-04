import mongoose from "mongoose";
import validator from "validator";
import { Counter } from "./counterModel.js";

const requestDetailSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 50,
    minLength: 4,
  },
  location: {
    type: String,
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
});

const requestSchema = new mongoose.Schema(
  {
    victimInfo: {
      type: Object,
      required: true,
    },
    volunteerInfo: {
      type: mongoose.Schema.Types.ObjectId,
    },
    acceptedBy: {
      type: [Object],
    },
    rejectedBy: {
      type: [Object],
    },
    requestType: {
      type: [String],
    },
    requestDetails: requestDetailSchema,
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
    status: {
      type: String,
      enum: ["pending", "in progress", "complete", "canceled", "rejected"],
      default: "pending",
    },
    requestID: { type: String, unique: true },
  },
  { timestamps: true }
);

requestSchema.index({ location: "2dsphere" });

// Auto-generate requestID before saving
requestSchema.pre("save", async function (next) {
  const request = this;

  if (!request.requestID) {
    const counter = await Counter.findOneAndUpdate(
      { name: "requestID" },
      { $inc: { seq: 1 } }, // Increment by 1
      { new: true, upsert: true }
    );

    request.requestID = `#REQ-${counter.seq.toString().padStart(4, "0")}`; // Format as #REQ-0001
  }

  next();
});

export const requestModel = mongoose.model("Emergency Requests", requestSchema);
