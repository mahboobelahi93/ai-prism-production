export interface Infrastructure {
  id: string;
  heading: string;
  description: string;
  descriptionUrl?: string;
  image?: string;
}

export const infrastructures: Infrastructure[] = [
  {
    id: "1",
    heading:
      "Tampere University’s Future Automation Systems and Technologies Laboratory (FAST-Lab)",
    description:
      "An industrial environment with two assembly lines, different robots equipped with smart grippers, collaborative robots, and teaching by demonstration station",
    descriptionUrl: "https://research.tuni.fi/fast/environments/",
    image:
      "https://aiprism-prod-bucket.s3.eu-north-1.amazonaws.com/infrastructures/Tampere-university_pic.jpg",
  },
  {
    id: "2",
    heading: "ITI’s Data Innovation Space",
    description:
      "Big Data and AI infrastructure to facilitate development, testing and deployment of AI-PRISM solutions.",
    descriptionUrl: "https://datahub.iti.upv.es/",
    image:
      "https://aiprism-prod-bucket.s3.eu-north-1.amazonaws.com/infrastructures/IT-Data_pic.jpg",
  },
  {
    id: "3",
    heading: "UPV’s Smart Manufacturing Cyber-physical Lab",
    description:
      "Fully automated manufacturing line and automated warehouse equipped withedge computers, mobile robots, and collaborative robots.",
    descriptionUrl: "https://rob4ind.upv.es/",
    image:
      "https://aiprism-prod-bucket.s3.eu-north-1.amazonaws.com/infrastructures/UPV_pic.jpg",
  },
  {
    id: "4",
    heading: "PROF’s Cognitive Factory Lab",
    description:
      "A research and development environment for robotic systems. It offers different robots for experimentation.",
    descriptionUrl:
      "https://www.profactor.at/forschung/industrielle-automatisierungssysteme/human-centered-computing/projekte-archiv/smart-factory-lab/",
    image:
      "https://aiprism-prod-bucket.s3.eu-north-1.amazonaws.com/infrastructures/PROF_pic.jpg",
  },
];
