import { z } from 'zod'

export const registrationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: 'Full name must be at least 2 characters.' })
    .max(80, { message: 'Full name cannot exceed 80 characters.' }),
  email: z
    .string()
    .trim()
    .email({ message: 'Please provide a valid email address.' }),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{10,15}$/, {
      message: 'Please provide a valid contact number (at least 10 digits).',
    }),
  college: z
    .string()
    .trim()
    .min(3, { message: 'College name must be at least 3 characters.' })
    .max(120, { message: 'College name cannot exceed 120 characters.' }),
  department: z
    .string()
    .trim()
    .min(2, { message: 'Department/Course is required.' }),
  yearOfStudy: z
    .string()
    .min(1, { message: 'Please select your current year of study.' }),
  teamName: z
    .string()
    .trim()
    .min(3, { message: 'Team name must be at least 3 characters.' })
    .max(50, { message: 'Team name cannot exceed 50 characters.' }),
  teamSize: z
    .number()
    .int()
    .min(1, { message: 'Team size must be at least 1 member.' })
    .max(4, { message: 'Team size cannot exceed 4 members.' }),
  track: z
    .string()
    .min(1, { message: 'Please select an innovation track.' }),
  synopsis: z
    .string()
    .trim()
    .max(500, { message: 'Idea synopsis cannot exceed 500 characters.' })
    .optional()
    .or(z.literal('')),
})

export type RegistrationFormData = z.infer<typeof registrationSchema>
