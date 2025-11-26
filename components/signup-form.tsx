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
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupInput } from "@/lib/auth-schema";
import { useState } from "react";

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
    const [error, setError] = useState("");
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupInput>({
        resolver: zodResolver(signupSchema),
    });

    async function onSubmit(data: SignupInput) {
        try {
            setError("");
            const res = await (authClient as any).signUp.email({
                email: data.email,
                password: data.password,
                name: data.name
            });

            console.log("SignUp Response:", res);

            if (!res) {
                throw new Error("Resposta vazia do servidor");
            }

            if (res?.error) {
                const errorMsg = typeof res.error === 'string'
                    ? res.error
                    : res.error?.message || JSON.stringify(res.error);
                throw new Error(errorMsg);
            }

            if (res?.ok === false || res?.status === 500) {
                throw new Error(res?.message || "Erro ao criar conta");
            }

            if (res?.user || res?.data?.user) {
                setTimeout(() => router.push("/login"), 500);
            } else {
                throw new Error("Conta criada mas resposta inválida");
            }

        } catch (err: any) {
            console.error("Erro no signUp:", err);
            setError(err?.message || "Erro desconhecido ao cadastrar. Tente novamente.");
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Create your account</h1>
                                <p className="text-muted-foreground text-sm text-balance">
                                    Enter your details below to create your account
                                </p>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                                <div>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        {...register("name")}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                    )}
                                </div>
                                <FieldDescription>Your full name</FieldDescription>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <div>
                                    <Input
                                        id="email"
                                        placeholder="m@example.com"
                                        {...register("email")}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                    )}
                                </div>
                                <FieldDescription>We&apos;ll use this to contact you.</FieldDescription>
                            </Field>

                            <Field>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <div>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••"
                                                {...register("password")}
                                            />
                                            {errors.password && (
                                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                                        <div>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="••••••"
                                                {...register("confirmPassword")}
                                            />
                                            {errors.confirmPassword && (
                                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                                            )}
                                        </div>
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
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? <Spinner /> : "Create Account"}
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
