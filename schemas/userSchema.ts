import { z } from 'zod';

export const userRegistrationSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Passwords do no match',
    path: ['confirmPassword'],
  });

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
