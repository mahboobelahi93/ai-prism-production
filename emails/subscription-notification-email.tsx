import * as React from "react";
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

interface SubscriptionNotificationEmailProps {
  pilotTitle: string;
  userName: string;
  userEmail: string;
}

export const SubscriptionNotificationEmail = ({
  pilotTitle,
  userName,
  userEmail,
}: SubscriptionNotificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New Subscription Request for {pilotTitle}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-8 max-w-2xl rounded-lg bg-white p-8 shadow-lg">
            <Heading className="mb-6 text-2xl font-bold text-gray-800">
              New Subscription Request from - AI-PRISM
            </Heading>
            <Text className="mb-4 text-gray-700">Dear Pilot Owner,</Text>
            <Text className="mb-2 text-gray-700">
              A user has requested to enroll in your pilot course:
            </Text>
            <Section className="mb-2 rounded-md bg-blue-50 p-4">
              <Text className="text-lg font-semibold text-blue-600">
                {pilotTitle}
              </Text>
            </Section>
            <Text className="mb-2 text-gray-700">User Details:</Text>
            <Section className="mb-6 rounded-md bg-gray-50 p-4">
              <Text className="text-gray-700">
                <span className="font-semibold">Email:</span> {userEmail}
              </Text>
            </Section>
            <Text className="mb-6 text-gray-700">
              Please review the subscription request and take appropriate
              action.
            </Text>
            <Hr className="my-6 border-gray-300" />
            <Section className="text-center">
              <Button
                href="https://www.ai-prism.dev/login"
                className="rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white no-underline"
              >
                Manage Subscriptions
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default SubscriptionNotificationEmail;
