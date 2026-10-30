'use client'

import { navItems } from "@/constants/dashbord/data";
import { cn } from "cn";
import { ChevronRight } from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogoutButton } from "../ui/logout-button";

interface SidebarProps {
    children: React.ReactNode;
    session: Session;
}

export function Sidebar({ children, session }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border">
            <div className="h-20 flex items-center gap-4 px-6 border-b border-border">
                <Link href='/dashboard' className="flex items-center gap-3 transition-transform hover:-translate-y-0.5 ease-out duration-300">
                    <Image src='/logo-2.png' alt="Logo" width={60} height={60} loading="eager" />
                </Link>
                <div>
                    <span className="text-lg font-semibold text-foreground">
                        {session.user.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                        {session.user.role}
                    </span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1">
                {navItems.map(({ icon: Icon, label, count, href }) => {
                    if (href === '/dashboard/users' && session.user.role !== 'developer') {
                        return null;
                    }

                    const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

                    return (
                        <Link key={href} href={href} className={cn('flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group', isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground')}>
                            <Icon className={cn('size-5 transition-transform duration-300 group-hover:-translate-y-0.5', isActive ? 'text-primary' : '')} />
                            <span>{label}</span>
                            {isActive && (
                                <ChevronRight className="size-4 ml-auto" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/50">
                    <Avatar>
                        <AvatarImage src='https://github.com/shadcn.png' alt={session.user.name as string} />
                        <AvatarFallback>{session.user.name}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                            {session.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {session.user.email}
                        </p>
                    </div>

                    <LogoutButton variant='ghost' size='icon' />
                </div>
            </div>
        </aside>
    )
}