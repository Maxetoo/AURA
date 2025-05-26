const User = require('../models/userModel');
const CustomError = require('../errors')
const { createCookies } = require('../services/helpers');
const { v4: uuidv4 } = require('uuid');
const { StatusCodes } = require('http-status-codes');
const { resetPasswordEmail, userVerificationEmail, therapistVerificationEmail} = require('../emailTemplates')

const signup = async (req, res) => {
    const {
        firstname,
        lastname,
        email,
        password,
        dateOfBirth,
        role,
        governmentIssuedId,
        certifications,
        resume,
        profilePhoto
    } = req.body;

    if (!role) {
        throw new CustomError.BadRequestError('Please specify role');
    }

    if (!firstname || !lastname || !email || !password || !dateOfBirth) {
        throw new CustomError.BadRequestError('Please fill up credentials');
    }

    if (role === 'therapist') {
        if (!governmentIssuedId || !certifications || !resume || !profilePhoto) {
            throw new CustomError.BadRequestError('Please fill up therapist credentials');
        }
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new CustomError.BadRequestError('Email already exists');
    }

    const makeAdmin = (await User.countDocuments({})) === 0;

    const verificationToken = uuidv4(); 

    const userData = {
        firstname,
        lastname,
        email,
        password,
        role,
        isAdmin: makeAdmin,
        verificationToken,
        dateOfBirth
    };

    if (role === 'therapist') {
        Object.assign(userData, {
            governmentIssuedId,
            certifications,
            resume,
            profilePhoto
        });
    }

    await User.create(userData);


    const protocol = req.protocol; 
    const host = req.get('host');

    const verification_url = `${protocol}://${host}?token=${verificationToken}`;

    const home_url = `${protocol}://${host}`

    if (role === 'patient') {
        await userVerificationEmail(email, firstname, verification_url)

        res.status(StatusCodes.CREATED).json({
        message: 'Signup successful. Please check your email to verify your account.'
        });

    } else {
        await therapistVerificationEmail(email, firstname, home_url)

        res.status(StatusCodes.CREATED).json({
        message: 'Signup successful. Account verification has been sent for review'
        });

    }   

};

const verifyAccount = async (req, res) => {
    const { verificationToken } = req.body;

    if (!verificationToken) {
        throw new CustomError.BadRequestError('Missing verification token');
    }

    const user = await User.findOneAndUpdate(
        { verificationToken },
        {
            isVerified: true,
            verificationToken: null
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!user) {
        throw new CustomError.BadRequestError('Invalid or expired token');
    }
 
    const tokenPayload = {
        firstname: user.firstname,
        lastname: user.lastname,
        userId: user._id,
        isAdmin: user.isAdmin,
        role: user.role
    };

    createCookies(res, tokenPayload);

    res.status(StatusCodes.OK).json({
        message: 'Account verified successfully',
        user: {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
            isAdmin: user.isAdmin
        }
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new CustomError.BadRequestError('Please fill up credentials');
    }

    const user = await User.findOne({ email, isVerified: true });

    if (!user) {
        throw new CustomError.BadRequestError('Invalid user');
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new CustomError.BadRequestError('Incorrect password');
    }

    const tokenPayload = {
        firstname: user.firstname,
        lastname: user.lastname,
        userId: user._id,
        isAdmin: user.isAdmin,
        role: user.role
    };

    createCookies(res, tokenPayload);

    res.status(StatusCodes.OK).json({
        message: 'Login successful',
        user: {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
            isAdmin: user.isAdmin
        }
    });
};

const logout = async(req, res) => {
    res.cookie('token', 'logout', {
        // httpOnly: true,
        // sameSite: 'none',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        expires: new Date(Date.now()),
    })
    res.status(StatusCodes.OK).json({
        message: `User logged out successfully`,
    })
}

const forgotPassword = async(req, res) => {
    const { email } = req.body

    if (!email) {
        throw new CustomError.BadRequestError('Please input email') 
    }

    const user = await User.findOne({
        email,
    })

    if (!user) {
        throw new CustomError.BadRequestError(`User not found!`)
    }
 
    const token = uuidv4()
    const tokenExpiry = Date.now() + 24 * (60 * 60 * 1000)

    user.resetPasswordToken = token
    user.resetPasswordExpiry = tokenExpiry

    await user.save()

    const protocol = req.protocol; 
    const host = req.get('host');

    const reset_url = `${protocol}://${host}/change-password?token=${token}`;
    
    await resetPasswordEmail({email, reset_url, firstname: user.firstname})

    res.status(200).json({ message: `Reset link has been sent to ${email}`, token })
 
}

const resetPassword = async(req, res) => {
    const { token, newPassword, confirmPassword } = req.body
    if (!token) {
        throw new CustomError.BadRequestError('No token found')
    } 

    if (!newPassword || !confirmPassword) {
        throw new CustomError.BadRequestError('Please fill up credentials')
    }

    if (newPassword !== confirmPassword) {
        throw new CustomError.BadRequestError('Passwords donot match')
    }

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpiry: {
            $gt: Date.now()
        }
    })

    if (!user) {
        throw new CustomError.BadRequestError('Invalid token')
    }

    user.password = newPassword
    await user.save()

    const newtoken = {
        firstname: user.firstname,
        lastname: user.lastname,
        userId: user._id,
        isAdmin: user.isAdmin
    }
    createCookies(res, newtoken)

    res.status(StatusCodes.OK).json({message: 'Password updated successfully'})
}



module.exports = {
    signup,
    login,
    verifyAccount,
    logout,
    forgotPassword,
    resetPassword
}