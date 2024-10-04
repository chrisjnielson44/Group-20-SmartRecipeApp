import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface SelectProductProps {
    value: string;
    onValueChange: (value: string) => void;
}

export function SelectProduct({ value, onValueChange }: SelectProductProps) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select Product" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="fxforward">FX Forward</SelectItem>
                    <SelectItem value="fxswap">FX Swap</SelectItem>
                    <SelectItem value="ir">IR</SelectItem>
                    <SelectItem value="commod">Commodities</SelectItem>
                    <SelectItem value="equity">Equity</SelectItem>
                    <SelectItem value="futures">Futures</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
