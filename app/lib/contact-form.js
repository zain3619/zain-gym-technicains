import * as Yup from "yup";

export const projectTypes = [
  "Commercial Gym",
  "Private Studio",
  "Corporate Fitness Space",
  "Hotel Gym",
];

export const budgetRanges = [
  "Under PKR 2M",
  "PKR 2M - 3M",
  "PKR 3M - 7M",
  "PKR 7M+",
];

export const contactFormSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),
  phone: Yup.string()
    .trim()
    .matches(/^[0-9+\s()-]+$/, "Enter a valid phone number")
    .test(
      "phone-length",
      "Phone number must be at least 10 digits",
      (value) => (value ? value.replace(/\D/g, "").length >= 10 : false),
    )
    .required("Phone number is required"),
  email: Yup.string()
    .trim()
    .email("Invalid email address")
    .required("Email is required"),
  business: Yup.string().trim().required("Business / Gym Name is required"),
  projectType: Yup.string()
    .oneOf(projectTypes, "Project type is required")
    .required("Project type is required"),
  budgetRange: Yup.string()
    .oneOf(budgetRanges, "Budget range is required")
    .required("Budget range is required"),
  message: Yup.string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(300, "Message cannot exceed 300 characters")
    .required("Message is required"),
});

export async function validateContactForm(values) {
  try {
    const validatedValues = await contactFormSchema.validate(values, {
      abortEarly: false,
      stripUnknown: true,
    });

    return { values: validatedValues, fieldErrors: null };
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      const fieldErrors = {};

      for (const detail of error.inner) {
        if (detail.path && !fieldErrors[detail.path]) {
          fieldErrors[detail.path] = detail.message;
        }
      }

      return { values: null, fieldErrors };
    }

    throw error;
  }
}
