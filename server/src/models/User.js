import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },

    age: Number,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    occupation: { type: String, maxlength: 80 },
    bio: { type: String, maxlength: 300 },
    quirk: { type: String, maxlength: 80 },

    city: { type: String, default: 'Bengaluru' },
    area: String,
    budgetMin: Number,
    budgetMax: Number,
    sleepBy: Number, // 21..26  (26 = 2 AM)
    cleaning: { type: String, enum: ['daily', 'weekly', 'rarely'] },
    smoking: { type: Boolean },
    pets: { type: Boolean },
    partying: { type: String, enum: ['never', 'sometimes', 'often'] },

    verification: {
      status: { type: String, enum: ['none', 'pending', 'verified'], default: 'none' },
      idType: String,
      idLast4: String,
      verifiedAt: Date,
    },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    passes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    profileComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export function isProfileComplete(u) {
  return !!(
    u.age && u.gender && u.area && u.budgetMin != null && u.budgetMax != null &&
    u.sleepBy && u.cleaning && typeof u.smoking === 'boolean' && typeof u.pets === 'boolean' && u.partying
  );
}

export function publicUser(u) {
  return {
    id: u._id,
    name: u.name,
    age: u.age,
    gender: u.gender,
    occupation: u.occupation,
    bio: u.bio,
    quirk: u.quirk,
    city: u.city,
    area: u.area,
    budgetMin: u.budgetMin,
    budgetMax: u.budgetMax,
    sleepBy: u.sleepBy,
    cleaning: u.cleaning,
    smoking: u.smoking,
    pets: u.pets,
    partying: u.partying,
    verified: u.verification?.status === 'verified',
  };
}

export function privateUser(u) {
  return {
    ...publicUser(u),
    email: u.email,
    verification: { status: u.verification?.status || 'none', idType: u.verification?.idType, idLast4: u.verification?.idLast4 },
    profileComplete: u.profileComplete,
  };
}

export default mongoose.model('User', userSchema);
