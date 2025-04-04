import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userID: {
      type: Object,
      required: true,
    },
    message: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model(
  "Notifications",
  NotificationSchema
);
