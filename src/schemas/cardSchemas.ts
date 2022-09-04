import Joi from "joi";

const createCardSchema = Joi.object({
    employeeId: Joi.number().integer().required(),
    cardType: Joi.string().required(),
  });

const activateCardSchema = Joi.object({
    cvc: Joi.string().max(3).required(),
    password: Joi.number().max(4).required()
  });
  
export {
    createCardSchema,
    activateCardSchema
};
