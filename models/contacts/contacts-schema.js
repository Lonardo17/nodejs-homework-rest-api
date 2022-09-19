const { Schema, model, SchemaTypes } = require('mongoose');

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please, set name for contact.'],
    },
    email: {
      type: String,
      required: [true, 'Please, set email for contact.'],
    },
    phone: {
      type: String,
      required: [true, 'Please, set phone for contact.'],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        return ret;
      },
    },
  }
);

const Contact = model('contacts', contactSchema);

module.exports = Contact;