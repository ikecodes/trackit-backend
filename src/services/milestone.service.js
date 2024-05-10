const Milestone = require("../models/Milstone.model")

const inviteSubcontractor = (email) = {

}

const findOneById = async (id) => {
    return await Milestone.findById(id)
}


module.exports = {
    inviteSubcontractor,
    findOneById
}