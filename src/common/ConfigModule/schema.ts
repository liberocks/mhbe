import { VALID_NODE_ENV } from "constants/environment.constant";

import Joi from "@hapi/joi";

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...VALID_NODE_ENV)
    .required(),
  MONGO_CONNECTION_STRING: Joi.string().required(),
  SERVICE_NAME: Joi.string().required(),
  PORT: Joi.number().optional(),
});
