import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: { type: String, enum: ['Super Admin', 'User'], unique: true, required: true }
});

export const Role = mongoose.model('Role', roleSchema);
