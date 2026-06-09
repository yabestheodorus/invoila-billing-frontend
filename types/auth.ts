/** Auth form validation — zod schemas + inferred types (types/zod only). */
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Please input valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z
  .object({
    email: z.email('Please input valid email'),
    password: z.string().min(8).max(50),
    confirmPassword: z.string().min(8).max(50),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginFormType = z.infer<typeof loginSchema>;
export type SignUpFormType = z.infer<typeof signupSchema>;
