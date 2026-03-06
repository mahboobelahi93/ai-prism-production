import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/shared/icons";

const features = [
  {
    title: "Remote Access",
    description:
      "Access our advanced infrastructure from anywhere in the world.",
    icon: <Icons.laptop className="size-6" />,
  },
  {
    title: "Certification Programs",
    description:
      "Gain industry-recognized certifications through our comprehensive training.",
    icon: <Icons.bookOpen className="size-6" />,
  },
  {
    title: "Open Access Pilots",
    description:
      "Participate in cutting-edge pilot programs with our network of partners.",
    icon: <Icons.user className="size-6" />,
  },
];

export default function FeaturesSection() {
  return (
    <section className="border-b border-t border-border bg-background py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-balance text-center text-3xl font-bold md:text-4xl">
          Platform Features
        </h2>

        <p className="mx-auto mb-12 max-w-2xl text-center leading-relaxed text-muted-foreground">
         Discover the key capabilities that support remote access, training, and collaboration across the AI-PRISM platform.
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group flex flex-col rounded-2xl border border-border bg-gradient-to-b from-background to-muted/30 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardHeader>
                <div className="mb-4 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    {feature.icon}
                  </div>
                </div>

                <CardTitle className="text-balance text-center text-xl font-semibold tracking-tight">
                  {feature.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col">
                <p className="text-balance text-center leading-7 text-muted-foreground">
                  {feature.description}
                </p>

                {/* <div className="mt-6 text-center text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  
                </div> */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}