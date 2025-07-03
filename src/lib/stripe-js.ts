import { loadStripe } from "@stripe/stripe-js";
import { server } from "typescript";

export async function getStripeJs() {
    const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);
    return stripeJs;
}