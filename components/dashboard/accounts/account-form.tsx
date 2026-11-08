'use client'

import { createAccountAction } from "@/actions/accounts/create-account"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { states } from "@/constants/dashbord/data"
import { banks, categories, systems } from "@/db/schema"
import { AccountData, accountFormSchema } from "@/lib/validations/accounts/accounts-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Building2, LockKeyhole, MapPin, Plus, PlusCircle, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"

interface AccountFormProps {
    banks: (typeof banks.$inferSelect)[];
    categories: (typeof categories.$inferSelect)[];
    systems: (typeof systems.$inferSelect)[];
}

export function AccountForm({ banks, categories, systems }: AccountFormProps) {
    const router = useRouter();

    const form = useForm<AccountData>({
        resolver: zodResolver(accountFormSchema),
        defaultValues: {
            name: '',
            systemId: '',
            credentials: [
                {
                    username: '',
                    password: ''
                }
            ],
            bankId: '',
            city: '',
            state: '',
            categoryId: '',
            dueDate: null,
            status: 'active',
            notes: '',
            websiteUrl: ''
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'credentials'
    })

    const { control, handleSubmit, formState, setError, reset } = form;
    const { isSubmitting } = formState;

    async function onSubmit(values: AccountData) {
        try {
            const response = await createAccountAction(values);

            if (!response.success) {
                if (typeof response.error === 'string') {
                    setError('root', {
                        type: 'server',
                        message: response.error
                    });
                    return;
                }

                Object.entries(response.error).forEach(([Field, messages]) => {
                    if (messages.length) {
                        setError(Field as keyof AccountData, {
                            type: 'server',
                            message: messages[0]
                        })
                    }
                });
                return;
            }

            reset();
            toast.success(response.message)
            router.push('/dashboard/accounts');
        } catch (error) {

        }
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

                            <Controller control={control} name="bankId" render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Banco</FieldLabel>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                                        <SelectTrigger aria-invalid={fieldState.invalid} id={field.name}>
                                            <SelectValue placeholder='Selecione um banco' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {banks.map(({ id, name }) => (
                                                <SelectItem key={id} value={id}>
                                                    {name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )} />

                            <Controller control={control} name="categoryId" render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Categoria</FieldLabel>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                                        <SelectTrigger aria-invalid={fieldState.invalid} id={field.name}>
                                            <SelectValue placeholder='Selecione a categoria' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(({ id, name }) => (
                                                <SelectItem key={id} value={id}>
                                                    {name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )} />

                            <Controller control={control} name="systemId" render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Sistema</FieldLabel>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                                        <SelectTrigger aria-invalid={fieldState.invalid} id={field.name}>
                                            <SelectValue placeholder='Selecione o sistema' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {systems.map(({ id, name }) => (
                                                <SelectItem key={id} value={id}>
                                                    {name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )} />
                        </div>
                        <Separator />
                        <div className="space-y-1">
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                                <LockKeyhole className="size-5 text-primary" />
                                Credenciais de acesso
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Informe os dados utilizados para acessar o sistema.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {fields.map((field, index) => (
                                <div key={field.id} className="space-y-4 rounded-xl border border-border p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <h4 className="font-medium">
                                            Credencial {index + 1}
                                        </h4>
                                        {fields.length > 1 && (
                                            <Button type="button" variant='ghost' size='icon' className="text-destructive hover:text-destructive" onClick={() => remove(index)} disabled={isSubmitting}>
                                                <Trash2 className="size-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <Controller control={control} name={`credentials.${index}.username`} render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor={field.name}>Usuário / Login</FieldLabel>
                                                <Input placeholder="Digite o usuário" id={field.name} aria-invalid={fieldState.invalid} disabled={isSubmitting} {...field} />
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </Field>
                                        )} />

                                        <Controller control={control} name={`credentials.${index}.password`} render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor={field.name}>Senha</FieldLabel>
                                                <Input type="password" placeholder="Digite a senha" id={field.name} aria-invalid={fieldState.invalid} disabled={isSubmitting} {...field} />
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </Field>
                                        )} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button type="button" variant='outline' className="w-full gap-2" onClick={() => append({ username: '', password: '' })} disabled={isSubmitting}>
                            <Plus className="size-4" />
                            Adicionar credencial
                        </Button>
                        <Separator />

                        <div className="space-y-1">
                            <h3 className="flex items-center gap-2 text-lg font-semibold">
                                <MapPin className="size-5 text-primary" />
                                Localização da conta
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Identifique a prefeitura ou convênio associado à conta.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Controller control={control} name="city" render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Cidade</FieldLabel>
                                    <Input placeholder="Ex: Santos" aria-invalid={fieldState.invalid} id={field.name} disabled={isSubmitting} {...field} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )} />

                            <Controller control={control} name="state" render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Estado</FieldLabel>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                                        <SelectTrigger aria-invalid={fieldState.invalid} id={field.name}>
                                            <SelectValue placeholder='Selecione o estado' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {states.map((state) => (
                                                <SelectItem key={state.value} value={state.value}>
                                                    {state.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )} />

                            <Controller control={control} name="websiteUrl" render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Site do averbador</FieldLabel>
                                    <Input type="url" placeholder="https://www.exemplo.com.br" id={field.name} aria-invalid={fieldState.invalid} disabled={isSubmitting} {...field} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )} />

                            <Controller control={control} name="dueDate" render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Data de vencimento</FieldLabel>
                                    <Input type="date" value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value || null)} disabled={isSubmitting} aria-invalid={fieldState.invalid} id={field.name} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )} />
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Controller control={control} name="status" render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                                        <SelectTrigger aria-invalid={fieldState.invalid} id={field.name}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Ativa</SelectItem>
                                            <SelectItem value="inactive">Inativa</SelectItem>
                                            <SelectItem value="archived">Arquivada</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )} />

                            <Controller control={control} name="notes" render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Observações</FieldLabel>
                                    <Textarea placeholder="Informações adicionais..." className="resize-none" id={field.name} aria-invalid={fieldState.invalid} disabled={isSubmitting} {...field} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )} />
                        </div>

                        <div className="flex justify-end pt-3">
                            <Button type="submit" disabled={isSubmitting} className="min-w-40">
                                {isSubmitting ? (
                                    <>
                                        <Spinner />
                                        Cadastrando...
                                    </>
                                ) : (
                                    <>
                                        <PlusCircle className="size-4" />
                                        Cadastrar
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