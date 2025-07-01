import Image from "next/image";
import { Name } from "./name";
import { Description } from "./description";

interface CardProfileProps {
    user:{
        id: string;
        name: string | null;
        bio: string | null;
        username: string | null;
        email: string | null;
        image: string | null;
    }
}

export function CardProfile({ user }: CardProfileProps) {
    return(
        <section className="w-full flex flex-col items-center mx-auto px-4">
            <div className="">
                <Image src={user.image ?? "http://github.com/devfraga.png"} alt="Foto de Perfil"
                width={104}
                height={104}
                className="rounded-x1 bg-gray-50 object-cover border-4 border-white hover:shadow-xl duration-300"
                priority
                quality={100}
                /> 
            </div>
            <div>
                <Name 
                    initialName={user.name ?? "Digite seu nome..."}
                />

                <Description 
                    initiaDescription={user.bio ?? "Digite sua BIO..."}
                />
            </div>
        </section>
    )
}