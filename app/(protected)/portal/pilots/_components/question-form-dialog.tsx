'use client'

import { useEffect, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, X } from 'lucide-react'
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Question, QuestionFormData } from "@/types/quizz"
import { addQuestionToQuiz, updateQuestion } from "@/actions/quizzes"
import { toast } from "@/components/ui/use-toast"

const questionSchema = z.object({
    question: z.string().min(1, "Question text is required"),
    type: z.enum(["single", "multiple", "true_false"]),
    explanation: z.string().optional().default(""),
    points: z.number().min(0).max(100),
    options: z.array(z.object({
        id: z.string(),
        text: z.string().min(1, "Option text is required"),
        isCorrect: z.boolean()
    })).min(2, "At least two options are required")
}).refine((data) => {
    if (data.type === "single") {
        return data.options.filter(opt => opt.isCorrect).length === 1;
    }
    if (data.type === "multiple") {
        return data.options.filter(opt => opt.isCorrect).length >= 1;
    }
    return true;
}, {
    message: "Please select at least one correct answer",
    path: ["options"]
});

interface QuestionFormDialogProps {
    quizId: string;
    open: boolean
    onClose: () => void
    onSave: (question: QuestionFormData) => void
    initialQuestion?: Question
}

export function QuestionFormDialog({ quizId, open, onClose, onSave, initialQuestion }: QuestionFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<QuestionFormData>({
        resolver: zodResolver(questionSchema),
        defaultValues: initialQuestion || {
            question: "",
            type: "single",
            explanation: "",
            points: 1,
            options: [
                { id: "1", text: "", isCorrect: false },
                { id: "2", text: "", isCorrect: false }
            ]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "options"
    });

    const questionType = form.watch("type");
    const options = form.watch("options");

    const verifyOptions = () => {
        console.log("=== OPTIONS VERIFICATION ===");
        console.log("Current Options:", options);
        console.log("Question Type:", questionType);

        const correctOptions = options.filter(opt => opt.isCorrect);
        console.log("Correct Options:", correctOptions);
        console.log("Correct Count:", correctOptions.length);

        if (questionType === "single" && correctOptions.length !== 1) {
            console.warn("❌ SINGLE CHOICE: Should have exactly 1 correct option");
        } else if (questionType === "multiple" && correctOptions.length < 1) {
            console.warn("❌ MULTIPLE CHOICE: Should have at least 1 correct option");
        } else if (questionType === "true_false" && correctOptions.length !== 1) {
            console.warn("❌ TRUE/FALSE: Should have exactly 1 correct option");
        } else {
            console.log("✅ Options validation passed");
        }
        console.log("=== END VERIFICATION ===");
    };

    useEffect(() => {
        if (options && options.length > 0) {
            verifyOptions();
        }
    }, [options, questionType]);

    const handleMultipleChoiceChange = (index: number, checked: boolean) => {
        const newOptions = [...options];
        newOptions[index].isCorrect = checked;
        form.setValue("options", newOptions);
    };

    const handleTrueFalseChange = (value: string) => {
        form.setValue("options", [
            { id: "1", text: "True", isCorrect: value === "true" },
            { id: "2", text: "False", isCorrect: value === "false" },
        ]);
    };

    const addNewOption = () => {
        append({
            id: Math.random().toString(),
            text: "",
            isCorrect: false
        });
    };

    const removeOption = (index: number) => {
        if (fields.length > 2) {
            remove(index);
        }
    };

    const onSubmit = async (data: QuestionFormData) => {
        verifyOptions();

        try {
            setIsSubmitting(true)
            const result = initialQuestion?.id
                ? await updateQuestion(initialQuestion.id, data)
                : await addQuestionToQuiz(quizId, data)

            if (result.success) {
                toast({
                    title: result.message,
                })
                form.reset({
                    question: "",
                    type: "single",
                    explanation: "",
                    points: 1,
                    options: [
                        { id: "1", text: "", isCorrect: false },
                        { id: "2", text: "", isCorrect: false }
                    ]
                });
                onClose();
            } else {
                toast({
                    title: "Failed to save question",
                    description: result.message,
                })
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        if (initialQuestion) {
            form.reset(initialQuestion)
        }
    }, [initialQuestion, form])

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto lg:max-w-screen-lg">
                <DialogHeader>
                    <DialogTitle>
                        {initialQuestion ? 'Edit Question' : 'Add New Question'}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Question Text Field */}
                        <FormField
                            control={form.control}
                            name="question"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Question Text</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter your question" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Question Type Field */}
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Question Type</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={(value: "single" | "multiple" | "true_false") => {
                                                field.onChange(value);
                                                if (value === "true_false") {
                                                    form.setValue("options", [
                                                        { id: "1", text: "True", isCorrect: false },
                                                        { id: "2", text: "False", isCorrect: false },
                                                    ]);
                                                } else if (!initialQuestion || options.length < 2) {
                                                    form.setValue("options", [
                                                        { id: "1", text: "", isCorrect: false },
                                                        { id: "2", text: "", isCorrect: false }
                                                    ]);
                                                }
                                            }}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="single" id="single" />
                                                <Label htmlFor="single">Single Choice</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="multiple" id="multiple" />
                                                <Label htmlFor="multiple">Multiple Choice</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="true_false" id="true_false" />
                                                <Label htmlFor="true_false">True/False</Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Options for Single/Multiple Choice */}
                        {(questionType === "single" || questionType === "multiple") && (
                            <div className="space-y-4">
                                <Label>Options</Label>

                                {questionType === "single" ? (
                                    <RadioGroup
                                        value={options.findIndex(opt => opt.isCorrect)?.toString() || ""}
                                        onValueChange={(value) => {
                                            const newOptions = options.map((opt, i) => ({
                                                ...opt,
                                                isCorrect: i.toString() === value
                                            }));
                                            form.setValue("options", newOptions);
                                        }}
                                        className="space-y-3"
                                    >
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="flex items-center gap-2">
                                                <RadioGroupItem value={index.toString()} />

                                                <FormField
                                                    control={form.control}
                                                    name={`options.${index}.text`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder={`Option ${index + 1}`}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeOption(index)}
                                                    disabled={fields.length <= 2}
                                                >
                                                    <X className="size-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                ) : (
                                    // Multiple choice layout
                                    <>
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="flex items-center gap-2">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={options[index]?.isCorrect || false}
                                                        onCheckedChange={(checked) =>
                                                            handleMultipleChoiceChange(index, !!checked)
                                                        }
                                                    />
                                                </FormControl>

                                                <FormField
                                                    control={form.control}
                                                    name={`options.${index}.text`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder={`Option ${index + 1}`}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeOption(index)}
                                                    disabled={fields.length <= 2}
                                                >
                                                    <X className="size-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </>
                                )}

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={addNewOption}
                                >
                                    <Plus className="mr-2 size-4" />
                                    Add Option
                                </Button>
                            </div>
                        )}

                        {/* True/False Options */}
                        {questionType === "true_false" && (
                            <FormField
                                control={form.control}
                                name="options"
                                render={({ field }) => {
                                    const correctOption = options.find(opt => opt.isCorrect);
                                    const selectedValue = correctOption?.text?.toLowerCase() || "";

                                    return (
                                        <FormItem>
                                            <FormLabel>Correct Answer</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    value={selectedValue}
                                                    onValueChange={handleTrueFalseChange}
                                                    className="flex flex-col space-y-1"
                                                >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="true" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">True</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="false" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">False</FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                        )}

                        {/* Rest of the form fields (explanation, points, etc.) */}
                        <FormField
                            control={form.control}
                            name="explanation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Answer Explanation</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Explain why the correct answer(s) is/are correct..."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="points"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Points</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={e => {
                                                const val = e.target.value;
                                                field.onChange(val === '' ? '' : Number(val));
                                            }}
                                            min={0}
                                            max={100}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : initialQuestion ? 'Save Changes' : 'Add Question'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}