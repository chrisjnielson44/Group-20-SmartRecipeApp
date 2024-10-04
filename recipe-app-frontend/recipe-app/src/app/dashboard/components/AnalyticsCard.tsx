'use client'
import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { SelectEngine } from "@/app/dashboard/components/selectors/SelectEngine"
import { SelectMetric } from "@/app/dashboard/components/selectors/SelectMetric"
import { SelectProduct } from "@/app/dashboard/components/selectors/SelectProduct"
import { TransactionTable } from "./DataTableExample"

export function AnalyticsCard() {
    const [selectedEngine, setSelectedEngine] = useState<string>("f22")
    const [selectedProduct, setSelectedProduct] = useState<string>("fxforward")
    const [selectedMetric, setSelectedMetric] = useState<string>("trades-pfe")

    return (
        <Card className="w-full h-[4/5]">
            <CardHeader>
                <div className="flex">
                    <div className="flex space-x-2 py-1">
                        <SelectEngine
                            value={selectedEngine}
                            onValueChange={setSelectedEngine}
                        />
                        <SelectProduct
                            value={selectedProduct}
                            onValueChange={setSelectedProduct}
                        />
                        <SelectMetric
                            value={selectedMetric}
                            onValueChange={setSelectedMetric}
                        />
                    </div>
                    <Button variant="outline" className="ml-auto">
                        Export
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <TransactionTable
                    engine={selectedEngine}
                    product={selectedProduct}
                    metric={selectedMetric}
                />
            </CardContent>
            <CardFooter>
                {/* Add any footer content if needed */}
            </CardFooter>
        </Card>
    )
}