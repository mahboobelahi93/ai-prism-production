"use client";

import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input, type InputProps } from "../ui/input";

interface IProps extends InputProps {
  inputName: string;
  labelName?: string;
  description?: string;
}

export default function FormInput({
  inputName,
  labelName,
  placeholder,
  description,
  maxLength,
  ...props
}: Readonly<IProps>) {
  const { control, watch } = useFormContext();
  const value = watch(inputName) || "";

  return (
    <FormField
      control={control}
      name={inputName}
      render={({ field }) => (
        <FormItem>
          {labelName && <FormLabel>{labelName}</FormLabel>}

          <div className="space-y-1">
            <FormControl>
              <Input
                placeholder={placeholder}
                {...field}
                {...props}
                maxLength={maxLength}
              />
            </FormControl>

            {maxLength && (
              <div className="text-right text-xs text-muted-foreground">
                {value.length}/{maxLength}
              </div>
            )}
          </div>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
