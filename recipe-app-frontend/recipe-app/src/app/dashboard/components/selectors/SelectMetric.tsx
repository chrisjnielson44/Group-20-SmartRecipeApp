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

interface SelectMetricProps {
    value: string;
    onValueChange: (value: string) => void;
}

export function SelectMetric({ value, onValueChange }: SelectMetricProps) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select Metric" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="trades-pfe">PFE</SelectItem>
                    <SelectItem value="pnl">PnL</SelectItem>
                    <SelectItem value="cva">CVA</SelectItem>
                    <SelectItem value="mtm">MTM</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
