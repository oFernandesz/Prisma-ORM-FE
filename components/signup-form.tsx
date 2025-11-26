'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client"; // seu client
import { useRouter } from "next/navigation";
import { useState } from "react";

// Spinner pequeno
const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        const formData = new FormData(event.currentTarget);
        const name = String(formData.get("name") || "");
        const email = String(formData.get("email") || "");
        const password = String(formData.get("password") || "");
        const confirmPassword = String(formData.get("confirm-password") || "");

        if (!name || !email || !password) {
            return setError("Preencha nome, email e senha.");
        }

        if (password !== confirmPassword) {
            return setError("As senhas não coincidem. Por favor, verifique.");
        }

        setLoading(true);

        try {
            const res = await (authClient as any).signUp.email({ 
                email, 
                password,
                name 
            });

            // Log para debug (verifique o Network/Console)
            console.log("signUp response:", res);

            // Verifica formatos comuns de erro/resultado
            if (res?.error) {
                // Biblioteca pode retornar { error: { message: "..." } }
                throw new Error(res.error.message || JSON.stringify(res.error));
            }

            // algumas versões retornam { ok: true } ou { user, session } ...
            // Se houver flag de sucesso, navega
            setTimeout(() => router.push("/login"), 500);

        } catch (err: any) {
            console.error("Erro no signUp:", err);
            // Mensagem amigável
            setError(err?.message || "Erro desconhecido ao cadastrar.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSignup}>
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Create your account</h1>
                                <p className="text-muted-foreground text-sm text-balance">
                                    Enter your details below to create your account
                                </p>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                                <Input id="name" name="name" type="text" placeholder="John Doe" required />
                                <FieldDescription>Your full name</FieldDescription>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                                <FieldDescription>We&apos;ll use this to contact you.</FieldDescription>
                            </Field>

                            <Field>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <Input id="password" name="password" type="password" required />
                                    </div>
                                    <div>
                                        <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                                        <Input id="confirm-password" name="confirm-password" type="password" required />
                                    </div>
                                </div>
                                <FieldDescription>Must be at least 8 characters long.</FieldDescription>
                            </Field>

                            {error && (
                                <p className="text-red-500 text-sm text-center p-2 border border-red-500 rounded-md">
                                    {error}
                                </p>
                            )}

                            <Field>
                                <Button type="submit" disabled={loading}>
                                    {loading ? <Spinner /> : "Create Account"}
                                </Button>
                            </Field>

                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Or continue with
                            </FieldSeparator>

                            <FieldDescription className="text-center">
                                Already have an account? <a href="/login">Sign in</a>
                            </FieldDescription>
                        </FieldGroup>
                    </form>

                    <div className="bg-muted relative hidden md:block">
                        <img
                            src="/placeholder.jpg"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>

            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    );
}
