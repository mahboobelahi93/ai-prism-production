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
        <h2 className="mb-12 text-balance text-center text-3xl font-bold">
          Our Features
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <div className="mb-3 flex justify-center text-primary">
                  {feature.icon}
                </div>
                <CardTitle className="text-balance text-center text-xl">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-balance text-center leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
