import React, { ReactNode } from 'react'
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '../ui/form'
import { CheckboxProps } from '@radix-ui/react-checkbox'
import { useFormContext } from 'react-hook-form'
import { Checkbox } from '../ui/checkbox'

interface IProps extends CheckboxProps {
    inputName: string,
    labelName: string,
    description?: string | ReactNode
}
export default function FormCheckbox({
    inputName,
    labelName,
    description
}: IProps) {
    const { control } = useFormContext();
    return (
        <FormField
            control={control}
            name={inputName}
            render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4">
                    <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={(event) => {
                                console.log("event chek : ", event, typeof event);
                                field.onChange(event);
                            }}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>
                            {labelName}
                        </FormLabel>
                        {description &&
                            <FormDescription>{description}</FormDescription>
                        }
                    </div>
                </FormItem>
            )}
        />
    )
}
