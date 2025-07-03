"use server"
import { stripe } from "@/lib/stripe"

export async function getLoginOnboardAccount(accountID: string | undefined) {
    
    if(!accountID){
        return null;
    }
    
    try{

    const accountLink = await stripe.accountLinks.create({
        account: accountID,
        refresh_url: process.env.HOST_URL,
        return_url: process.env.HOST_URL,
        type: "account_onboarding",
    })     
    
    return accountLink.url

    }catch(err){
        console.log("## ERRO ACCOUNT ID ", err)
        return null;
    }
}