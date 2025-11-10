"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { ChevronRight, ExternalLink } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { solutions, subcategoryDescriptions } from "@/app/data/solutions";

export default function SolutionsContent() {
  // Add loading state
  const [isLoading, setIsLoading] = useState(true);

  // Create a nested structure for categories and subcategories
  const categoriesWithSubcategories = solutions.reduce(
    (acc, solution) => {
      const category = solution.category || "Others";
      const subcategory = solution.subcategory || "General";

      if (!acc[category]) {
        acc[category] = {};
      }

      if (!acc[category][subcategory]) {
        acc[category][subcategory] = [];
      }

      acc[category][subcategory].push(solution);
      return acc;
    },
    {} as Record<string, Record<string, typeof solutions>>,
  );

  const categories = Object.keys(categoriesWithSubcategories).sort();
  console.log(categories);

  // Add state for tracking active category and subcategory
  const [activeCategory, setActiveCategory] = useState(categories[0] || "");
  const [activeSubcategory, setActiveSubcategory] = useState("");
  const [expandedCategory, setExpandedCategory] = useState(categories[0] || "");

  useEffect(() => {
    const subcategories = Object.keys(
      categoriesWithSubcategories[activeCategory] || {},
    ).sort();

    const subcategoryExists = subcategories.includes(activeSubcategory);

    if (subcategories.length > 0 && !subcategoryExists) {
      setActiveSubcategory(subcategories[0]);
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [activeCategory, activeSubcategory, categoriesWithSubcategories]);

  // Handle category selection
  const handleCategorySelect = (category: string, e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      e.stopPropagation();
    }

    if (activeCategory !== category) {
      setActiveCategory(category);
      setExpandedCategory(category); // Ensure category expands when selected
      setIsLoading(true);
    }
  };

  const handleSubcategorySelect = (
    subcategory: string,
    e: React.MouseEvent,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (activeSubcategory !== subcategory) {
      setActiveSubcategory(subcategory);
      setIsLoading(true);

      setTimeout(() => setIsLoading(false), 300);
    }
  };

  // Get subcategories for the active category
  const subcategories = activeCategory
    ? Object.keys(categoriesWithSubcategories[activeCategory] || {}).sort()
    : [];

  // Get solutions for the active category and subcategory
  const activeSolutions =
    activeCategory && activeSubcategory
      ? categoriesWithSubcategories[activeCategory][activeSubcategory] || []
      : [];

  return (
    <TooltipProvider delayDuration={0}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Solutions</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="sticky top-4">
              {/* <h2 className="mb-4 text-lg font-medium">Categories</h2> */}
              <Accordion
                type="single"
                defaultValue={expandedCategory}
                value={expandedCategory}
                onValueChange={setExpandedCategory}
                collapsible
                className="w-full"
              >
                {categories.map((category) => (
                  <AccordionItem key={category} value={category}>
                    <AccordionTrigger
                      className={`text-left ${activeCategory === category ? "font-medium text-primary" : ""}`}
                      onClick={(e) => handleCategorySelect(category, e)}
                    >
                      {category}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1 border-l-2 border-muted pl-2">
                        {Object.keys(
                          categoriesWithSubcategories[category] || {},
                        )
                          .sort()
                          .map((subcategory) => (
                            <button
                              key={subcategory}
                              className={`flex w-full cursor-pointer items-center rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                                activeCategory === category &&
                                activeSubcategory === subcategory
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-muted"
                              }`}
                              onClick={(e) =>
                                handleSubcategorySelect(subcategory, e)
                              }
                            >
                              <ChevronRight className="mr-1.5 h-3.5 w-3.5" />
                              <span className="flex-1">{subcategory}</span>
                              <span
                                className={`ml-auto text-xs ${
                                  activeCategory === category &&
                                  activeSubcategory === subcategory
                                    ? "text-primary-foreground/70"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {
                                  categoriesWithSubcategories[category][
                                    subcategory
                                  ].length
                                }
                              </span>
                            </button>
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">
                  {activeCategory}{" "}
                  {activeSubcategory && `/ ${activeSubcategory}`}
                </h2>

                {activeCategory && activeSubcategory && (
                  <div className="mt-4 rounded-lg border bg-muted/30 p-4">
                    {/* <h3 className="mb-2 text-lg font-medium">
                    About this subcategory
                  </h3> */}
                    <p className="text-muted-foreground">
                      {subcategoryDescriptions[activeCategory]?.[
                        activeSubcategory
                      ] ||
                        `This subcategory contains components related to ${activeSubcategory}.`}
                    </p>
                  </div>
                )}
              </div>

              {/* Loading state */}
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-3 rounded-lg border p-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="flex justify-between pt-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {activeSolutions.length > 0 ? (
                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[200px]">
                              Component
                            </TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-[250px] text-right">
                              {/* Manual & Documentation */}
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activeSolutions.map((solution) => (
                            <TableRow key={solution.id}>
                              <TableCell className="font-medium">
                                <a
                                  href={`/resources/solutions/${solution.id}`}
                                  className="text-primary hover:underline"
                                >
                                  {solution.name}
                                </a>
                              </TableCell>
                              <TableCell className="max-w-md">
                                {solution.description}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {/* Manuals Button */}
                                  <Button variant="outline" size="sm" asChild>
                                    <a
                                      href={
                                        solution.manualUrl ||
                                        `/resources/solutions/${solution.id}/manuals`
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center"
                                    >
                                      Manuals
                                      <ExternalLink className="ml-1 h-3 w-3" />
                                    </a>
                                  </Button>

                                  {/* Documentation Button with tooltip if URL is missing */}
                                  {solution.documentationUrl ? (
                                    <Button variant="outline" size="sm" asChild>
                                      <a
                                        href={solution.documentationUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center"
                                      >
                                        Documentation
                                        <ExternalLink className="ml-1 h-3 w-3" />
                                      </a>
                                    </Button>
                                  ) : (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          disabled
                                        >
                                          Documentation
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        No documentation available
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="flex h-40 items-center justify-center rounded-lg border">
                      <p className="text-muted-foreground">
                        No solutions found in this subcategory.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
