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

interface ScheduleAcceptedEmailProps {
  userName: string;
  pilotTitle: string;
  pilotOwnerEmail: string;
  scheduledDateTime: string;
  message?: string;
}

export const ScheduleAcceptedEmail = ({
  userName,
  pilotTitle,
  pilotOwnerEmail,
  scheduledDateTime,
  message,
}: ScheduleAcceptedEmailProps) => {
  // Format the date for display
  const formattedDate = new Date(scheduledDateTime).toLocaleString("en-FI", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  });

  return (
    <Html>
      <Head />
      <Preview>
        Your schedule request for {pilotTitle} has been accepted
      </Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-4 max-w-2xl rounded-lg bg-white p-8 shadow-lg">
            <Heading className="mb-6 text-2xl font-bold text-gray-800">
              Schedule Accepted - AI-PRISM
            </Heading>
            <Text className="mb-4 text-gray-700">Hello {userName},</Text>
            <Text className="mb-2 text-gray-700">
              Your schedule request for the following pilot has been accepted:
            </Text>
            <Section className="mb-2 rounded-md bg-blue-50 p-4">
              <Text className="text-lg font-semibold text-blue-600">
                {pilotTitle}
              </Text>
            </Section>
            <Section className="mb-6 rounded-md bg-green-50 p-4">
              <Text className="font-semibold text-green-600">
                Status: Accepted
              </Text>
              <Text className="mt-2 text-gray-700">
                <span className="font-medium">Pilot Owner Email:</span>{" "}
                {pilotOwnerEmail}
              </Text>
              <Text className="text-gray-700">
                <span className="font-medium">Scheduled Time:</span>{" "}
                {formattedDate}
              </Text>
            </Section>

            <Text className="mb-6 text-gray-700">
              Please make sure to be available at the scheduled time. If you
              need to reschedule, please contact your pilot owner as soon as
              possible.
            </Text>

            <Hr className="my-6 border-gray-300" />

            <Section className="text-center">
              <Button
                href="https://ai-prism.dev/portal/schedules"
                className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white no-underline"
              >
                View Schedule Details
              </Button>
            </Section>

            <Text className="mt-6 text-center text-sm text-gray-500">
              This is an automated message. Please do not reply to this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ScheduleAcceptedEmail;
