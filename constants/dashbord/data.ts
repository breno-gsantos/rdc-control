import { Bell, Building2, FileClock, LayoutDashboard, Users } from "lucide-react";

export type Activity = {
    id: string
    user: string
    initials: string
    action: string
    description: string
    time: string
}

export const navItems = [
    { href: '/dashboard', label: 'Visão geral', icon: LayoutDashboard },
    { href: '/dashboard/accounts', label: 'Contas', icon: Building2, count: 0 },
    { href: '/dashboard/users', label: 'Usuários', icon: Users },
    { href: '/dashboard/notifications', label: 'Notificações', icon: Bell, count: 4 },
    { href: '/dashboard/history', label: 'Histórico', icon: FileClock }
]

export const states = [
    { value: "AC", label: "Acre" },
    { value: "AL", label: "Alagoas" },
    { value: "AP", label: "Amapá" },
    { value: "AM", label: "Amazonas" },
    { value: "BA", label: "Bahia" },
    { value: "CE", label: "Ceará" },
    { value: "DF", label: "Distrito Federal" },
    { value: "ES", label: "Espírito Santo" },
    { value: "GO", label: "Goiás" },
    { value: "MA", label: "Maranhão" },
    { value: "MT", label: "Mato Grosso" },
    { value: "MS", label: "Mato Grosso do Sul" },
    { value: "MG", label: "Minas Gerais" },
    { value: "PA", label: "Pará" },
    { value: "PB", label: "Paraíba" },
    { value: "PR", label: "Paraná" },
    { value: "PE", label: "Pernambuco" },
    { value: "PI", label: "Piauí" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "RN", label: "Rio Grande do Norte" },
    { value: "RS", label: "Rio Grande do Sul" },
    { value: "RO", label: "Rondônia" },
    { value: "RR", label: "Roraima" },
    { value: "SC", label: "Santa Catarina" },
    { value: "SP", label: "São Paulo" },
    { value: "SE", label: "Sergipe" },
    { value: "TO", label: "Tocantins" },
] as const;

export const activities: Activity[] = [
    { id: 'act-01', user: 'Marina Costa', initials: 'MC', action: 'Atualizou uma conta', description: 'Prefeitura de Belo Horizonte', time: 'há 12 min' },
    { id: 'act-02', user: 'João Alves', initials: 'JA', action: 'Cadastrou uma nova conta', description: 'Governo de Minas Gerais', time: 'há 46 min' },
    { id: 'act-03', user: 'Ana Souza', initials: 'AS', action: 'Alterou o status', description: 'Prefeitura de Recife para arquivada', time: 'há 2 h' },
    { id: 'act-04', user: 'Ricardo Lima', initials: 'RL', action: 'Atualizou credenciais', description: 'Governo de São Paulo', time: 'há 3 h' },
]