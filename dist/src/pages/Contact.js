import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/supabase-client";
import { Mail, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
const contactFormSchema = z.object({
    fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});
const Contact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const form = useForm({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            fullName: "",
            email: "",
            message: "",
        },
    });
    const onSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            const { error } = await supabase.from("contact_messages").insert({
                full_name: values.fullName,
                email: values.email,
                message: values.message,
            });
            if (error)
                throw error;
            toast({
                title: "Message envoyé",
                description: "Nous vous répondrons dans les plus brefs délais.",
            });
            form.reset();
        }
        catch (error) {
            console.error("Error sending message:", error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une erreur est survenue lors de l'envoi du message.",
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "container mx-auto px-4 py-12", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h1", { className: "text-3xl md:text-4xl font-bold text-gray-900 mb-4", children: "Contactez-nous" }), _jsx("p", { className: "text-gray-600 max-w-2xl mx-auto", children: "Une question ? N'h\u00E9sitez pas \u00E0 nous contacter. Notre \u00E9quipe vous r\u00E9pondra dans les plus brefs d\u00E9lais." })] }), _jsxs("div", { className: "grid md:grid-cols-3 gap-8 max-w-6xl mx-auto", children: [_jsxs("div", { className: "space-y-4", children: [_jsx(Card, { className: "p-6 hover:shadow-lg transition-shadow", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "bg-primary/10 p-3 rounded-full", children: _jsx(Mail, { className: "h-6 w-6 text-primary" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900", children: "Email" }), _jsx("p", { className: "text-gray-600", children: "motocrossavesnois@gmail.com" })] })] }) }), _jsx(Card, { className: "p-6 hover:shadow-lg transition-shadow", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "bg-primary/10 p-3 rounded-full", children: _jsx(MapPin, { className: "h-6 w-6 text-primary" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900", children: "Adresse" }), _jsx("p", { className: "text-gray-600", children: "25 Rue de Bellefontaine, 59440 Avesnes-sur-Helpe" })] })] }) })] }), _jsx("div", { className: "md:col-span-2", children: _jsx(Card, { className: "p-8", children: _jsx(Form, { ...form, children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6", children: [_jsx(FormField, { control: form.control, name: "fullName", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Nom complet" }), _jsx(FormControl, { children: _jsx(Input, { placeholder: "John Doe", ...field, className: "bg-white" }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "email", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Email" }), _jsx(FormControl, { children: _jsx(Input, { type: "email", placeholder: "john@example.com", ...field, className: "bg-white" }) }), _jsx(FormMessage, {})] })) }), _jsx(FormField, { control: form.control, name: "message", render: ({ field }) => (_jsxs(FormItem, { children: [_jsx(FormLabel, { children: "Message" }), _jsx(FormControl, { children: _jsx(Textarea, { placeholder: "Votre message...", className: "min-h-[150px] bg-white", ...field }) }), _jsx(FormMessage, {})] })) }), _jsx(Button, { type: "submit", disabled: isSubmitting, className: "w-full md:w-auto", children: isSubmitting ? "Envoi en cours..." : "Envoyer" })] }) }) }) })] })] }) }));
};
export default Contact;
