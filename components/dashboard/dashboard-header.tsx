import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface DashboardHeaderProps {
    title: string;
    description: string;
    children: React.ReactNode;
    button?: {
        label: string;
        href: string;
        icon?: string;
    }
    actions?: React.ReactNode;
}

export async function DashboardHeader({ title, description, children, button, actions }: DashboardHeaderProps) {
    const session = await auth();

    return (
        <div className="space-y-8">
            <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                    <p className="text-muted-foreground mt-1">{description}</p>
                </div>
                {(session?.user.role === 'admin' || session?.user.role === 'director') && (
                    <div className="flex flex-wrap items-center gap-2">
                        {actions}

                        {button && (
                            <Button asChild>
                                <Link href={button.href}>
                                    <Plus className="size-4" />
                                    {button.label}
                                </Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
            {children}
        </div>
    )
}