import { Types } from 'mongoose';

export const generateObjectID = (seed?: string | number | undefined): Types.ObjectId => {
  return Types.ObjectId(seed);
};
