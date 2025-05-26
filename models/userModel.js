const mongoose = require("mongoose");
const validator = require('validator')
const bcrypt = require('bcrypt')


const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'Please input first name'],
    minLength: 3,
    maxLength: 10,
    trim: true,
},

lastname: {
    type: String,
    required: [true, 'Please input last name'],
    minLength: 3,
    maxLength: 10,
    trim: true,
},

email: { 
    type: String,
    required: [true, 'Please input email'],
    minLength: 5,
    validate: {
        validator: validator.isEmail,
        message: (props) => `${props.value} is not a valid email`
    },
    unique: true
},

phone: {
    type: Number,
    uique: true,
    required: false,
    validate: {
        validator: function(value) {
            return validator.isMobilePhone(value, 'any', { strictMode: false })
        },
        message: props => `${props.value} is not a valid phone number!`
    }
},

dateOfBirth: {
    type: String,
    required: true
},

password: {
    type: String,
    required: [true, 'Please input password'],
    validate: {
        validator: function (value) {
        return validator.isStrongPassword(value, {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        });
      },
      message: "Password must be at least 6 characters long and include lowercase, uppercase, number, and symbol."
    }
},


location: {
    country: String,
    state: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
},

role: { 
    type: String, 
    enum: ["patient", "therapist"], 
    default: "patient" 
},

isAdmin: {
    type: Boolean, 
    default: false
},

governmentIssuedId: {
    type: String,
    required: function() {
        return this.role === 'therapist';
    }
},

certifications: {
    type: String,
    required: function() {
        return this.role === 'therapist';
    }
},

resume: {
    type: String,
    required: function() {
        return this.role === 'therapist';
    }
},

profilePhoto: {
    type: String,
    required: function() {
        return this.role === 'therapist';
    }
},

resetPasswordToken: {
    type: String,
},

resetPasswordExpiry: {
    type: Date,
},

isVerified: {
    type: Boolean,
    default: false
},

verificationToken: {
    type: String,
},

subscriptionStatus: {
    type: String,
    enum: ["none", "active", "expired"],
    default: "none",
},

recommendedTests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AnalysisTest'
}]
}, {
    timestamps: true
});

UserSchema.pre('save', async function() {
    if (!this.isModified('password')) return
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function(password) {
    const checkPassword = await bcrypt.compare(password, this.password);
    return checkPassword
}

UserSchema.index({ email: 1, phone: 1 }, { unique: true })


module.exports = mongoose.model("User", UserSchema);
