import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {

    const sig = req.headers.get('stripe-signature')!
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
    
    let event: Stripe.Event;
    
    try {
        const payload = await req.text();
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
        console.error("FALHA AO AUTENTICAR A ASSINATURA DO WEBHOOK", err);
        return NextResponse.json('Webhook Error' , { status: 400 });
    }
    
    switch (event.type) {
        case 'checkout.session.completed': 
            const session = event.data.object as Stripe.Checkout.Session;
            const paymentIntentId = session.payment_intent as string;

            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
            console.log("## PAYMENT INTENT ##", paymentIntent);

            const donorName = paymentIntent.metadata.donorName || 'Anônimo';
            const donorMessage = paymentIntent.metadata.donorMessage || 'Nenhuma mensagem';
            const donorId = paymentIntent.metadata.donorId || 'anônimo';

            try{
                const updateDonation = await prisma.donation.update({
                    where: {
                        id: paymentIntent.metadata.donationId,
                    },
                    data: {
                        status: 'PAID',
                        donorName: donorName ?? 'Anônimo',
                        donorMessage: donorMessage ?? 'Nenhuma mensagem',
                    }
            })

            console.log("Doação atualizada com sucesso:", updateDonation);

            }catch (error) {
                console.error("Erro ao salvar doação no banco de dados:", error);
            }

            break

            default:
                console.log(`Evento desconhecido ${event.type}`);

    }

    return NextResponse.json({ ok: true });
        
}