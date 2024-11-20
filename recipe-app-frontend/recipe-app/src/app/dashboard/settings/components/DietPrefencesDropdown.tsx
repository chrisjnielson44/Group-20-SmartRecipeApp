import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface SelectEngineProps {
    value: string;
    onValueChange: (value: string) => void;
}

export function SelectEngine({ value, onValueChange }: SelectEngineProps) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select Engine" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="f22">F22</SelectItem>
                    <SelectItem value="quic">QUIC</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
