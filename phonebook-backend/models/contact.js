const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleMongooseError } = require('../helpers');

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    number: {
      type: String,
      required: [true, 'Set number for contact'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post('save', handleMongooseError);

const contactJoiSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'missing required name field',
  }),
  number: Joi.string().required().messages({
    'any.required': 'missing required number field',
  }),
});

const contactUpdateJoiSchema = Joi.object({
  name: Joi.string(),
  number: Joi.string(),
}).min(1);

const schemas = {
  contactJoiSchema,
  contactUpdateJoiSchema,
};

const Contact = model('contact', contactSchema);

module.exports = {
  Contact,
  schemas,
};
