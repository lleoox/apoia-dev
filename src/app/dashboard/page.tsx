import { DonationTable } from "./_components/donates";
import { Stats } from "./_components/analytics";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getLoginOnboardAccount } from "./_data-access/create-onboard-account";
import { CreateAccountButton } from "./_components/create-account-button";
import { getAllDonate } from "./_data-access/get-donate";

export default async function Dashboard() {

  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const accountURL = await getLoginOnboardAccount(session.user.connectStripeAccountId)
  const donates = await getAllDonate(session.user.id);

  return (
    <div className="p-4">
      <section className="flex items-center justify-between mb-4">
        <div className="w-full flex items-center gap-2 justify-between">
          <h1 className="text-2xl font-semibold">Minha conta</h1>

        {accountURL && (
          <a
            href={accountURL} 
            className="bg-zinc-900 px-4 py-1 rounded md text-white cursor-pointer">
              Ajustar Conta
          </a>
        )}

        </div>
      </section>

      {!session.user.connectStripeAccountId && (
        <CreateAccountButton />
      )}

      <Stats userId={session.user.id} stripeAccountId={session.user.connectStripeAccountId ?? ""} />


      <h2 className="text-2xl font-semibold mb-2">Últimas doações</h2>

      {session.user.connectStripeAccountId && (
        <DonationTable data={donates.data ?? []} />
      )}

    </div>
  );
}