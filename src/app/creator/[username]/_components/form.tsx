"use client"

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@radix-ui/react-label";

const formSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    message: z.string().min(1, "A mensagem é obrigatória"),
    price: z.enum(["15", "25", "35"], {
        required_error: "O valor é obrigatório",
    })
});

type FormData = z.infer<typeof formSchema>;

export function FormDonate(){

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            message: "",
            price: "15",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }
    
    return(
        <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite seu nome"
                                {...field} 
                                className="bg-white"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mensagem</FormLabel>
                            <FormControl>
                                <Textarea 
                                placeholder="Digite sua mensagem"
                                {...field} 
                                className="bg-white h-30 resize-none"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Valor da Doação</FormLabel>
                            <FormControl>
                               <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex items-center gap-3"
                                >
                                    {["15", "25", "35"].map((value) => (
                                        <div key={value} className="flex items-center gap-1">
                                            <RadioGroupItem value={value} id={value} />
                                            <Label htmlFor={value}>R$ {value}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Doar</Button>
           </form>
        </Form>
    )
}