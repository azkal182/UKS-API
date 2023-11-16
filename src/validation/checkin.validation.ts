import Joi from 'joi'

export const createCheckinValidation = (payload: string) => {
  const schema = Joi.object({
    name: Joi.string().max(100).required(),
    address: Joi.string().max(100).required(),
    room: Joi.string().max(100).required(),
    grade: Joi.string().max(100).optional(),
    complaint: Joi.string().max(100).required(),
    status: Joi.string().max(100).required()
  })
  return schema.validate(payload)
}

export const updateCheckinValidation = (payload: string) => {
  const schema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().max(100).optional(),
    address: Joi.string().max(100).optional(),
    room: Joi.string().max(100).optional(),
    grade: Joi.string().max(100).optional(),
    complaint: Joi.string().max(100).optional(),
    status: Joi.string().max(100).optional()
  })
  return schema.validate(payload)
}
