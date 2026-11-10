'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

interface AccountFiltersProps {
    banks: {
        id: string;
        name: string;
    }[];
    states: string[];
    total: number;
}

export function AccountFilters({ banks, states, total }: AccountFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isPending, startTransition] = useTransition();

    const currentSearch = searchParams.get('search') ?? '';
    const currentBank = searchParams.get('bank') ?? 'all';
    const currentState = searchParams.get('state') ?? 'all';
    const currentOrder = searchParams.get('order') ?? 'name';

    const [search, setSearch] = useState(currentSearch);

    useEffect(() => {
        setSearch(currentSearch);
    }, [currentSearch])

    const updateFilters = useCallback((updates: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (!value || value === 'all') {
                params.delete(key);
            } else {
                params.set(key, value)
            }
        });

        const query = params.toString();

        startTransition(() => {
            router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
        })
    }, [searchParams, pathname, router])

    useEffect(() => {
        if (search === currentSearch) return;

        const timeout = setTimeout(() => {
            updateFilters({ search: search.trim() });
        }, 600)

        return () => clearTimeout(timeout);
    }, [search, currentSearch, updateFilters]);

    const hasFilters =
        currentSearch !== "" ||
        currentBank !== 'all' ||
        currentState !== 'all' ||
        currentOrder !== 'name'

    function clearFilters() {
        setSearch('');

        startTransition(() => {
            router.replace(pathname, { scroll: false })
        })
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 md:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar por conta ou cidade..." className="pl-10" />
                </div>

                <Select value={currentBank} onValueChange={(v) => updateFilters({ bank: v })}>
                    <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder='Todos os bancos' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            Todos os bancos
                        </SelectItem>
                        {banks.map((bank) => (
                            <SelectItem key={bank.id} value={bank.id}>
                                {bank.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={currentState} onValueChange={(v) => updateFilters({ state: v })}>
                    <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder='Todos os estados' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            Todos os Estados
                        </SelectItem>
                        {states.map((state) => (
                            <SelectItem key={state} value={state}>
                                {state}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {hasFilters && (
                    <Button variant='ghost' onClick={clearFilters} className="gap-2">
                        <X className="size-4" />
                    </Button>
                )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                        {total}
                    </span>{" "}
                    {total === 1 ? "conta encontrada" : "contas encontradas"}

                    {isPending && (
                        <span className="ml-2 text-primary">
                            <Spinner />
                        </span>
                    )}
                </p>

                <Select value={currentOrder} onValueChange={(v) => updateFilters({ order: v })}>
                    <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder='Ordenar por' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name">
                            Nome (A-Z)
                        </SelectItem>

                        <SelectItem value="name_desc">
                            Nome (Z-A)
                        </SelectItem>

                        <SelectItem value="recent">
                            Mais recentes
                        </SelectItem>

                        <SelectItem value="oldest">
                            Mais antigas
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}