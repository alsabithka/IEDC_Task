import { z } from 'zod'

export const registrationSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, { message: 'Full name must be at least 2 characters.' })
      .max(80, { message: 'Full name cannot exceed 80 characters.' }),
    email: z
      .string()
      .trim()
      .email({ message: 'Please provide a valid college or personal email address.' }),
    phone: z
      .string()
      .trim()
      .regex(/^[0-9+\-\s()]{10,15}$/, {
        message: 'Please provide a valid 10-digit contact number.',
      }),
    college: z
      .string()
      .trim()
      .min(3, { message: 'College name must be at least 3 characters.' })
      .max(120, { message: 'College name cannot exceed 120 characters.' }),
    department: z
      .string()
      .trim()
      .min(2, { message: 'Please specify your department/branch.' }),
    yearOfStudy: z
      .string()
      .min(1, { message: 'Please select your current year of study.' }),
    participationType: z.enum(['individual', 'team'], {
      message: 'Please select your participation mode.',
    }),
    teamName: z
      .string()
      .trim()
      .max(50, { message: 'Team name cannot exceed 50 characters.' })
      .optional()
      .or(z.literal('')),
    teamSize: z
      .number()
      .int()
      .min(1, { message: 'Team size must be at least 1.' })
      .max(4, { message: 'Maximum team size is 4 members.' })
      .optional(),
    domainTrack: z
      .string()
      .min(1, { message: 'Please select a preferred problem domain.' }),
    synopsis: z
      .string()
      .trim()
      .max(600, { message: 'Idea synopsis cannot exceed 600 characters.' })
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.participationType === 'team') {
        return !!data.teamName && data.teamName.trim().length >= 2
      }
      return true
    },
    {
      message: 'Team name is required for team registrations (at least 2 characters).',
      path: ['teamName'],
    },
  )
  .refine(
    (data) => {
      if (data.participationType === 'team') {
        return data.teamSize !== undefined && data.teamSize >= 2 && data.teamSize <= 4
      }
      return true
    },
    {
      message: 'Team size must be between 2 and 4 members.',
      path: ['teamSize'],
    },
  )

export type RegistrationFormData = z.infer<typeof registrationSchema>
