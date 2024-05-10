const mongoose = require('mongoose');
const { PENDING } = require('../constants/constants');

const TaskChecklistSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Task name is required"]
        },
        contractor: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        due: {
            type: Date,
            required: [true, "Task due date is required"],
        },
        status: {
            type: String,
            required: [true,"Task status is required"],
            default: PENDING,
        },
        milestoneTask: {
            type: mongoose.Types.ObjectId,
            ref: "MilestoneTask",
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const TaskChecklist = mongoose.model("TaskChecklist",TaskChecklistSchema);

module.exports =  TaskChecklist;