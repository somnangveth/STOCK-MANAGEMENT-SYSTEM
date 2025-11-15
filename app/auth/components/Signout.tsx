"use client";
import { useTransition } from "react";
import { logOut } from "../actions";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils";

export default function SignOut(){
    const [isPending, startTransition] = useTransition();

    function onSubmit(){
        startTransition(async() => {
            try{
                await logOut();
            }catch(error){
                console.error("Logout error",error);
            }
        });
    }
    return(
        <button
        onClick={onSubmit}
        disabled={isPending}
        className="px-4 py-2 text-gray-500 rounded border border-gray-500 m-3">
            {isPending ? (
                <AiOutlineLoading3Quarters className="animate-spin"/>
            ): (
                "Log out"
            )
        }
        </button>
    )
}