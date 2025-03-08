import { z } from "zod";

export const userRegistrationSchema = z.object({
  email: z.string().email({ message: "Please provide a valid email" }),
  fullName: z.string().min(1, { message: "Please provide a valid fullName" }),
  phoneNumber: z
    .string()
    .min(8, { message: "Please provide a valid phoneNumber" }),
  password: z.string().min(8, { message: "Please provide a valid password" }),
});

export const userLoginSchema = z.object({
  email: z.string().email({ message: "Please provide a valid email" }),
  phoneNumber: z
    .string()
    .min(8, { message: "Please provide a valid phoneNumber" }),
  password: z.string().min(8, { message: "Please provide a valid password" }),
});

const identificationType: [string, ...string[]] = [
  "Birth certificate",
  "Driving license",
  "Passport",
  "National ID",
];

export const userPersonalInfo = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string(),
  dateOfBirth: z.date(),
  gender: z.enum(["Male", "Female"]),
  address: z.string().min(8),
  occupation: z.string().min(5),
  emergencyName: z.string().min(1),
  emergencyPhoneNumber: z.string().min(1),
  doctorId: z.coerce.number(),
  insuranceProvider: z.string().min(1),
  insuranceNumber: z.string().min(5),
  allergies: z.string(),
  currentMedications: z.string(),
  familyMedHistory: z.string(),
  pastMedHistory: z.string(),
  identificationType: z.enum(identificationType),
  identificationNumber: z.string().min(5),
});
