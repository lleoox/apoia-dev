"use server"

import { prisma } from "@/lib/prisma";

export async function getAllDonate(userId : string) {
    
    if(!userId) {
        return {
            error: "Usuario não autenticado"
        }
    }

    try{
        const donates = await prisma.donation.findMany({
            where: {
                userId: userId,
                status: "PAID"
            },
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                amount: true,
                createdAt: true,
                donorMessage: true,
                donorName: true
            }
       })

       return {
        data : donates
       };

    }catch(err){
        return{
            data: []
        }
    }
}