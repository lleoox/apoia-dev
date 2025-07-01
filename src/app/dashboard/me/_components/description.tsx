"use client";

import { useState, useRef, ChangeEvent } from "react";
import { debounce } from 'lodash'
import { toast } from "sonner";
import { changeDescription } from "../_actions/change-description";

export function Description( {initiaDescription} : {initiaDescription: string}){

    const [description, setDescription] = useState(initiaDescription);
    const [originalDescription] = useState(initiaDescription);
    
    const debouncedSaveDescription = useRef(
        debounce(async (currentDescription: string) => {
            if(currentDescription.trim() === ""){
                setDescription(originalDescription);
                return;
            }

            if(currentDescription !==  description){
                try{
                    const response = await changeDescription({ description: currentDescription });

                    if(response.error){
                        toast.error("Erro ao alterar a BIO, tente novamente mais tarde.");
                        setDescription(currentDescription);
                        return;
                    }

                    toast.success("BIO alterada com sucesso!");

                }catch(err){
                    console.log(err);
                    setDescription(currentDescription);
                }
            }

        }, 1500)
    ).current

    function handleChangeDescription(e: ChangeEvent<HTMLTextAreaElement>){
        const value = e.target.value;
        setDescription(value);

        debouncedSaveDescription(value);
    }


    return(
        <textarea
            className="text-base bg-gray-50 border border-gray-100 rounded-md outline-none p-2 w-full max-w-2xl text-center my-3 h-40 resize-none   "
            value={description}
            onChange={handleChangeDescription}
        />
    )
}