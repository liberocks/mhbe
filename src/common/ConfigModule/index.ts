import { ConfigModule } from '@nestjs/config';

import { validationSchema } from './schema';

export default ConfigModule.forRoot({
  validationSchema,
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
});
