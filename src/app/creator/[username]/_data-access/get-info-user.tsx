"use server"

import { prisma } from "@/lib/prisma"
import { z } from 'zod'

const createUsernameSchema = z.object({
    username: z.string({ message: "O Username é obrigatório"})
})

type createUsernameSchema = z.infer<typeof createUsernameSchema>

export async function getinfoUser(data: createUsernameSchema) {
    
    const schema = createUsernameSchema.safeParse(data);

    if(!schema.success) {
        return null
    }

    try{
        const user = await prisma.user.findUnique({
            where: {
                username: data.username
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                bio: true,
                image: true
            }
        })

        return user

    }catch(err){
        return null
    }
}