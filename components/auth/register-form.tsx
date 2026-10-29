'use client'

import { registerFormSchema, RegisterInput } from '@/lib/validations/register-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner'
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { userRoleEnum } from '@/db/schema';
import { roleLabels } from '@/types/auth/register-types';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { Separator } from '../ui/separator';
import { useState } from 'react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group';
import { registerAction } from '@/actions/auth/register-action';
import { toast } from 'sonner';

export function RegisterForm() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            isActive: true,
            role: 'promoter'
        }
    })

    const { control, handleSubmit, formState, reset, setError } = form;
    const { isSubmitting } = formState;

    async function onSubmit(values: RegisterInput) {
        try {
            const response = await registerAction(values);

            if (!response.success) {
                if ('fieldError' in response) {
                    if (response.fieldError.email) {
                        setError('email', {
                            type: 'server',
                            message: response.fieldError.email[0]
                        })
                    }
                    return;
                }

                if (typeof response.error === 'string') {
                    toast.error(response.error)
                    return;
                }

                Object.entries(response.error).forEach(([field, messages]) => {
                    setError(field as keyof RegisterInput, {
                        type: 'server',
                        message: messages[0]
                    })
                })

                return;
            }

            toast.success(response.message);
            reset();
        } catch (error) {
            toast.error('Erro interno do Servidor')
        }
    }

    return (
        <Card className='w-full max-w-2xl shadow-md'>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>

                        <div className='flex flex-col items-center gap-2 text-center'>
                            <Image src='/logo.png' alt='Logo' width={120} height={120} loading='eager' />
                            <h1 className='text-xl font-bold'>Criar conta RDC Control</h1>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                            <Controller control={control} name='name' render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
                                    <Input placeholder='João da Silva' id={field.name} aria-invalid={fieldState.invalid} disabled={isSubmitting} {...field} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )} />

                            <Controller control={control} name='email' render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                    <Input type='email' placeholder='joao.silva@mail.com' id={field.name} aria-invalid={fieldState.invalid} disabled={isSubmitting} {...field} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )} />

                            <Controller control={control} name='password' render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Senha</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput placeholder='********' type={showPassword ? 'text' : 'password'} id={field.name} aria-invalid={fieldState.invalid} disabled={isSubmitting} {...field} />
                                        <InputGroupAddon align='inline-end'>
                                            <Button type='button' size='icon-xs' variant='ghost' onClick={() => setShowPassword((prev) => !prev)} disabled={isSubmitting}>
                                                {showPassword ? (
                                                    <EyeOff className='size-4' />
                                                ) : (
                                                    <Eye className='size-4' />
                                                )}
                                            </Button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )} />

                            <Controller control={control} name='confirmPassword' render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Confirmar senha</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput placeholder='********' type={showConfirmPassword ? 'text' : 'password'} id={field.name} aria-invalid={fieldState.invalid} disabled={isSubmitting} {...field} />
                                        <InputGroupAddon align='inline-end'>
                                            <Button type='button' disabled={isSubmitting} variant='ghost' size='icon-xs' onClick={() => setShowConfirmPassword((prev) => !prev)}>
                                                {showConfirmPassword ? (
                                                    <EyeOff className='size-4' />
                                                ) : (
                                                    <Eye className='size-4' />
                                                )}
                                            </Button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )} />
                        </div>

                        <Separator />

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <Controller control={control} name='role' render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Cargo</FieldLabel>
                                    <FieldDescription>Defina a função do usuário no sistema</FieldDescription>
                                    <Select name={field.name} value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid} className='min-w-30'>
                                            <SelectValue placeholder='Selecione um cargo' />
                                        </SelectTrigger>
                                        <SelectContent position='item-aligned'>
                                            {userRoleEnum.enumValues.map((role) => (
                                                <SelectItem key={role} value={role}>
                                                    {roleLabels[role]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )} />

                            <Controller control={control} name='isActive' render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Status da conta</FieldLabel>
                                    <div className='flex min-h-9 items-center gap-3'>
                                        <Switch id={field.name} name={field.name} checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} aria-invalid={fieldState.invalid} />
                                        <span className='text-sm font-medium'>
                                            {field.value ? 'Ativa' : 'Inativa'}
                                        </span>
                                    </div>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    <FieldDescription>
                                        {field.value ? 'O usuário poderá acessar o sistema' : 'O acesso do usuário ficará desativado'}
                                    </FieldDescription>
                                </Field>
                            )} />
                        </div>

                        <div className='flex items-center justify-center mt-5'>
                            <Button className='w-sm' type='submit' disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Spinner />
                                        Criando conta...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className='size-4' />
                                        Criar conta
                                    </>
                                )}
                            </Button>
                        </div>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}