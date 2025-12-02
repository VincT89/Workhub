import { Schema, model } from "mongoose";

const UserShiftSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    shiftDays: {
      type: [String], // array di giorni della settimana
      required: true,
      default: [],
    },

    shiftHours: {
      type: {
        start: { type: String, required: true }, // "08:00" ora di inizio
        end: { type: String, required: true },   // "18:00" ora di fine
      },
      required: true,
    },
  },
  { strict: true, timestamps: true, versionKey: false }
);

const UserShift = model("UserShift", UserShiftSchema);

export default UserShift;
