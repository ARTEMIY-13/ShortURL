import { z } from 'zod'

export function createRegisterSchema(t) {
  return z
    .object({
      name: z.string().trim().min(2, t('v.nameMin')),
      username: z
        .string()
        .trim()
        .min(3, t('v.usernameLen'))
        .max(24, t('v.usernameLen'))
        .regex(/^[A-Za-z0-9_-]+$/, t('v.usernameChars')),
      email: z.string().trim().email(t('v.email')),
      password: z
        .string()
        .min(8, t('v.passwordMin'))
        .regex(/[A-Za-z]/, t('v.passwordMix'))
        .regex(/\d/, t('v.passwordMix')),
      confirmPassword: z.string(),
      terms: z.boolean().refine((v) => v === true, { message: t('v.terms') }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('v.passwordMatch'),
      path: ['confirmPassword'],
    })
}
