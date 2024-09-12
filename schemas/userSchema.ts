import { z } from 'zod';

export const userRegistrationSchema = z.object({
  email: z.string().email({ message: 'Please provide a valid email' }),
  fullName: z.string().min(1, { message: 'Please provide a valid fullName' }),
  phoneNumber: z
    .string()
    .min(8, { message: 'Please provide a valid phoneNumber' }),
});

export const userLoginSchema = z.object({
  email: z.string().email({ message: 'Please provide a valid email' }),
  phoneNumber: z
    .string()
    .min(8, { message: 'Please provide a valid phoneNumber' }),
});
