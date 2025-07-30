"use server"

import { stripe } from "@/lib/stripe"

export async function getStripeDashboard(accountID: string | undefined) {
    
    if(!accountID){
        return null;
    }
    
    try{

        const loginLink = await stripe.accounts.createLoginLink(accountID)
        
        return loginLink.url

    }catch(err){
        console.log("## ERRO ACCOUNT ID ", err)
        return null;
    }
}