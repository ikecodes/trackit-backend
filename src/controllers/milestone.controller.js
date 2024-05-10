const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');
const { MilestoneTask } = require('../models');
const Milestone = require('../models/Milstone.model');
const { default: TaskChecklist } = require('../models/TaskChecklist.model');
const User = require('../models/User.model');
const { MilestoneService } = require('../services');
const { createMilestoneTask } = require('../services/milestone-task.service');
const { createTaskChecklist } = require('../services/task-checklist.service');
module.exports = {
    /**
     * @function createProject
     * @route /api/v1/milestone/invite-contractor
     * @method POST
     */
    inviteSubcontractorHandler: catchAsync(async (req, res, next) => {
        const { body, user } = req
        const email = body.email;

        if(!email){
            return next(new AppError('Please provide a user email', 400))
        }

        const userExists = await User.findOne({email,})

        if(!userExists){
            return next(new AppError('User with email does not exist', 400))
        }
        
        return res.json({data: userExists})
    }),

    /**
     * @function createProject
     * @route /api/v1/milestone/task
     * @method POST
     */
    createMilestoneTaskHandler: catchAsync(async (req, res, next) => {
        //TODO
        //VALIDATE BODY
        const { body } = req
        const {checklist, ...task} = body;

        const milestone = await MilestoneService.findOneById(task.milestone)

        const milestoneTask = await createMilestoneTask(task)

        try {
            const checklistPromise = checklist.map(async (item) => {
                const newChecklist = await createTaskChecklist({
                    ...item,
                    contractor: item?.contractor?._id,
                    milestoneTask: milestoneTask._id,
                })
                return newChecklist._id;
            });
            
            const createdChecklist = await Promise.all(checklistPromise)
            milestoneTask.checklist = createdChecklist;
            milestone.tasks.push(milestoneTask);
            await MilestoneTask.findOneAndUpdate({_id: milestoneTask._id},milestoneTask)
            await Milestone.findOneAndUpdate({_id: milestone._id}, milestone);

            return res.json({
                data: milestoneTask,
            })

        } catch (error) {
            console.log({...error})
            return next(new AppError(error.message,500))
        }
    }),
}
