"use server"

import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
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
            error: schema.error.issues[0].message
        }
    }

    if(!data.creatorId) {
        return {
            error: "O id do Criador é obrigatório"
        }
    }

    try{

        const creator = await prisma.user.findFirst({
            where: {
                connectStripeAccountId: data.creatorId
            }
        })

        if(!creator) {
            return {
                error: "Criador nao encontrado"
            }
        }

        const applicationFeeAmount = Math.floor(data.price * 0.1);

        const donation = await prisma.donation.create({
            data: {
                donorName: data.name,
                donorMessage: data.message,
                userId: creator.id,
                status: "PENDING",
                amount: (data.price - applicationFeeAmount),
            }
        })

        const session = await stripe.checkout.sessions.create({
             payment_method_types: ["card"],
             mode: "payment",
             success_url: `${process.env.HOST_URL}/creator/${data.slug}`,
             cancel_url: `${process.env.HOST_URL}/creator/${data.slug}`,
             line_items: [
                 {
                     price_data: {
                         currency: "brl",
                         product_data: {
                             name: "Apoiar" + creator.name,
                         },
                         unit_amount: data.price,
                     },
                     quantity: 1,
                 }
             ],
             payment_intent_data: {
                 application_fee_amount: applicationFeeAmount,
                 transfer_data: {
                     destination: creator.connectStripeAccountId as string, 
                 },
                 metadata:{
                     donorName: data.name,
                     donorMessage: data.message,
                     donationId: donation.id
                 }
             }
         })

        return {
             sessionId: session.id,
        }

    }catch(err){
        return {
            error: "Erro ao criar o pagamento, tente novamente mais tarde"
        }
    }
}