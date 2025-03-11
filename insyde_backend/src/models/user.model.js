    // src/models/user.model.js
    import mongoose from "mongoose";
    import bcrypt from "bcrypt";

    const userSchema = new mongoose.Schema({
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            lowercase: true,
            minLength: [3, "Username must be at least 3 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, "Invalid email format"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: [8, "Password must be at least 8 characters"],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }, {
        timestamps: true,
    });

    // Hash password before saving
    userSchema.pre("save", async function(next) {
        if (!this.isModified("password")) return next();
        this.password = await bcrypt.hash(this.password, 10);
        next();
    });

    // Method to compare password
    userSchema.methods.comparePassword = async function(candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
    };

    const User = mongoose.model("User", userSchema);
    export default User;

