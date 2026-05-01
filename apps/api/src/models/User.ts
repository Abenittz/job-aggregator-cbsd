import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

/**
 * User document interface
 * Extends mongoose Document to include User fields
 */
export interface IUser extends Document {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User instance methods interface
 */
export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User model type combining document and methods
 */
export type UserModel = Model<IUser, {}, IUserMethods>;

/**
 * Email validation regex
 * Validates basic email format: local@domain.tld
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * User schema definition
 * Implements Requirements 11.1, 11.2, 11.3, 11.4, 11.5
 */
const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email: string): boolean {
          return EMAIL_REGEX.test(email);
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

/**
 * Create unique index on email field
 * Implements Requirement 11.2
 */
userSchema.index({ email: 1 }, { unique: true });

/**
 * Pre-save hook for password hashing
 * Implements Requirements 10.1, 10.2
 * 
 * Hashes the password using bcrypt with 10 salt rounds before saving
 * Only hashes if the password field has been modified
 */
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate salt with 10 rounds (Requirement 10.2)
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password (Requirement 10.1)
    this.password = await bcrypt.hash(this.password, salt);
    
    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * Instance method for password verification
 * Implements Requirement 10.3
 * 
 * @param candidatePassword - The plain text password to compare
 * @returns Promise<boolean> - True if password matches, false otherwise
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

/**
 * User model
 * Exports the compiled Mongoose model for User
 */
export const User = mongoose.model<IUser, UserModel>("User", userSchema);
