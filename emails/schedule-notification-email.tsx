import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface ScheduleNotificationEmailProps {
  pilot: string;
  requestedTime: Date;
  currentUserEmail: string;
  message: string;
}

export const ScheduleNotificationEmail = ({
  pilot,
  requestedTime,
  currentUserEmail,
  message,
}: ScheduleNotificationEmailProps) => {
  const formattedDate = new Date(requestedTime).toLocaleString("en-FI", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Helsinki",
    timeZoneName: "short",
  });
  return (
    <Html>
      <Head />
      <Preview>New Schedule Email for {pilot}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-8 rounded-lg border border-gray-200 bg-white p-8 shadow-md">
            <Heading className="mb-4 text-center text-2xl font-bold text-gray-800">
              AI-PRISM
            </Heading>
            <Text className="mb-4 text-center text-lg font-semibold text-gray-700">
              New Subscription Request
            </Text>

            <Hr className="my-6 border-gray-200" />

            <Section className="mb-6">
              <Text className="mb-4 text-gray-700">
                You have received a new schedule request.
              </Text>

              <Container className="rounded-md border border-gray-200 bg-gray-50 p-4">
                <Text className="font-medium text-gray-800">
                  Pilot: <span className="font-bold">{pilot}</span>
                </Text>
                <Text className="font-medium text-gray-800">
                  Requested Time (Helsinki time / GMT+2):{" "}
                  <span className="font-bold">{formattedDate}</span>
                </Text>
                <Text className="font-medium text-gray-800">
                  Requester Email:{" "}
                  <span className="font-bold">{currentUserEmail}</span>
                </Text>
                <Text className="font-medium text-gray-800">
                  Message: <span className="font-bold">{message}</span>
                </Text>
              </Container>
            </Section>

            <Text className="mb-6 text-gray-700">
              Please review this request at your earliest convenience. You can
              accept or Schedule later from your dashboard.
            </Text>

            <Section className="text-center">
              <Button
                href="https://localhost:3000/schedule/pilot-user"
                className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white no-underline"
              >
                Manage Subscriptions
              </Button>
            </Section>

            <Hr className="my-6 border-gray-200" />

            <Text className="text-center text-sm text-gray-500">
              This is an automated message from AI-PRISM. Please do not reply to
              this email.
            </Text>

            <Text className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} AI-PRISM. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ScheduleNotificationEmail;
