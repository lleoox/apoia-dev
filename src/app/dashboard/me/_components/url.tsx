"use client"
import { Button } from "@/components/ui/button";
import { create } from "domain";
import { createUsername } from "../_actions/create_username";
import { useState } from "react";
import { string } from "zod";
import { Link } from "lucide-react";

interface UrlPreviewProps{
    username: string | null;
}

export function UrlPreview({ username : slug}: UrlPreviewProps){

    const [error, setError] = useState<null | string>(null);
    const [username, setUsername] = useState(slug)

    async function submitAction(formData: FormData) {
        const username = formData.get("username") as string

        if(username === ""){
            return;
        }

        const response = await createUsername({ username });

        if (response.error) {
            setError(response.error);
            return;
        }

        if( response.data){
            setUsername(response.data)
        }

    }

    if(!!username){
        return(
            <div className="flex items-center flex-1 p-2 text-gray-100">
                <div className="flex items-center justify-center w-full">
                    {process.env.NEXT_PUBLIC_HOST_URL}creator/{username}
                </div>
                <a href={`${process.env.NEXT_PUBLIC_HOST_URL}creator/${username}`}>
                    <Link className="ml-2 text-blue-500 hover:text-blue-600 cursor-pointer" />
                </a>
            </div>
        )
    }

    return(
        <div className="w-full">
            <div className="flex items-center flex-1 p-2 text-gray-100">
                <form className="flex flex-1 flex-col md:flex-row gap-4 items-start md:items-center" action={submitAction}>
                    <div className="flex items-center justify-center w-full">
                        <p>
                            {process.env.NEXT_PUBLIC_HOST_URL}creator/
                        </p>
                        <input type="text" className="flex-1 outline-none border h-9 border-gray-300 bg-gray-50 text-black rounded-md px-1" placeholder="Digite seu usuário" name="username"/>
                    </div>
                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600 h-9 w-full md:w-fit text-white px-4 rounded-md cursor-pointer">Salvar</Button>
                </form>
            </div>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    )
}