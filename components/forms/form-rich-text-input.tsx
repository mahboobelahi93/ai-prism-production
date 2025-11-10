import React from 'react'
import { useFormContext } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import SunEditor, { buttonList } from 'suneditor-react';

interface IProps {
    inputName: string,
    labelName?: string,
    description?: string,
}

export default function FormRichTextInput({
    inputName,
    labelName,
    description,
}: Readonly<IProps>) {
    const { control } = useFormContext();
    return (
        <FormField
            control={control}
            name={inputName}
            render={({ field }) => (
                <FormItem>
                    {labelName && <FormLabel>{labelName}</FormLabel>}
                    <FormControl>
                        <SunEditor
                            setAllPlugins={true}
                            setOptions={{
                                buttonList: buttonList.complex,
                                templates: [{
                                    html: "Hello",
                                    name: "1"
                                }]
                            }}
                            setContents={field.value}
                            height='400px'
                            {...field}
                        />
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
