'use client'

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DeleteAccountDialog } from "./delete-account-dialog";

interface AccountManagementMenuProps {
    accountId: string;
    accountName: string;
}

export function AccountManagementMenu({ accountId, accountName }: AccountManagementMenuProps) {
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button type="button" variant='ghost' size='icon' className="size-8">
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/accounts/edit/${accountId}`}>
                            <Pencil className="mr-2 size-4" />
                            Editar
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onSelect={() => setDeleteOpen(true)}>
                        <Trash2 className="mr-2 size-4" stroke="red" />
                        Excluir
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