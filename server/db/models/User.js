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
    personnelNumber: {
        type: Number,
        required: true
    },
    phone: {
        type: Number,
        required: false
    },
    workplace: {
        type: String,
        required: true
    },
    contractType: {
        type: String,
        enum: ['indeterminato', 'determinato', 'part-time'],
        required: false
    },
    hireDate: {
        type: Date,
        required: false
    },
    holidayLeave: {
        type: Number,
        default: 20
    },
    timeOff: {
        type: Number,
        default: 40
    },

    // creare un modello apparte per le ferie??

}, { strict: true, timestamps: true, versionKey: false });

UserSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

const UserModel = model('User', UserSchema);

export default UserModel;