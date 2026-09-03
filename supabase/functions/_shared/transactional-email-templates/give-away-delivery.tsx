import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  title?: string
  link?: string
}

const GiveAwayDeliveryEmail = ({ title = '', link = '#' }: Props) => (
  <Html lang="nl" dir="ltr">
    <Head />
    <Preview>{title ? `${title} — open en print` : 'Open en print je template'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>
          B2B<span style={{ color: '#E8945A' }}>GroeiMachine</span>
        </Text>
        <Heading style={heading}>{title}</Heading>
        <Text style={paragraph}>
          Open de template hieronder. Met "Print / PDF" maak je er direct een A4 van.
        </Text>
        <Button href={link} style={button}>
          Open template
        </Button>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: GiveAwayDeliveryEmail,
  subject: (data: Record<string, any>) => `${data.title ?? ''} — open en print`,
  displayName: 'Give-away levering',
  previewData: {
    title: 'ICP Canvas',
    link: 'https://www.b2bgroeimachine.io/give-aways/icp-canvas?u=1',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', color: '#121212', fontFamily: 'Inter, Arial, sans-serif', padding: '24px' }
const container = {
  maxWidth: '520px',
  margin: '0 auto',
  border: '1px solid #eeeeee',
  borderRadius: '12px',
  padding: '32px',
}
const brand = { fontFamily: "'Space Grotesk', Arial, sans-serif", fontWeight: 700, fontSize: '18px', margin: '0' }
const heading = {
  fontFamily: "'Space Grotesk', Arial, sans-serif",
  fontWeight: 700,
  fontSize: '22px',
  margin: '18px 0 6px',
}
const paragraph = { color: '#555555', lineHeight: '1.6', margin: '0 0 18px' }
const button = {
  background: '#E8945A',
  color: '#121212',
  textDecoration: 'none',
  padding: '12px 20px',
  borderRadius: '8px',
  fontFamily: "'Space Grotesk', Arial, sans-serif",
  fontWeight: 600,
  display: 'inline-block',
  margin: '6px 0',
}
