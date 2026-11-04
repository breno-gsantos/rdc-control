'use client'

import { createBankAction, createCategoryAction, createSystemAction } from "@/actions/accounts/options-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { OptionData, optionFormSchema } from "@/lib/validations/accounts/options-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export type OptionType = 'bank' | 'system' | 'category';

interface CreateOptionDialogProps {
    type: OptionType | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const labels: Record<OptionType, string> = {
    bank: 'Banco',
    category: 'Categoria',
    system: 'Sistema'
}

export function CreateOptionDialog({ onOpenChange, open, type }: CreateOptionDialogProps) {
    const label = type ? labels[type] : '';

    const form = useForm<OptionData>({
        resolver: zodResolver(optionFormSchema),
        defaultValues: {
            name: ''
        }
    })

    const { control, handleSubmit, setError, formState, reset } = form;
    const { isSubmitting } = formState;

    async function onSubmit(values: OptionData) {
        if (!type) return;

        const actions = {
            bank: createBankAction,
            system: createSystemAction,
            category: createCategoryAction
        }

        try {
            const response = await actions[type](values);

            if (!response.success) {
                setError('name', {
                    message: response.error
                });
                return;
            }

            toast.success(response.message)

            reset();
            onOpenChange(false);
        } catch (error) {
            setError('root', {
                message: 'Erro inesperado ao cadastrar'
            })
        }
    }

    function handleOpenChange(value: boolean) {
        if (isSubmitting) return;

        if (!value) reset();

        onOpenChange(value);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Novo {label.toLowerCase()}</DialogTitle>
                    <DialogDescription>Cadastre um novo {label.toLowerCase()} no sistema.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller control={control} name="name" render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
                                <Input placeholder={`Informe o nome do ${label.toLowerCase()}`} id={field.name} aria-invalid={fieldState.invalid} disabled={isSubmitting} {...field} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )} />

                        {formState.errors.root && (
                            <p className="text-sm text-destructive">
                                {formState.errors.root.message}
                            </p>
                        )}

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant='outline' disabled={isSubmitting} onClick={() => handleOpenChange(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Spinner />
                                        Cadastrando...
                                    </>
                                ) : (
                                    <>
                                        Cadastrar
                                    </>
                                )}
                            </Button>
                        </div>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    )
}