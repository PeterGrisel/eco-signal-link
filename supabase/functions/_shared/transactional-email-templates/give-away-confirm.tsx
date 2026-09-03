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
  confirmUrl?: string
}

const GiveAwayConfirmEmail = ({ title = '', confirmUrl = '#' }: Props) => (
  <Html lang="nl" dir="ltr">
    <Head />
    <Preview>Bevestig je aanvraag</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>
          B2B<span style={{ color: '#E8945A' }}>GroeiMachine</span>
        </Text>
        <Heading style={heading}>Bevestig je aanvraag</Heading>
        <Text style={paragraph}>
          Klik op de knop om <strong>{title}</strong> te ontvangen.
        </Text>
        <Button href={confirmUrl} style={button}>
          Bevestig en open template
        </Button>
        <Text style={small}>Heb je deze niet aangevraagd? Negeer dan deze mail.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: GiveAwayConfirmEmail,
  subject: (data: Record<string, any>) => `Bevestig: ${data.title ?? ''}`,
  displayName: 'Give-away bevestiging',
  previewData: {
    title: 'ICP Canvas',
    confirmUrl: 'https://www.b2bgroeimachine.io/give-aways/icp-canvas?u=1&t=demo',
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
  margin: '6px 0 24px',
}
const small = { color: '#888888', fontSize: '12px', lineHeight: '1.5' }
