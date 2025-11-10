"use client";

import { useState } from "react";
import { ArrowRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const demonstrators = [
  {
    category: "Furniture Manufacturing",
    location: "Spain",
    partners: [
      {
        name: "Andreu",
        logo: "/logo/andreu.png",
      },
      {
        name: "Universitat Politècnica de València",
        logo: "/logo/univalencia.png",
      },
      {
        name: "COMAU",
        logo: "/logo/univalencia.png",
      },
      {
        name: "Robotnik",
        logo: "/logo/iti.png",
      },
    ],
    challenge:
      "Painting and sanding processes are performed manually by skilled operators. Some furniture pieces require elaborate painting which is difficult to automate.",
    solution:
      "Cobots learn different tasks by human demonstration such as picking, loading, unloading, painting, and sanding, allowing humans to focus on higher value-added tasks.",
    results: [
      "20% increase in painting process productivity",
      "50% decrease in quality defects",
    ],
  },

  {
    category: "Home Appliances",
    location: "Turkey",
    partners: [
      {
        name: "Silverline",
        logo: "/logo/silverline.png",
      },
      {
        name: "TEKNOPAR",
        logo: "/logo/teknopar.png",
      },
    ],
    challenge:
      "Manufacturing of classical & chimney hoods, gas hobs and built-in ovens requires precision and flexibility. The company has 1800 employees across 103,000 m² of manufacturing space in Merzifon, Turkey.",
    solution:
      "AI-powered human-robot collaboration enables flexible production processes with cobots that learn from operators, improving safety and efficiency in appliance manufacturing.",
    results: [
      "Enhanced production flexibility",
      "Improved worker safety through AI-based collision avoidance",
      "Reduced programming complexity through demonstration learning",
    ],
  },
  {
    category: "Electronics",
    location: "Poland",
    partners: [
      {
        name: "VIGO Photonics",
        logo: "/logo/vigo.png",
      },
      {
        name: "Warsaw University of Technology",
        logo: "/logo/lukasiewicz.png",
      },
    ],
    challenge:
      "Semiconductor materials and photonic instruments manufacturing requires precision handling. VIGO specializes in MWIR and LWIR detectors with complete front-end and back-end production lines.",
    solution:
      "AI-enhanced robotics for precise handling of semiconductor materials and detector assembly, with real-time quality monitoring and collaborative human-robot workflows.",
    results: [
      "Sustainability Recognition at European Robotics Forum 2024",
      "Improved precision in detector assembly",
      "Enhanced data collection for quality control",
    ],
  },
  {
    category: "Food & Beverage",
    location: "Greece",
    partners: [
      {
        name: "Athenian Brewery",
        logo: "/logo/athenian.png",
      },
      {
        name: "Wings ICT Solutions",
        logo: "/logo/wings.png",
      },
    ],
    challenge:
      "Brewing production lines are highly automated but some tasks are difficult due to complexity. Workers perform monotonous and strenuous tasks, exposing them to repetitive strain injury or musculoskeletal disorder risks.",
    solution:
      "Cobots learn from human demonstrations to handle tasks including extra labeling, operating forklifts, bottle classification, packing, palletizing custom orders, heavy tasks in filtration, and garbage collection in geofenced areas.",
    results: [
      "30% reduction of workers in heavy task and high-risk areas",
      "50% reduction of OPEX for custom/dynamic tasks",
      "30% reduction of time to execute custom/dynamic tasks",
    ],
  },
  {
    category: "Generic Demonstration Facility",
    location: "Austria",
    partners: [
      {
        name: "KEBA",
        logo: "/logo/keba.png",
      },
      {
        name: "Profactor",
        logo: "/logo/profactor.png",
      },
    ],
    challenge:
      "Providing a flexible demonstration and testing environment for various manufacturing scenarios, enabling technology validation across different industries.",
    solution:
      "Open-access pilot facility offering remote access to equipment, simulation platforms, interactive training, and scheduling optimization for end users across sectors.",
    results: [
      "Platform for testing AI-PRISM solutions across industries",
      "Remote access capabilities for SMEs",
      "Training and certification programs",
    ],
  },
];

export default function DemonstratorsSection() {
  const [selectedDemo, setSelectedDemo] = useState<
    (typeof demonstrators)[0] | null
  >(null);

  return (
    <>
      <section className="border-b border-t border-border bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">
              Industry Demonstrators
            </h2>
            <p className="mx-auto max-w-2xl text-pretty text-muted-foreground">
              Real-world implementations across key manufacturing sectors,
              demonstrating human-robot collaboration with leading industry
              partners.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {demonstrators.map((demo, index) => (
              <Card
                key={index}
                className="group w-full overflow-hidden transition-all hover:shadow-lg md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]"
              >
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="mb-2 text-xl font-semibold">
                      {demo.category}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {demo.location}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="mb-3 text-sm font-medium text-muted-foreground">
                      Partners:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {demo.partners.map((partner, pIndex) => (
                        <div
                          key={pIndex}
                          className="flex items-center justify-center rounded-md border border-border bg-background p-3"
                        >
                          <img
                            src={partner.logo || "/placeholder.svg"}
                            alt={partner.name}
                            className="h-24 w-auto object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="group/btn -ml-3 mt-2 gap-1 text-primary"
                    onClick={() => setSelectedDemo(demo)}
                  >
                    Read More
                    <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <Dialog open={!!selectedDemo} onOpenChange={() => setSelectedDemo(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedDemo?.category}
            </DialogTitle>
            <DialogDescription className="text-base">
              {selectedDemo?.location}
            </DialogDescription>
          </DialogHeader>

          {selectedDemo && (
            <div className="space-y-6 pt-4">
              {/* Partners Grid */}
              <div>
                <h4 className="mb-3 text-lg font-semibold">
                  Participating Partners
                </h4>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {selectedDemo.partners.map((partner, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted/50 p-4"
                    >
                      <div className="flex h-16 items-center justify-center">
                        <img
                          src={partner.logo || "/placeholder.svg"}
                          alt={partner.name}
                          className="max-h-full w-auto object-contain"
                        />
                      </div>
                      <p className="text-center text-xs text-muted-foreground">
                        {partner.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Challenge */}
              <div>
                <h4 className="mb-2 text-lg font-semibold">Challenge</h4>
                <p className="text-muted-foreground">
                  {selectedDemo.challenge}
                </p>
              </div>

              {/* Solution */}
              <div>
                <h4 className="mb-2 text-lg font-semibold">
                  AI-PRISM Solution
                </h4>
                <p className="text-muted-foreground">{selectedDemo.solution}</p>
              </div>

              {/* Results */}
              <div>
                <h4 className="mb-3 text-lg font-semibold">Expected Results</h4>
                <ul className="space-y-2">
                  {selectedDemo.results.map((result, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-muted-foreground"
                    >
                      <span className="mt-1 text-primary">•</span>
                      <span>{result}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
