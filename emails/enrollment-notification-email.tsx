import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface EnrollmentStatusEmailProps {
  userName: string;
  pilotTitle: string;
  status: "approved" | "rejected";
  ownerEmail: string;
}

export const EnrollmentStatusEmail = ({
  userName,
  pilotTitle,
  status,
  ownerEmail,
}: EnrollmentStatusEmailProps) => {
  const statusColor = status === "approved" ? "green" : "red";
  const statusText = status === "approved" ? "Approved" : "Rejected";

  return (
    <Html>
      <Head />
      <Preview>
        Your enrollment for {pilotTitle} has been {statusText}
      </Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-4 max-w-2xl rounded-lg bg-white p-8 shadow-lg">
            <Heading className="mb-6 text-2xl font-bold text-gray-800">
              Enrollment Status Update - AI-PRISM
            </Heading>
            <Text className="mb-4 text-gray-700">Hello,</Text>
            <Text className="mb-2 text-gray-700">
              Your enrollment request for the following pilot course has been{" "}
              {status}:
            </Text>
            <Section className="mb-2 rounded-md bg-blue-50 p-4">
              <Text className="text-lg font-semibold text-blue-600">
                {pilotTitle}
              </Text>
            </Section>
            <Section className={`mb-6 rounded-md bg-${statusColor}-50 p-4`}>
              <Text className={`text-${statusColor}-600 font-semibold`}>
                Status: {statusText}
              </Text>
            </Section>
            {status === "approved" ? (
              <Text className="mb-6 text-gray-700">
                You can now access the course materials and start your learning
                journey.
              </Text>
            ) : (
              <Text className="mb-6 text-gray-700">
                If you have any questions regarding this decision, please
                contact the pilot owner {ownerEmail}.
              </Text>
            )}
            <Hr className="my-6 border-gray-300" />
            <Section className="text-center">
              <Button
                href="https://ai-prism.dev/dashboard"
                className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white no-underline"
              >
                Go to Dashboard
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EnrollmentStatusEmail;
