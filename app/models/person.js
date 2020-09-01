const mongoose = require('mongoose');
const paginate = require('../../lib/plugins/mongoose-paginate');

const { Schema } = mongoose;

const PersonSchema = new Schema(
  {
    rut: { type: String, maxlength: 12, required: true, primary: true },
    name: { type: String, maxlength: 60 },
    lastName: { type: String, maxlength: 60 },
    motherLastName: { type: String, maxlength: 60 },
    address: { type: String, maxlength: 1000 },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['M', 'F'] },
    email: { type: String, maxlength: 120 },
    phone: { type: String, maxlength: 20 },
    description: { type: String, maxlength: 200 },
    enabled: { type: Boolean, default: true }
  },
  { timestamps: true }
);

PersonSchema.plugin(paginate);
PersonSchema.index({ rut: 1 }, { unique: true });

module.exports = mongoose.model('Person', PersonSchema);
