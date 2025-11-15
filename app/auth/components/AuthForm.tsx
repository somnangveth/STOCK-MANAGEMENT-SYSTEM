"use client";
import { Input } from "@/components/ui/input";
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
 } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { loginWithEmailAndPassword } from "../actions";
import { AuthTokenResponse } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const FormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, {message: "Password cannot be empty"}),
})
export default function AuthForm(){
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    function onSubmit(data: z.infer<typeof FormSchema>){
    startTransition(async()=>{
        const { error } = JSON.parse(
            await loginWithEmailAndPassword(data)
        ) as AuthTokenResponse;

        if(error){
            toast.error(
                "Failed to Login",
                {
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
							<code className="text-white">{error.message}</code>
						</pre>
                    )
                }
            )
        }else{
            toast.success("Login Successfully");
        }
    })
        }
    return(
        <Form {...form}>
            <form 
            className="space-y-5 flex flex-col"
            onSubmit={form.handleSubmit(onSubmit)}>
                <FormLabel className="flex justify-center text-2xl">Log In</FormLabel>

                {/* Email */}
                <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Email:</FormLabel>
                        <FormControl>
                            <Input placeholder="example@gmail" {...field}/>
                        </FormControl>
                    </FormItem>
                )}/>

                {/*Password */}
                <FormField
                control={form.control}
                name="password"
                render={({field})=>(
                    <FormItem>
                        <FormLabel>Password:</FormLabel>
                        <FormControl>
                            <Input 
                            type="password"
                            placeholder="******" 
                            {...field}/>
                        </FormControl>
                    </FormItem>
                )}
                />

                <Button 
                type="submit"
                className="
                border border-blue-700 
                bg-blue-100 text-blue-700
                hover:bg-blue-700 hover:text-white">
                    Login{" "}
                    <AiOutlineLoading3Quarters
                    className={cn("aniamted-spin", {
                        isPending,
                        hidden: true,
                    })}
                    />
                </Button>
            </form>
        </Form>
    )
}