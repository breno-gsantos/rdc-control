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
}

export function DashboardHeader({ title, description, children, button }: DashboardHeaderProps) {
    return (
        <div className="space-y-8">
            <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                    <p className="text-muted-foreground mt-1">{description}</p>
                </div>
                {button && (
                    <Button asChild variant='outline'>
                        <Link href={button.href}>
                            <Plus className="size-4" />
                            {button.label}
                        </Link>
                    </Button>
                )}
            </div>
            {children}
        </div>
    )
}