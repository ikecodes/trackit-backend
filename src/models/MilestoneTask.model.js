const mongoose = require('mongoose')

const MilestoneTaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Task title is required"]
        },
        description: {
            type: String,
            required: [true, 'Task description is required']
        },
        startDate: {
            type: Date,
            required: [true, "Task start date is required"]
        },
        endDate: {
            type: Date,
            required: [true, "Task end date is required"]
        },
        checklist: [
            {
                type: mongoose.Types.ObjectId,
                ref: "TaskChecklist",
            }
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

MilestoneTaskSchema.pre(/^find/, function (next) {
    this.populate('checklist')
    next()
})

const MilestoneTask = mongoose.model("MilestoneTask", MilestoneTaskSchema);

module.exports =  MilestoneTask;