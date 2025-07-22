"use server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { error } from "console";

export async function getStats(userId : string, stripeAccountId: string ) {
    
    if(!userId) {
        return {
            error: "Usuario não autenticado"
        }
    }

    try{

        const totalDonations = await prisma.donation.count({
            where: {
                userId: userId,
                status: "PAID"
            }
        })

        const totalAmountDonated = await prisma.donation.aggregate({
            _sum: {
                amount: true
            },
            where: {
                userId: userId,
                status: "PAID"
            }
        })

        const balance = await stripe.balance.retrieve({
            stripeAccount: stripeAccountId
        })

        return {
            totalDonations: totalDonations,
            totalAmountDonated: totalAmountDonated._sum.amount ?? 0,
            balance: balance?.pending[0].amount ?? 0,
        }

    }catch(err) {
        return {
            error: "Erro ao buscar as estatisticas"
        }
    }

}