import mongoose from "mongoose";
const { Schema } =  mongoose;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 64
        },
        image: {
            type: String,
        },
        imagePublicId: {
            type: String,
        },
        role: {
            type: Number,
            default: 0,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        address: {
            type: Object,
            default: {
                street: "1 Ogunlesi street",
                city: "Onipanu",
                state: "Lagos",
                zip: 123456
            },
        },
        OTP: {
            type: String,
        }
    },
    { timestamps: true }
);

export default mongoose.model('User', userSchema)