'use client'

import { LogOut } from "lucide-react"
import { Button } from "./button"
import { logoutAction } from "@/actions/auth/logout-action"

interface LogoutButtonProps extends React.ComponentProps<typeof Button> { }

export function LogoutButton(props: LogoutButtonProps) {
    async function onClick() {
        await logoutAction()
    }

    return (
        <Button onClick={onClick} {...props}>
            <LogOut className="size-4" />
        </Button>
    )
}