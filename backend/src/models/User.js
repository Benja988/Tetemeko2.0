import mongoose, { Schema } from 'mongoose';

export const UserRole = {
  WEB_USER: 'web_user',
  MANAGER: 'manager',
  ADMIN: 'admin'
};

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
  },
  name: { 
    type: String, 
    required: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  password: { 
    type: String, 
    required: true,
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.WEB_USER,
  },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  refreshToken: { type: String, unique: true, sparse: true },
  invitationCode: { type: String, unique: true, sparse: true },
  invitationCodeExpires: { type: Date },
  verificationToken: { type: String, unique: true, sparse: true },
  verificationTokenExpires: { type: Date },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  profilePictureUrl: { type: String, default: "" },
}, { timestamps: true });

// Auto-set expiration for invitation codes (7 days)
UserSchema.pre("save", function (next) {
  if (this.invitationCode && !this.invitationCodeExpires) {
    this.invitationCodeExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
  next();
});

// Auto-set expiration for verification tokens (24 hours)
UserSchema.pre("save", function (next) {
  if (this.verificationToken && !this.verificationTokenExpires) {
    this.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
  next();
});

// Brute-force protection
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000;

UserSchema.methods.incrementFailedLogins = async function () {
  if (this.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
    this.lockUntil = new Date(Date.now() + LOCK_TIME);
  } else {
    this.failedLoginAttempts += 1;
  }
  await this.save();
};

UserSchema.methods.resetFailedLogins = async function () {
  this.failedLoginAttempts = 0;
  this.lockUntil = undefined;
  await this.save();
};

export default mongoose.model("User", UserSchema);