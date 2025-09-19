import { z } from "zod";

export const UpdateProfileSchema = z.object({
    email: z.email().optional(),
    riskTolerance: z.enum(["low", "medium", "high"]).optional(),
});