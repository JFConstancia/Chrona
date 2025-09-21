import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text
} from '@react-email/components'
import React from 'react'
import { ReactElement } from "react"

type Props = { code: string }
const verifyUrl = 'https://www.chrona-assistant.com/verify?token=YOUR_TOKEN'
const supportEmail = 'emily@chrona-assistant.com'

export const VerifyEmailTemplate = ({ code }: Props): ReactElement => (
  <Html>
    <Head />
    <Preview>Verify your email to finish setting up Chrona Assistant</Preview>
    <Tailwind>
      <Body className="bg-gray-50 m-0 p-4">
        <Container className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm">
          <Section className="mb-6">
            <Heading className="m-0 text-2xl font-semibold text-gray-900">
              Confirm your email
            </Heading>

            <Text className="mt-2 text-gray-600">
              Hi there, please verify your email to activate your account.
            </Text>

            <div className="mt-5">
              <Link
                href={verifyUrl}
                className="inline-block rounded-lg bg-cyan-600 px-5 py-3 text-base font-medium text-white no-underline"
              >
                Verify email
              </Link>
            </div>

            {code ? (
              <>
                <Text className="mt-6 text-gray-600">
                  Or enter this code in the app:
                </Text>
                <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-center text-2xl font-mono tracking-widest text-gray-900">
                  {code}
                </div>
              </>
            ) : null}

            <Text className="mt-6 text-xs text-gray-500">
              If you didn’t create an account, you can safely ignore this email.
            </Text>
          </Section>

          <Hr className="my-6 border-gray-200" />

          <Section>
            <Text className="mt-3 text-xs leading-5 text-gray-500">
              Questions? Contact{' '}
              <Link
                href={`mailto:${supportEmail}`}
                className="text-indigo-600 underline"
              >
                {supportEmail}
              </Link>.
            </Text>

            <Text className="mt-1 text-xs leading-5 text-gray-400">
              © {new Date().getFullYear()} Chrona. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
)

export default VerifyEmailTemplate