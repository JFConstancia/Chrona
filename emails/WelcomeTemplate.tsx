import React from 'react'
import { Html, Body, Container, Heading, Text, Link, Preview, Tailwind, Section, Head, Hr } from '@react-email/components'
import { ReactElement } from "react"

const supportEmail = 'emily@chrona-assistant.com'
const whatsappConnectUrl = 'https://www.chrona-assistant.com/connect-whatsapp'
const helpWhatsAppUrl = 'https://wa.me/1234567890'

export const WelcomeTemplate = (): ReactElement => (
	<Html>
		<Head />
		<Preview>Welcome to Chrona — your AI WhatsApp assistant for effortless scheduling</Preview>
		<Tailwind>
			<Body className="bg-gray-50 m-0 p-4">
				<Container className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm">
					<Section className="mb-6">
						<Heading className="m-0 text-2xl font-semibold text-gray-900">
							Welcome to <span className="text-cyan-600">Chrona</span>
						</Heading>

						<Text className="mt-2 text-gray-700">
							Hi there, great to have you here! Chrona is your AI assistant that books and manages
							appointments <span className="font-medium">directly via WhatsApp</span> — 24/7.
						</Text>

						<div className="mt-5">
							<Link
								href={whatsappConnectUrl}
								className="inline-block rounded-lg bg-cyan-600 px-5 py-3 text-base font-medium text-white no-underline"
							>
								Connect your WhatsApp number
							</Link>
						</div>

						<Text className="mt-4 text-sm text-gray-600">Quick start (2 min):</Text>

						<ul className="mt-1 list-disc pl-6 text-gray-700">
							<li>Connect your WhatsApp business or personal number</li>
							<li>Set your business hours & service durations</li>
							<li>Share your WhatsApp or let clients message you — Chrona handles the rest</li>
						</ul>

						<Section className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
							<Heading as="h3" className="m-0 text-base font-semibold text-gray-900">What Chrona does for you</Heading>
							<ul className="mt-2 list-disc pl-6 text-gray-700">
								<li>Answers WhatsApp messages instantly with natural language</li>
								<li>Offers real-time availability and books slots automatically</li>
								<li>Sends confirmations, reminders, and reschedule links</li>
								<li>Syncs with your calendar to prevent double-bookings</li>
							</ul>
						</Section>

						<div className="mt-6">
							<Link
								href={whatsappConnectUrl}
								className="inline-block rounded-lg bg-cyan-600 px-5 py-3 text-base font-medium text-white no-underline"
							>
								Connect your WhatsApp number
							</Link>
						</div>
					</Section>

					<Hr className="my-6 border-gray-200" />

					<Section>
						<Text className="text-xs leading-5 text-gray-500">
							Need help? Chat with us on WhatsApp:{' '}

							<Link href={helpWhatsAppUrl} className="text-emerald-700 underline">{helpWhatsAppUrl}</Link>{' '}

							or email{' '}

							<Link href={`mailto:${supportEmail}`} className="text-emerald-700 underline">{supportEmail}</Link>.
						</Text>

						<Text className="mt-1 text-[11px] leading-5 text-gray-400">
							By using Chrona you agree to our terms and privacy policy. Message and data rates may apply on WhatsApp.
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

export default WelcomeTemplate