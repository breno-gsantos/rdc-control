'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { AccountData, accountFormSchema } from "@/lib/validations/accounts/accounts-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Building2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"

export function AccountForm() {
    const router = useRouter();

    const form = useForm<AccountData>({
        resolver: zodResolver(accountFormSchema),
        defaultValues: {
            name: '',
            system: '',
            username: '',
            password: '',
            bank: '',
            city: '',
            state: '',
            category: '',
            responsibleId: null,
            dueDate: null,
            status: 'active',
            notes: ''
        }
    })

    const { control, handleSubmit, formState, setError, reset } = form;
    const { isSubmitting } = formState;

    async function onSubmit(values: AccountData) {
        console.log(values);
    }

    return (
        <Card className="w-full">
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <div className="space-y-1">
                            <h2 className="flex items-center gap-2 text-lg font-semibold">
                                <Building2 className="size-5 text-primary" />
                                Dados da Conta
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Cadastre uma nova conta de acesso da empresa
                            </p>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <Controller control={control} name="name" render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Nome da Conta</FieldLabel>
                                    <Input placeholder="Ex: Prefeitura de Santos" id={field.name} aria-invalid={fieldState.invalid} disabled={isSubmitting} {...field} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )} />

                            <Controller control={control} name="bank" render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Banco</FieldLabel>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                                        <SelectTrigger aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder='Selecione um banco' />
                                        </SelectTrigger>
                                    </Select>
                                </Field>
                            )} />


                        </div>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}