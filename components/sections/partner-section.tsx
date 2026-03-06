"use client";

import { useEffect, useMemo, useState } from "react";
import { Armchair, ChefHat, Cpu, Factory, Home } from "lucide-react";

type AllianceLogo = {
  name: string;
  href?: string;
  src: string;
};

function AllianceLogoCarousel({
  logos,
  autoPlay = true,
  intervalMs = 3000,
}: {
  logos: AllianceLogo[];
  autoPlay?: boolean;
  intervalMs?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const visibleCount = 4;

  const safeLogos = useMemo(() => {
    if (logos.length === 0) return [];

    if (logos.length > visibleCount) {
      return logos;
    }

    const repeated = [...logos];
    while (repeated.length < visibleCount) {
      repeated.push(...logos);
    }

    return repeated.slice(0, visibleCount);
  }, [logos]);

  const maxIndex = Math.max(safeLogos.length - visibleCount, 0);

  useEffect(() => {
    if (!autoPlay || isHovered || safeLogos.length <= visibleCount) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [autoPlay, intervalMs, isHovered, maxIndex, safeLogos.length, visibleCount]);

  const goNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  if (safeLogos.length === 0) return null;

  return (
    <div
      className="relative mx-auto w-full max-w-[1400px] rounded-2xl border border-border bg-background px-10 py-12 shadow-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        onClick={goPrev}
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-background px-3 py-2 text-lg shadow transition hover:bg-muted"
        aria-label="Previous logos"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={goNext}
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-background px-3 py-2 text-lg shadow transition hover:bg-muted"
        aria-label="Next logos"
      >
        ›
      </button>

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
          }}
        >
          {safeLogos.map((logo, idx) => {
            const content = (
              <div className="flex h-36 w-full items-center justify-center rounded-xl border border-border bg-muted/30 p-6 transition hover:shadow-md">
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="max-h-24 w-auto object-contain"
                  loading="lazy"
                />
              </div>
            );

            return (
              <div
                key={`${logo.name}-${idx}`}
                className="flex w-1/4 shrink-0 items-center justify-center px-4"
              >
                {logo.href ? (
                  <a
                    href={logo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={logo.name}
                    aria-label={logo.name}
                    className="w-full"
                  >
                    {content}
                  </a>
                ) : (
                  <div title={logo.name} aria-label={logo.name} className="w-full">
                    {content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {maxIndex > 0 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                idx === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const allianceMembers: AllianceLogo[] = [
  {
    name: "AI EDIH",
    href: "https://www.aiedihturkiye.com/en",
    src: "/logo/alliance_logo/AIEDIH.png",
  },
  {
    name: "ALBICT",
    href: "https://albict.al/",
    src: "/logo/alliance_logo/ALBICT.png",
  },
  {
    name: "Better Quest",
    href: "https://betterquests.com/",
    src: "/logo/alliance_logo/BQ.jpg",
  },
  {
    name: "EDIH4 Marche",
    href: "https://www.edih4marche.eu/en/",
    src: "/logo/alliance_logo/DIHM.png",
  },
  {
    name: "DigitMAK",
    href: "https://digitmak.mk/",
    src: "/logo/alliance_logo/DM.png",
  },
  {
    name: "Institute of Electronics and Computer Science",
    href: "https://ai4csm.eu/index.php",
    src: "/logo/alliance_logo/EDI.png",
  },
  {
    name: "GDANSK University of Technology",
    href: "https://pg.edu.pl/en",
    src: "/logo/alliance_logo/GU.jpg",
  },
  {
    name: "IFAR LAB",
    href: "https://ifarlab.ogu.edu.tr/",
    src: "/logo/alliance_logo/ILE.jpg",
  },
  {
    name: "it_dnlpro",
    href: "https://itdni.pro/en/",
    src: "/logo/alliance_logo/ITD.png",
  },
  {
    name: "LEANISTIC",
    href: "https://www.leanistic.com/",
    src: "/logo/alliance_logo/LLW.jpg",
  },
  {
    name: "REDx Edge",
    href: "https://www.redxedge.com/",
    src: "/logo/alliance_logo/rdx.jpg",
  },
  {
    name: "South Africa Eye",
    src: "/logo/alliance_logo/SAE.jpg",
  },
  {
    name: "School of Electrical Engineering, University of Belgrad",
    href: "https://www.etf.bg.ac.rs/en",
    src: "/logo/alliance_logo/SEEB.png",
  },
  {
    name: "Tecnalia",
    href: "https://www.tecnalia.com/en",
    src: "/logo/alliance_logo/tecnalia.png",
  },
  {
    name: "Technical University Cluj Napoca",
    href: "https://www.utcluj.ro/en/",
    src: "/logo/alliance_logo/TechnicalUniversityClujNapoca.png",
  },
  {
    name: "Katty Fashion",
    href: "https://katty-fashion.com/",
    src: "/logo/alliance_logo/KFrebrandingLogo.png",
  },
  {
    name: "Jackdaw Studio",
    href: "https://jackdaw-studio.ro/",
    src: "/logo/alliance_logo/JackdawStudio.png",
  },
  {
    name: "IoTiX",
    href: "https://iotix.ro/",
    src: "/logo/alliance_logo/IoTiX_logo_black.png",
  },
  {
    name: "Cadran",
    href: "https://cadrantechnologies.eu/",
    src: "/logo/alliance_logo/CadranTechnologies.png",
  },
  {
    name: "Bioeuro",
    href: "https://bioeuro.ro/",
    src: "/logo/alliance_logo/Bioeuro.png",
  },
  {
    name: "Babes Bolyai University",
    href: "https://www.ubbcluj.ro/en/",
    src: "/logo/alliance_logo/BabesBolyaiUniversity.png",
  },
];

const demonstrators = [
  {
    category: "Furniture Manufacturing",
    location: "Spain",
    icon: <Armchair className="h-5 w-5 text-primary" />,
    partners: [
      { name: "Andreu", logo: "/logo/andreu.png" },
      { name: "Universitat Politècnica de València", logo: "/logo/univalencia.png" },
      { name: "COMAU", logo: "/logo/univalencia.png" },
      { name: "Robotnik", logo: "/logo/iti.png" },
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
    icon: <Home className="h-5 w-5 text-primary" />,
    partners: [
      { name: "Silverline", logo: "/logo/silverline.png" },
      { name: "TEKNOPAR", logo: "/logo/teknopar.png" },
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
    icon: <Cpu className="h-5 w-5 text-primary" />,
    partners: [
      { name: "VIGO Photonics", logo: "/logo/vigo.png" },
      { name: "Warsaw University of Technology", logo: "/logo/lukasiewicz.png" },
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
    icon: <ChefHat className="h-5 w-5 text-primary" />,
    partners: [
      { name: "Athenian Brewery", logo: "/logo/athenian.png" },
      { name: "Wings ICT Solutions", logo: "/logo/wings.png" },
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
    icon: <Factory className="h-5 w-5 text-primary" />,
    partners: [
      { name: "KEBA", logo: "/logo/keba.png" },
      { name: "Profactor", logo: "/logo/profactor.png" },
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
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0);
  const selectedDemo = demonstrators[selectedDemoIndex];

  return (
    <>
      <section className="border-b border-t border-border bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">
              Alliance Members
            </h2>
            <p className="mx-auto max-w-2xl text-pretty text-muted-foreground">
              See the prestigious members of the AI-PRISM Alliance.
            </p>
          </div>

          <AllianceLogoCarousel logos={allianceMembers} intervalMs={3000} />
        </div>
      </section>

      <section className="border-b border-t border-border bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">
              Industry Demonstrators
            </h2>
            <p className="mx-auto max-w-2xl text-pretty text-muted-foreground">
              Real-world pilot implementations showcasing how AI-PRISM enables human–robot collaboration across
               diverse manufacturing sectors with leading industrial partners.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4">
              {demonstrators.map((demo, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDemoIndex(index)}
                  className={`w-full rounded-xl border p-5 text-left transition ${
                    selectedDemoIndex === index
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "bg-background hover:bg-muted"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      {demo.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-lg">{demo.category}</div>
                      <div className="text-sm text-muted-foreground">
                        {demo.location}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {demo.partners.slice(0, 3).map((partner, pIndex) => (
                      <div
                        key={pIndex}
                        className="flex h-14 w-24 items-center justify-center rounded-md border border-border bg-background p-3"
                      >
                        <img
                          src={partner.logo || "/placeholder.svg"}
                          alt={partner.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-2 rounded-2xl border border-border border-l-4 border-l-primary bg-gradient-to-b from-background to-muted/30 p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  {selectedDemo.icon}
                </div>

                <div>
                  <h3 className="text-2xl font-semibold">
                   Pilot Demonstrator: {selectedDemo.category}
                  </h3>
                  <p className="text-muted-foreground">{selectedDemo.location}</p>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="mb-3 text-lg font-semibold">
                  Participating Partners
                </h4>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {selectedDemo.partners.map((partner, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/40 p-4"
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

              <div className="mb-6">
                <h4 className="mb-2 text-lg font-semibold">🚨 Challenge</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedDemo.challenge}
                </p>
              </div>

              <div className="mb-6 border-t border-border pt-6">
                <h4 className="mb-2 text-lg font-semibold">
                  🤖AI-PRISM Approach
                </h4>
                <p className="text-muted-foreground leading-relaxed">{selectedDemo.solution}</p>
              </div>

              <div className="mb-6 border-t border-border pt-6">
                <h4 className="mb-3 text-lg font-semibold">📊Impact & Outcomes</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedDemo.results.map((result, index) => (
                    <span
                      key={index}
                      className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary shadow-sm transition-transform hover:scale-[1.03]"
                    >
                      {result}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}