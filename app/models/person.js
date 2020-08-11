const mongoose = require('mongoose');
const paginate = require('@23people/moonbase-mongoose-utils/paginate');
const {
  isChileanRUT,
  isSurname,
  isFullAddress,
  isEmail,
  isChileanTelephone
} = require('@23people/moonbase-validators-formatters/validators');

const { MULTILINE_TEXT } = require('@23people/moonbase-validators-formatters/regex/common-regex');

const { Schema } = mongoose;

const PersonSchema = new Schema(
  {
    rut: { type: String, maxlength: 12, required: true, primary: true, validate: isChileanRUT },
    name: { type: String, maxlength: 60, validate: isSurname },
    lastName: { type: String, maxlength: 60, validate: isSurname },
    motherLastName: { type: String, maxlength: 60, validate: isSurname },
    address: { type: String, maxlength: 1000, validate: isFullAddress },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['M', 'F'] },
    email: { type: String, maxlength: 120, validate: isEmail },
    phone: { type: String, maxlength: 20, validate: isChileanTelephone },
    description: { type: String, maxlength: 200, validate: value => MULTILINE_TEXT.test(value) },
    enabled: { type: Boolean, default: true }
  },
  { timestamps: true }
);

PersonSchema.plugin(paginate);
PersonSchema.index({ rut: 1 }, { unique: true });

module.exports = mongoose.model('Person', PersonSchema);
