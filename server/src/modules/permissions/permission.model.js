import mongoose from 'mongoose';
import { MODULES } from '../../constants/index.js';

const permissionSchema = new mongoose.Schema({
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  module: { type: String, enum: MODULES, required: true },
  view: { type: Boolean, default: true },
  create: { type: Boolean, default: true },
  update: { type: Boolean, default: true },
  delete: { type: Boolean, default: true }
});

permissionSchema.index({ roleId: 1, module: 1 }, { unique: true });

export const Permission = mongoose.model('Permission', permissionSchema);
