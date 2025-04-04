import validator from "validator";
import mongoose from "mongoose";

const victimSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Crendials" + value);
        }
      },
    },

    password: {
      type: String,
      require: true,
      minLength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("password is too weak");
        }
      },
    },
    phone: {
      type: String,
      require: true,
      validate(value) {
        if (!validator.isMobilePhone(value, "en-IN", { strictmode: true })) {
          throw new Error("Enter the valid Mobile number");
        }
      },
    },
    role: {
      type: Number,
      default: 1,
    },
    requests: {
      type: Object,
    },
  },
  { timestamps: true }
);

const volunteerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Crendials" + value);
        }
      },
    },

    password: {
      type: String,
      require: true,
      minLength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("password is too weak");
        }
      },
    },
    phone: {
      type: String,
      require: true,
      validate(value) {
        if (!validator.isMobilePhone(value, "en-IN", { strictmode: true })) {
          throw new Error("Enter the valid Mobile number");
        }
      },
    },
    role: {
      type: Number,
      default: 2,
    },
    requests: {
      type: Object,
    },
  },
  { timestamps: true }
);

export const victim = mongoose.model("victim", victimSchema);
export const volunteer = mongoose.model("volunteer", volunteerSchema);
