import { Bell, Building2, FileClock, LayoutDashboard, Users } from "lucide-react";

export const navItems = [
    { href: '/dashboard', label: 'Visão geral', icon: LayoutDashboard },
    { href: '/accounts', label: 'Contas', icon: Building2, count: 0 },
    { href: '/users', label: 'Usuários', icon: Users },
    { href: '/notifications', label: 'Notificações', icon: Bell, count: 4 },
    { href: '/history', label: 'Histórico', icon: FileClock },
]