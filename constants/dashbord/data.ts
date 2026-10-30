import { Bell, Building2, FileClock, LayoutDashboard, Users } from "lucide-react";

export const navItems = [
    { href: '/dashboard', label: 'Visão geral', icon: LayoutDashboard },
    { href: '/dashboard/accounts', label: 'Contas', icon: Building2, count: 0 },
    { href: '/dashboard/users', label: 'Usuários', icon: Users },
    { href: '/dashboard/notifications', label: 'Notificações', icon: Bell, count: 4 },
    { href: '/dashboard/history', label: 'Histórico', icon: FileClock }
]