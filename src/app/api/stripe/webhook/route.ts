import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    
    const sig = req.headers.get('stripe-signature')!
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

    let event: Stripe.Event

    try{
        const payload = await req.text();
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    }catch(err) {
        console.log("FALHA AO AUTENTICAR ASSINATURA", err);
        return new NextResponse(`Webhook Error`, { status: 400 });
    }

    switch (event.type) {
        case "checkout.session.completed": 
            const session = event.data.object as Stripe.Checkout.Session
            const paymentIntentId = session.payment_intent as string;

            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            console.log("## PAYMENT INTENT", paymentIntent);

            const donorName = paymentIntent.metadata.donorName;
            const donorMessage = paymentIntent.metadata.donorMessage;
            const donateId = paymentIntent.metadata.donationId;

            try{
                const updatedDonation = await prisma.donation.update({
                    where: {
                        id: donateId
                    },
                    data: {
                        status: "PAID",
                        donorName: donorName ?? "Anônimo",
                        donorMessage: donorMessage ?? "Sem mensagem"
                    }
                })

                console.log("## DOACAO ATUALIZADA: ", updatedDonation);

            }catch(err){
                console.log("## ERRO", err);
            }   
            
            break;

        default:
            console.log("## EVENTO DESCONHECIDO", event.type);
    }

    return NextResponse.json({ ok: true });

}