const { MilestoneTask } = require("../models")

const createMilestoneTask = async ({
    title,
    description,
    startDate,
    endDate,
    checklist

}) => {
    return await MilestoneTask.create({
    title,
    description,
    startDate,
    endDate,
    checklist
    })
}

const findOneById = async (id) => {
    return await MilestoneTask.findById(id)
} 

module.exports = {
    createMilestoneTask,
    findOneById,
}