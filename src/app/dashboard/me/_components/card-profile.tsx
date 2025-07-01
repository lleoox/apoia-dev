import Image from "next/image";

interface CardProfileProps {
    user:{
        id: string;
        name: string | null;
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
                width={96}
                height={96}
                className="rounded-x1 bg-gray-50 object-cover border-4 border-white"
                /> 
            </div>
        </section>
    )
}