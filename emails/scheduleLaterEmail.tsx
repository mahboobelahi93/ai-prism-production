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

interface ContactLaterEmailProps {
  userName: string;
  pilotTitle: string;
  pilotOwnerEmail: string;
  scheduledDateTime: string;
  message: string;
}

export const ContactLaterEmail = ({
  userName,
  pilotTitle,
  pilotOwnerEmail,
  scheduledDateTime,
  message,
}: ContactLaterEmailProps) => {
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
      <Preview>Follow-up regarding your request for {pilotTitle}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-4 max-w-2xl rounded-lg bg-white p-8 shadow-lg">
            <Heading className="mb-6 text-2xl font-bold text-gray-800">
              Schedule Follow-up - AI-PRISM
            </Heading>
            <Text className="mb-4 text-gray-700">Hello {userName},</Text>
            <Text className="mb-2 text-gray-700">
              Regarding your request for the following pilot:
            </Text>
            <Section className="mb-2 rounded-md bg-blue-50 p-4">
              <Text className="text-lg font-semibold text-blue-600">
                {pilotTitle}
              </Text>
            </Section>
            <Section className="mb-6 rounded-md bg-amber-50 p-4">
              <Text className="font-semibold text-amber-600">
                Status: Pending Follow-up
              </Text>
              <Text className="mt-2 text-gray-700">
                <span className="font-medium">Pilot Owner Email:</span>{" "}
                {pilotOwnerEmail}
              </Text>
            </Section>

            <Section className="mb-6 rounded-md bg-gray-50 p-4">
              <Text className="font-medium text-gray-700">
                Message from Pilot Owner:
              </Text>
              <Text className="text-gray-600">{message}</Text>
            </Section>

            <Text className="mb-6 text-gray-700">
              The PO would like to follow up with you at a later time. Please
              feel free to respond with your availability or preferences on{" "}
              {pilotOwnerEmail}.
            </Text>

            <Hr className="my-6 border-gray-300" />

            <Section className="text-center">
              <Button
                href={`https://ai-prism.dev/schedule/pilot-owner/"}`}
                className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white no-underline"
              >
                Respond to Pilot Owner
              </Button>
            </Section>

            <Text className="mt-6 text-center text-sm text-gray-500">
              This is an automated message from AI-PRISM. Please do not reply
              directly to this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ContactLaterEmail;
