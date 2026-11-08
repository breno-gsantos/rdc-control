'use client'

import { deleteAccountAction } from "@/actions/accounts/delete-account";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteAccountDialogProps {
    accountId: string;
    accountName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DeleteAccountDialog({ accountId, accountName, onOpenChange, open }: DeleteAccountDialogProps) {
    const [isPending, setIsPending] = useState<boolean>(false);

    async function handleDelete() {
        if (isPending) return;

        setIsPending(true);

        try {
            const response = await deleteAccountAction(accountId);

            if (!response.success) {
                toast.error(response.error);
                return;
            }

            toast.success(response.message)
        } catch (error) {
            toast.error('Erro inesperado ao excluir a conta')
        } finally {
            setIsPending(false);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Excluir conta?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tem certeza que deseja excluir a conta {" "}
                        <strong className="text-foreground">
                            {accountName}
                        </strong>
                        ?

                        <span className="mt-2 block">
                            Essa ação é permanente. Todas as credenciais vinculadas também serão excluídas.
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        Cancelar
                    </AlertDialogCancel>
                    <Button variant='destructive' onClick={handleDelete} disabled={isPending}>
                        {isPending ? 'Excluindo...' : 'Excluir conta'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}