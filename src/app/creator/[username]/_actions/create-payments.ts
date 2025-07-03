"use server"

import { prisma } from "@/lib/prisma"
import { z } from 'zod'

const createUsernameSchema = z.object({
    slug: z.string().min(1, "O Slug do Criador é obrigatório"),
    name: z.string().min(1, "O Nome é obrigatório"),
    message: z.string().min(5, "A Mensagem precisa ter no minimo 5 caracteres"),
    price: z.number().min(1500, "Selecione um valor maior que R$ 15"),
    creatorId: z.string()
})

type CreatepaymentSchema = z.infer<typeof createUsernameSchema>

export async function createPayment(data: CreatepaymentSchema) {

    const schema = createUsernameSchema.safeParse(data);

    if(!schema.success) {
        return {
            data:null,
            error: schema.error.issues[0].message
        }
    }

    try{

        const creator = await prisma.user.findUnique({
            where: {
                id: data.creatorId
            }
        })

    }catch(err){
        return {
            data: null,
            error: "Erro ao criar o pagamento, tente novamente mais tarde"
        }
    }
}