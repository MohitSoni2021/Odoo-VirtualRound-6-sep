import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters long"],
        maxlength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false
    },
    role: {
        type: String,
        enum: ['buyer', 'seller', 'admin'],
        required: [true, 'Role is required'],
        default: 'buyer'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        select: false,
        validate: {
            validator: function(value) {
                return !value || /^\d{6}$/.test(value);
            },
            message: "OTP must be exactly 6 digits"
        }
    },
    otpExpiry: {
        type: Date,
        select: false
    },
    otpValid: {
        type: Boolean,
        default: false,
        select: false
    },
    tokenVersion: {
        type: Number,
        default: 0,
        select: false
    },
    profilePicture: {
        type: String,
        default: ""
    },
    darkMode: {
        type: Boolean,
        default: false
    },
    is_deleted: {
        type: Boolean,
        default: false,
        select: false
    }
}, { 
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.otp;
            delete ret.otpExpiry;
            delete ret.tokenVersion;
            delete ret.__v;
            delete ret.is_deleted;
            return ret;
        },
        virtuals: true
    },
    toObject: {
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.otp;
            delete ret.otpExpiry;
            delete ret.tokenVersion;
            delete ret.__v;
            delete ret.is_deleted;
            return ret;
        },
        virtuals: true
    }
});

// Index for faster email lookups
userSchema.index({ email: 1 }, { unique: true });

// Index for better query performance
userSchema.index({ role: 1, isVerified: 1 });

// Pre-save middleware for password hashing
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Instance method for password comparison
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        console.error('Password comparison error:', error);
        return false;
    }
};

export default mongoose.model('User', userSchema);