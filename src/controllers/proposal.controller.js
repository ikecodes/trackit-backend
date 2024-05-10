const Proposal = require('../models/Proposal.model')
const Milestone = require('../models/Milstone.model')

/**
 * @function createProposal
 * @route
 * @method POST
 */
const AppError = require('../helpers/appError')
const { getAllUserProprosal } = require('../services/proposal.service')
;(exports.createProposal = async (req, res) => {
    try {
        const user = req.user
        const { project, userPitch, link, documents, milestones } = req.body

        const proposal = await Proposal.create({
            project: project._id,
            owner: user._id,
            userPitch,
            link,
            documents,
        })
        const newMilestones = milestones.map(async (milestone) => {
            return await Milestone.create({
                milestoneName: milestone.milestoneName,
                milestoneBudget: milestone.milestoneBudget,
                milestoneDescription: milestone.milestoneDescription,
                proposal: proposal._id,
            })
        })

        let createdMilestones = await Promise.all(newMilestones)

        proposal.milestones = createdMilestones.map((milstone) => milstone._id)
        await proposal.save()
        res.status(201).json({
            status: 'success',
            data: {
                proposal,
            },
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        })
    }
}),
    /**
     * @function getAllProposal
     * @route
     * @method GET
     */

    (exports.getAllProposals = async (req, res) => {
        try {
            const { user, query } = req
            const proposals = await getAllUserProprosal({
                user: user._id,
                query,
            })

            // console.log({proposals})
            res.status(200).json({
                status: 'success',
                data: proposals,
            })
        } catch (error) {
            console.log({ error })
            res.status(500).json({
                status: 'error',
                message: error.message,
            })
        }
    })
/**
 * @function countAllAcceptedProposal
 * @route
 * @method GET
 */
exports.getTotalApprovedProposals = async (req, res) => {
    // const user = req

    const totalApprovedApplicants = await Proposal.countDocuments({
        status: 'approved',
        userId: req.user._id,
    })
    // console.log({ totalApprovedApplicants })
    res.json(totalApprovedApplicants)
}
/**
 * @function getProposalById
 * @route
 * @method GET
 */

exports.getProposalById = async (req, res) => {
    try {
        const proposal = await Proposal.findById(req.params.id)
        if (!proposal) {
            return res.status(404).json({
                status: 'fail',
                message: 'Proposal not found',
            })
        }

        res.status(200).json({
            status: 'success',
            data: proposal,
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        })
    }
}

/**
 * @function getProposalsByProjectId
 * @route
 * @method get
 */

exports.getProposalsByProjectId = async (req, res) => {
    try {
        const projectId = req.params.projectId
        const proposals = await Proposal.find({ project: projectId })

        res.status(200).json({
            status: 'success',
            data: proposals,
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        })
    }
}

/**
 * @function updateProposal
 * @route
 * @method PUT
 */

exports.updateProposal = async (req, res) => {
    try {
        const proposal = await Proposal.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        )

        if (!proposal) {
            return res.status(404).json({
                status: 'fail',
                message: 'Proposal not found',
            })
        }

        res.status(200).json({
            status: 'success',
            data: proposal,
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        })
    }
}
/**
 * @function deleteProposal
 * @route
 * @method DELETE
 */
;(exports.deleteProposal = async (req, res) => {
    try {
        const proposal = await Proposal.findByIdAndDelete(req.params.id)

        if (!proposal) {
            return res.status(404).json({
                status: 'fail',
                message: 'Proposal not found',
            })
        }

        res.status(204).json({
            status: 'success',
            data: null,
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        })
    }
}),
    /**
     * @function approvedProposal
     * @route
     * @method PATCH
     */
    (exports.approveProposal = async (req, res, next) => {
        try {
            const { projectId } = req.query
            const { id } = req.params

            const proposal = await Proposal.findOne({
                project: projectId,
                status: 'approved',
            })

            if (!proposal) {
                await Proposal.findByIdAndUpdate(id, {
                    status: 'approved',
                })
                return res.status(200).json({
                    status: 'success',
                })
            } else {
                if (proposal._id.toString() === id) {
                    return next(
                        new AppError('You already approved this proposal', 400)
                    )
                } else {
                    return next(
                        new AppError(
                            'You already approved another proposal',
                            400
                        )
                    )
                }
            }
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            })
        }
    }),
    /**
     * @function pendProposal
     * @route
     * @method PATCH
     */

    (exports.pendProposal = async (req, res) => {
        try {
            const proposal = await Proposal.findByIdAndUpdate(
                req.params.id,
                { status: 'pending' },
                { new: true }
            )

            if (!proposal) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Proposal not found',
                })
            }

            res.status(200).json({
                status: 'success',
                data: {
                    proposal,
                },
            })
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message,
            })
        }
    })
/**
 * @function pendingProposal
 * @route
 * @method PATCH
 */

exports.pendingProposals = async (req, res) => {
    try {
        const proposal = await Proposal.findByIdAndUpdate(
            req.params.id,
            { status: 'pending' },
            { new: true }
        )

        if (!proposal) {
            return res.status(404).json({
                status: 'fail',
                message: 'Proposal not found',
            })
        }

        res.status(200).json({
            status: 'success',
            data: {
                proposal,
            },
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        })
    }
}

/**
 * @function rejectedProposal
 * @route
 * @method PATCH
 */
exports.rejectProposal = async (req, res) => {
    try {
        const proposal = await Proposal.findByIdAndUpdate(
            req.params.id,
            { status: 'rejected' },
            { new: true }
        )

        if (!proposal) {
            return res.status(404).json({
                status: 'fail',
                message: 'Proposal not found',
            })
        }

        res.status(200).json({
            status: 'success',
            data: {
                proposal,
            },
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        })
    }
}
