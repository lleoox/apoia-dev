"use server"

import { z } from "zod";

const createUsernameSchema = z.object({ username: z.string( { message: "O Username é obrigatorio"} ).min(4, "O Username precisa ter pelo menos 4 caracteres") });

type createUsernameFormData = z.infer<typeof createUsernameSchema>;

export async function createUsername(data: createUsernameFormData) {
    
    const schema = createUsernameSchema.safeParse(data);

    if (!schema.success) {
        console.log(schema)
        return { 
            data: null,
            error: schema.error.issues[0].message 
        };
    }

    return{
        data: "USERNAME CRIADO",
        error: null,
    }
}