const mongoose = require('mongoose')
const Proposal = require('../models/Proposal.model')

const filterGenerator = (
    { priority, name, userPitch, lowBudget, highBudget },
    prefix = ''
) => {
    console.log({userPitch})
    let filter = {$and:[{}]}
    if (priority != undefined) {
        filter.push({ [`${prefix}priority`]: Number(priority) })
    }
    if (userPitch) {
        filter.$and.push({ userPitch: { $regex: userPitch, $options: 'i' } })
    }

    if (lowBudget != undefined && highBudget) {
        filter.push({
            $or: [
                { [`${prefix}budget`]: { $gte: Number(lowBudget) } },
                { [`${prefix}budget`]: { $gte: Number(highBudget) } },
            ],
        })
    }
    if (filter.$and.length > 1) {
        filter.$and = filter.$and.filter((f) => Object.keys(f).length !== 0)
        console.log('////', filter?.$and?.[0].userPitch)
        return filter
    } else {
        return {}
    }
}

const getAllUserProprosal = async ({
    user,
    query: { userPitch, status, sort_by, priority, lowBudget, highBudget, },
}) => {
    const filter = filterGenerator(
        {
            userPitch, 
            status,
            sort_by,
            priority,
            lowBudget,
            highBudget,
        },
        'proposal.'
    )
    const sort = {}
    console.log({filter})
    // if (sort_by === 'alphabetic') {
    //     sort['proposal.name'] = 1
    // } else {
    //     sort['proposal.createdAt'] = -1
    // }
    return Proposal.aggregate([
        {
            $match: {owner:user , ...filter},
        },
        
    ]).exec()
  

// const getAllProposal = async ({
//     priority,
//     lowBudget,
//     highBudget,
//     name,

// }) => {
//     const filter = filterGenerator({

//         priority,
//         lowBudget,
//         highBudget,
//         name,
        
//     })
//     const sort = {}
//     if (sort_by === 'alphabetic') {
//         sort.name = 1
//     } else {
//         sort.createdAt = -1
//     }
//     return await Proposal.find({ $and: filter }).sort(sort)
// }
}



module.exports = {
    getAllUserProprosal,
    // getAllProposal,
}