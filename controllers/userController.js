const User = require('../models/userModel')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')

const myProfile = async(req, res) => {
    const {userId} = req?.user || {}
    const user = await User.findOne({_id: userId}).select('-password').populate({path: 'recommendedTests', select: 'assessments _id'})
    if (!user) {
        throw new CustomError.BadRequestError('Not authenticated') 
    }
    
    res.status(StatusCodes.OK).json({user}) 
}

const getAllUsers = async(req, res) => {

    const {
            search,
            limit = 10,
            page = 1,
            select
        } = req.query
    

        const totalUsers = await User.countDocuments()
        const users = await User.find({
            $or: [
                {
                    firstname: {
                        $regex: search || '',
                        $options: 'i'
                    },
                },
                {
                    lastname: {
                        $regex: search || '',
                        $options: 'i'
                    }
                },
                {
                    email: {
                        $regex: search || '',
                        $options: 'i'
                    }
                },
                 {
                    role: {
                        $regex: search || '',
                        $options: 'i'
                    }
                }
            ]
            }).select(select)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(limit) * (parseInt(page) - 1))

        const totalPages = Math.ceil(totalUsers / limit);
        
        res.status(StatusCodes.OK).json({ 
            users, 
            count: totalUsers,
            totalPages,
            currentPage: parseInt(page),
            perPage: parseInt(limit),
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1,
        })
}

const getSingleUser = async(req, res) => {
    const {id} = req.params

    if (!id) {
        throw new CustomError.NotFoundError('No id found')
    }

    const user = await User.findOne({_id: id}).populate({path: 'recommendedTests', select: 'assessments _id'})


    res.status(StatusCodes.OK).json({ user})
}

const updateUser = async(req, res) => {
    const { id } = req.params

    if (!id) {
        throw new CustomError.BadRequestError(`User id must be specified`)
    }

    const user = await User.findOneAndUpdate({
        _id: id
    }, req.body, {
        new: true,
        runValidators: true
    })

    if (!user) {
        throw new CustomError.BadRequestError('No user found')
    }

    res.status(StatusCodes.OK).json({ user })
}

module.exports = {
    myProfile,
    getAllUsers,
    updateUser,
    getSingleUser,
}

