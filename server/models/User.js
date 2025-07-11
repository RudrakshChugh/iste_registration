import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  admissionNo: { type: String, required: true },
  branch: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true }
});

export default mongoose.model('User', userSchema);
