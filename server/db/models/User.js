import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true,
        index: true
    },
    username: { 
        type: String, 
        required: true, 
        unique: true,
        index: true
    },
    password: { 
        type: String, 
        required: true 
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, { strict: true, timestamps: true, versionKey: false });

UserSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

const UserModel = model('User', UserSchema);

export default UserModel;