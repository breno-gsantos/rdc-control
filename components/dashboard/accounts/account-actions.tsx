'use client'

import { useState } from "react"
import { CreateOptionDialog, OptionType } from "./create-option-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Landmark, MonitorCog, Plus, Tags } from "lucide-react";

export function AccountActions() {
    const [dialogType, setDialogType] = useState<OptionType | null>(null);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='outline'>
                        <Plus className="size-4" />
                        Adicionar
                        <ChevronDown className="size-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setDialogType('bank')}>
                        <Landmark className="mr-3 size-4" />
                        Banco
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setDialogType('system')}>
                        <MonitorCog className="mr-3 size-4" />
                        Sistema
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setDialogType('category')}>
                        <Tags className="mr-3 size-4" />
                        Categoria
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <CreateOptionDialog
                type={dialogType}
                open={dialogType !== null}
                onOpenChange={(open) => {
                    if (!open) setDialogType(null);
                }}
            />
        </>
    )
}