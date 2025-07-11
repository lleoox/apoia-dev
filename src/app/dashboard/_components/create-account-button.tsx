"use client"

import { Button } from "@/components/ui/button";
import { set } from "lodash";
import { useState } from "react";
import { toast } from "sonner";

export function CreateAccountButton() {
    const [loading, setLoading] = useState(false);

    async function handleCreateStripeAccount() {
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/stripe/create-account`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            const data = await res.json();

            if (!res.ok) {
                toast.error("Erro ao criar conta Stripe")
                setLoading(false);
                return
            }

            window.location.href = data.url; // Redireciona para o link de configuração da conta
            
        } catch (error) {
            console.log(error);
            setLoading(false);
        }

    }


    return(
        <div className="mb-5">
            <Button
                className="cursor-pointer"
                onClick={handleCreateStripeAccount}
                disabled={loading}
             
            >
                {loading ? "Carregando..." : "Ativar conta de pagamento"}
            </Button>
        </div>
    )
}