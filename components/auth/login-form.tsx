'use client'

import { useRouter } from "next/navigation"
import { Card, CardContent } from "../ui/card"
import { Controller, useForm } from "react-hook-form";
import { LoginFormData, loginFormSchema } from "@/lib/validations/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { AlertCircleIcon, LogIn } from "lucide-react";
import { loginAction } from "@/actions/auth/login-action";
import { toast } from "sonner";
import { Alert, AlertDescription } from "../ui/alert";

export function LoginForm() {
    const router = useRouter();

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const { control, handleSubmit, formState, resetField, reset, setError } = form;
    const { isSubmitting } = formState;

    async function onSubmit(values: LoginFormData) {
        try {
            const response = await loginAction(values);

            if (!response.success) {
                setError('root', {
                    type: 'server',
                    message: response.error
                })
                resetField('password');
                return;
            }

            toast.success(response.message);
            reset();
            router.push('/dashboard');
        } catch (error) {
            toast.error('Erro interno do servidor')
        }
    }

    return (
        <Card className="w-full max-w-md shadow-md">
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>

                        <div className="flex flex-col items-center text-center">
                            <Image src='/logo.png' alt="Logo" width={250} height={250} loading="eager" />
                        </div>

                        <Controller control={control} name="email" render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                <Input placeholder="mail@mail.com" type="email" id={field.name} aria-invalid={fieldState.invalid} disabled={isSubmitting} {...field} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )} />

                        <Controller control={control} name="password" render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Senha</FieldLabel>
                                <Input placeholder="********" type="password" id={field.name} aria-invalid={fieldState.invalid} disabled={isSubmitting} {...field} />
                            </Field>
                        )} />

                        {formState.errors.root && (
                            <Alert className="border-rose-900 bg-rose-700/50">
                                <AlertCircleIcon />
                                <AlertDescription className="text-rose-50">
                                    {formState.errors.root.message}
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Spinner />
                                    Entrando...
                                </>
                            ) : (
                                <>
                                    <LogIn className="size-4" />
                                    Entrar
                                </>
                            )}
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}