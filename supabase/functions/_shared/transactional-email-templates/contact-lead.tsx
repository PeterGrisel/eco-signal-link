import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  email?: string
  company?: string | null
  phone?: string | null
  message?: string
  pageUrl?: string | null
}

const ContactLeadEmail = ({
  name = '',
  email = '',
  company,
  phone,
  message = '',
  pageUrl,
}: Props) => (
  <Html lang="nl" dir="ltr">
    <Head />
    <Preview>Nieuwe lead via /contact</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Nieuwe lead via /contact</Heading>
        <Text style={row}>
          <strong>Naam:</strong> {name}
        </Text>
        <Text style={row}>
          <strong>E-mail:</strong> {email}
        </Text>
        <Text style={row}>
          <strong>Bedrijf:</strong> {company || '—'}
        </Text>
        <Text style={row}>
          <strong>Telefoon:</strong> {phone || '—'}
        </Text>
        <Text style={label}>
          <strong>Bericht:</strong>
        </Text>
        <Text style={body}>{message}</Text>
        <Text style={meta}>Pagina: {pageUrl || '—'}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactLeadEmail,
  subject: (data: Record<string, any>) =>
    `Nieuwe lead: ${data.name ?? ''}${data.company ? ` (${data.company})` : ''}`,
  displayName: 'Nieuwe lead (contactformulier)',
  previewData: {
    name: 'Jan Jansen',
    email: 'jan@voorbeeld.nl',
    company: 'Voorbeeld BV',
    phone: '+31 6 12345678',
    message: 'Graag contact over de groeimachine.',
    pageUrl: 'https://www.b2bgroeimachine.io/contact',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = {
  maxWidth: '560px',
  margin: '0 auto',
  border: '1px solid #eeeeee',
  borderRadius: '12px',
  padding: '24px',
}
const heading = { color: '#E8945A', fontSize: '22px', margin: '0 0 16px' }
const row = { margin: '4px 0', color: '#121212', fontSize: '14px' }
const label = { margin: '16px 0 4px', color: '#121212', fontSize: '14px' }
const body = { whiteSpace: 'pre-wrap' as const, margin: '0', color: '#121212', fontSize: '14px' }
const meta = { color: '#888888', fontSize: '12px', marginTop: '20px' }
