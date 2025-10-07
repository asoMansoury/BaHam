import {z} from 'zod';

export const resetPasswordSchema = z.object({
    password: z.string().min(5, 'Password must be at least 5 characters long'),
    confirmPassword: z.string().min(5, 'Confirm Password must be at least 5 characters long'),

}).refine(data=>data.password == data.confirmPassword,{
    message: "Passwords don't match",
    path: ['confirmPassword']
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
