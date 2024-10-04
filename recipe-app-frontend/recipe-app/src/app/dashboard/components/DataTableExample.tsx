"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export type Transaction = {
    TransactionID: string;
    ACADIAID: string | null;
    TradingDate: string | null;
    MaturityDate: string | null;
    BuyCurrency: string | null;
    SellCurrency: string | null;
    SpotRate: number | null;
    ForwardRate: number | null;
    BuyNotional: string | null;
    SellNotional: number | null;
    CounterpartyID: string | null;
    CollateralFactor: number | null;
    UncollatPFE_5D: number | null;
    UncollatPFE_15D: number | null;
    UncollatPFE_30D: number | null;
    CollatPFE_5D: number | null;
    CollatPFE_15D: number | null;
    CollatPFE_30D: number | null;
}

const ALL_COUNTERPARTIES = "all_counterparties"

interface TransactionTableProps {
    engine: string;
    product: string;
    metric: string;
}

export function TransactionTable({ engine, product, metric }: TransactionTableProps) {
    const [transactions, setTransactions] = React.useState<Transaction[]>([])
    const [loading, setLoading] = React.useState(true)
    const [counterparties, setCounterparties] = React.useState<string[]>([])
    const [selectedCounterparty, setSelectedCounterparty] = React.useState<string>(ALL_COUNTERPARTIES)

    const columns = React.useMemo<ColumnDef<Transaction>[]>(() => [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                />
            ),
        },
        { accessorKey: "TransactionID", header: "Transaction ID" },
        { accessorKey: "ACADIAID", header: engine === 'quic' ? "QUIC ID" : "ACADIA ID" },
        {
            accessorKey: "TradingDate",
            header: "Trading Date",
            cell: ({ row }) => row.getValue("TradingDate") ? new Date(row.getValue("TradingDate") as string).toLocaleDateString() : ''
        },
        {
            accessorKey: "MaturityDate",
            header: "Maturity Date",
            cell: ({ row }) => row.getValue("MaturityDate") ? new Date(row.getValue("MaturityDate") as string).toLocaleDateString() : ''
        },
        { accessorKey: "BuyCurrency", header: "Buy Currency" },
        { accessorKey: "SellCurrency", header: "Sell Currency" },
        { accessorKey: "SpotRate", header: "Spot Rate" },
        { accessorKey: "ForwardRate", header: "Forward Rate" },
        { accessorKey: "BuyNotional", header: "Buy Notional" },
        { accessorKey: "SellNotional", header: "Sell Notional" },
        { accessorKey: "CounterpartyID", header: "Counterparty ID" },
        { accessorKey: "CollateralFactor", header: "Collateral Factor" },
        { accessorKey: "UncollatPFE_5D", header: "Uncollat PFE (5D)" },
        { accessorKey: "UncollatPFE_15D", header: "Uncollat PFE (15D)" },
        { accessorKey: "UncollatPFE_30D", header: "Uncollat PFE (30D)" },
        { accessorKey: "CollatPFE_5D", header: "Collat PFE (5D)" },
        { accessorKey: "CollatPFE_15D", header: "Collat PFE (15D)" },
        { accessorKey: "CollatPFE_30D", header: "Collat PFE (30D)" },
    ], [engine])

    React.useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                let endpoint = `/api/${engine}/${product}/${metric}`
                const response = await fetch(endpoint)
                if (!response.ok) {
                    throw new Error('Failed to fetch data')
                }
                const data = await response.json()
                setTransactions(data)
                // Extract unique counterparties
                const uniqueCounterparties = Array.from(new Set(data.map((t: Transaction) => t.CounterpartyID)))
                setCounterparties(uniqueCounterparties.filter((c): c is string => c !== null))
            } catch (error) {
                console.error("Error fetching transactions:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [engine, product, metric])

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
        UncollatPFE_5D: false,
        UncollatPFE_15D: false,
        UncollatPFE_30D: false,
        CollatPFE_5D: false,
        CollatPFE_15D: false,
        CollatPFE_30D: false,
    })
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data: transactions,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        initialState: {
            pagination: {
                pageSize: 15,
            },
        },
    })

    React.useEffect(() => {
        if (selectedCounterparty !== ALL_COUNTERPARTIES) {
            table.getColumn("CounterpartyID")?.setFilterValue(selectedCounterparty)
        } else {
            table.getColumn("CounterpartyID")?.setFilterValue(undefined)
        }
    }, [selectedCounterparty, table])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <Card className="w-full h-full col-span-3">
            <CardContent>
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter transactions..."
                        value={(table.getColumn("TransactionID")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("TransactionID")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm mr-4"
                    />
                    <Select
                        value={selectedCounterparty}
                        onValueChange={setSelectedCounterparty}
                    >
                        <SelectTrigger className="w-[200px] mr-4">
                            <SelectValue placeholder="Select Counterparty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL_COUNTERPARTIES}>All Counterparties</SelectItem>
                            {counterparties.map((counterparty) => (
                                <SelectItem key={counterparty} value={counterparty}>
                                    {counterparty}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
            <CardFooter>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}