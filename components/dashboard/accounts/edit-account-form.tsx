'use client'

import { updateAccountAction } from "@/actions/accounts/update-account";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { states } from "@/constants/dashbord/data";
import { accounts, banks, categories, systems } from "@/db/schema"
import { EditAccountData, editAccountFormSchema } from "@/lib/validations/accounts/accounts-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Building2, LockKeyhole, MapPin, Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, FormState, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditAccountFormProps {
    account: typeof accounts.$inferSelect;
    credentials: {
        id: string;
        username: string;
    }[];
    banks: (typeof banks.$inferSelect)[];
    categories: (typeof categories.$inferSelect)[];
    systems: (typeof systems.$inferSelect)[];
}

export function EditAccountForm({ account, banks, categories, credentials, systems }: EditAccountFormProps) {
    const router = useRouter();

    const form = useForm<EditAccountData>({
        resolver: zodResolver(editAccountFormSchema),
        defaultValues: {
            name: account.name,
            systemId: account.systemId,
            bankId: account.bankId,
            categoryId: account.categoryId,
            city: account.city,
            state: account.state,
            dueDate: account.dueDate,
            status: account.status,
            notes: account.notes,
            websiteUrl: account.websiteUrl,
            credentials: credentials.map((credential) => ({
                id: credential.id,
                username: credential.username,
                password: ''
            }))
        }
    });

    const { control, handleSubmit, formState, setError } = form;
    const { isSubmitting } = formState;

    const { append, fields, remove } = useFieldArray({
        control: form.control,
        name: 'credentials',
        keyName: '_key'
    })

    async function onSubmit(values: EditAccountData) {
        try {
            const response = await updateAccountAction(account.id, values);

            if (!response.success) {
                if (typeof response.error === 'string') {
                    setError('root', {
                        type: 'server',
                        message: response.error
                    });

                    toast.error(response.error);
                    return;
                }

                Object.entries(response.error).forEach(([field, messages]) => {
                    if (messages.length) {
                        setError(field as keyof EditAccountData, {
                            type: 'server',
                            message: messages[0]
                        })
                    }
                });

                toast.error('Verifique os campos informados')
                return;
            }

            toast.success(response.message);
            router.push('/dashboard/accounts');
        } catch (error) {
            console.error('[EDIT_ACCOUNT_FORM_ERROR]', error);
            toast.error('Não foi possível atualizar a conta')
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
                                Atualize as informações principais desta conta.
                            </p>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Controller control={control} name="name" render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Nome da conta</FieldLabel>
                                    <Input placeholder="Ex: Prefeitura de Santos" id={field.name} aria-invalid={fieldState.invalid} disabled={isSubmitting} {...field} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )} />

                            <Controller control={control} name="bankId" render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Banco</FieldLabel>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
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
                                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
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
                                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder='Selecione o tipo de sistema' />
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
                                Gerencie os usuários e as senhas vinculadas a esta conta.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {fields.map((field, index) => (
                                <div key={field._key} className="space-y-4 rounded-xl border border-border p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="space-y-1">
                                            <h4 className="font-medium">
                                                Credencial {index + 1}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                                {field.id ? 'Credencial cadastrada' : 'Nova credencial'}
                                            </p>
                                        </div>
                                        <Button type="button" variant='ghost' size='icon' className="text-destructive hover:text-destructive" onClick={() => remove(index)} disabled={isSubmitting}>
                                            <Trash2 className="size-4" />
                                        </Button>
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
                                                <FieldLabel htmlFor={field.name}>
                                                    {fields[index].id ? 'Nova senha (opcional)' : 'Senha'}
                                                </FieldLabel>
                                                <Input type="password" placeholder={fields[index]?.id ? 'Deixe em branco para manter a senha atual' : 'Digite a senha'} id={field.name} aria-invalid={fieldState.invalid} disabled={isSubmitting} {...field} />
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </Field>
                                        )} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {formState.errors.credentials?.root && (
                            <FieldError errors={[formState.errors.credentials.root]} />
                        )}

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
                                Indentifique a prefeitura ou o convênio associado à conta.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Controller control={control} name="city" render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Cidade</FieldLabel>
                                    <Input placeholder="Ex: Santos" id={field.name} aria-invalid={fieldState.invalid} disabled={isSubmitting} {...field} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )} />

                            <Controller control={control} name="state" render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Estado</FieldLabel>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
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
                                    <Input type="date" id={field.name} aria-invalid={fieldState.invalid} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value || null)} disabled={isSubmitting} />
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
                                        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">
                                                Ativa
                                            </SelectItem>

                                            <SelectItem value="inactive">
                                                Inativa
                                            </SelectItem>

                                            <SelectItem value="archived">
                                                Arquivada
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )} />

                            <Controller control={control} name="notes" render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Observações</FieldLabel>
                                    <Textarea placeholder="Informações adicionais..." id={field.name} aria-invalid={fieldState.invalid} className="resize-none" disabled={isSubmitting} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )} />
                        </div>

                        {formState.errors.root && (
                            <FieldError errors={[formState.errors.root]} />
                        )}

                        <Separator />

                        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                            <Button type="button" variant='outline' onClick={() => router.push('/dashboard/accounts')} disabled={isSubmitting}>
                                <ArrowLeft className="size-4" />
                                Cancelar
                            </Button>

                            <Button type="submit" disabled={isSubmitting} className="min-w-40">
                                {isSubmitting ? (
                                    <>
                                        <Spinner />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="size-4" />
                                        Salvar alterações
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