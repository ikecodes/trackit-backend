const { TaskChecklist } = require("../models")

const createTaskChecklist = async ({contractor, name, status, due, milestoneTask}) => {
    return await TaskChecklist.create({
        contractor,
        name,
        status,
        due,
        milestoneTask,
    })
}

module.exports = {
    createTaskChecklist
}