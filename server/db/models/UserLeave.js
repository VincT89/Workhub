import { Schema, model } from "mongoose";

const UserLeaveSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},
		vacationHours: {
			type: Number,
			required: true,
		},
		leaveHours: {
			type: Number,
			required: true,
		},
		requestedHours: {
			type: [
				{
					year: Number,
					hours: Number,
					from: Date,
					to: Date,
					timeFrom: String,
					timeTo: String,
					mode: {
						type: String,
						enum: ["vacation", "leave"],
					},
					status: {
						type: String,
						enum: ["approved", "pending", "denied"],
						default: "pending",
					},
				},
			],
		},
	},
	{ strict: true, timestamps: true, versionKey: false }
);

const UserLeaveModel = model("UserLeave", UserLeaveSchema);

export default UserLeaveModel;
