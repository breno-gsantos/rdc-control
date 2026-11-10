'use client'

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { KeyRound, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DeleteAccountDialog } from "./delete-account-dialog";
import { ManageAccountCredentialPermissionsDialog } from "./manage-account-credential-permissions-dialog";

interface AccountManagementMenuProps {
    accountId: string;
    accountName: string;
    bank?: string | null;
}

export function AccountManagementMenu({ accountId, accountName, bank }: AccountManagementMenuProps) {
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button type="button" variant='ghost' size='icon' className="size-8">
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-45">
                    <DropdownMenuItem className="text-blue-600 focus:bg-blue-500/10 focus:text-blue-600" asChild>
                        <Link href={`/dashboard/accounts/edit/${accountId}`}>
                            <Pencil className="mr-2 size-4" stroke="blue" />
                            Editar convênio
                        </Link>
                    </DropdownMenuItem>

                    <ManageAccountCredentialPermissionsDialog
                        accountId={accountId}
                        accountName={accountName}
                        bank={bank}
                    >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-violet-600 focus:bg-violet-500/10 focus:text-violet-600">
                            <KeyRound className="mr-2 size-4" stroke="purple" />
                            Gerenciar acessos
                        </DropdownMenuItem>
                    </ManageAccountCredentialPermissionsDialog>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onSelect={() => setDeleteOpen(true)}>
                        <Trash2 className="mr-2 size-4" stroke="red" />
                        Excluir convênio
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteAccountDialog
                accountId={accountId}
                accountName={accountName}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
            />
        </>
    )
}