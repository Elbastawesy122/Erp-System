import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  isAdmin: z.boolean().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export const OrderSchema = z.object({
  id: z.number().min(1, { message: "ID must be at least 1." }).optional(),
  customerName: z
    .string()
    .min(2, { message: "Customer name must be at least 2 characters." })
    .max(100, { message: "Customer name must be at most 100 characters." }),
  dueDate: z.coerce.date({ message: "Invalid date format." }),
  status: z.enum(["Paid", "Unpaid", "Pending"], {
    message: "Status must be one of: Paid, Unpaid, Pending.",
  }),
  progress: z
    .enum(["Completed", "In Progress", "Pending"], {
      message: "progress must be one of: Completed, In Progress, Pending.",
    })
    .optional(),
  material: z.array(
    z.object({
      materialName: z
        .string()
        .min(2, { message: "Material name must be at least 2 characters." })
        .max(100, { message: "Material name must be at most 100 characters." }),
      quantity: z
        .number()
        .min(1, { message: "Quantity must be at least 1." })
        .max(100, { message: "Quantity must be at most 100." }),
      price: z.number().min(0, { message: "Price cannot be negative." }),
    })
  ),
});

export const StoreSchema = z.object({
  id: z.number().min(1, { message: "ID must be at least 1." }).optional(),
  name: z
    .string()
    .min(2, { message: "Store name must be at least 2 characters." })
    .max(100, { message: "Store name must be at most 100 characters." }),
  quantity: z.number().min(0, { message: "Quantity cannot be negative." }),
});

export const RequestSchema = z.object({
  id: z.number().min(1, { message: "ID must be at least 1." }).optional(),
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters." })
    .max(100, { message: "Title must be at most 100 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(300, { message: "Description must be at most 300 characters." }),
  status: z
    .enum(["Approved", "Pending", "Rejected"], {
      message: "Status must be one of: Approved, Pending, Rejected.",
    })
    .optional(),
  materials: z.array(
    z.object({
      materialName: z
        .string()
        .min(2, { message: "Material name must be at least 2 characters." })
        .max(100, { message: "Material name must be at most 100 characters." }),
      quantity: z
        .number()
        .min(1, { message: "Quantity must be at least 1." })
        .max(100, { message: "Quantity must be at most 100." }),
      price: z
        .number()
        .min(0, { message: "Price cannot be negative." })
        .optional(),
    })
  ),
  createdBy: z.object({
    id: z.number().min(1, { message: "ID must be at least 1." }),
    name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  }).optional(),
});
