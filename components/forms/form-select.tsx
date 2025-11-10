import React from 'react'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useFormContext } from 'react-hook-form'
import { SelectProps } from '@radix-ui/react-select'

interface IProps extends SelectProps {
    inputName: string,
    labelName?: string,
    description?: string,
    placeholder: string,
    options: {
        label: string | number,
        value: string
    }[]
}

export default function FormSelect({
    inputName,
    labelName,
    description,
    placeholder,
    options
}: IProps) {
    const { control } = useFormContext()
    return (
        <FormField
            control={control}
            name={inputName}
            render={({ field }) => (
                <FormItem>
                    {labelName && <FormLabel>{labelName}</FormLabel>}
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {options.map(option =>
                                <SelectItem value={option.value} key={option.value}>{option.label}</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
