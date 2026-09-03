import * as React from 'npm:react@18.3.1'
import { Heading, Text } from 'npm:@react-email/components@0.0.22'
import { BrandShell, footerText, h1, text } from '../email-templates/brand.tsx'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  email?: string
  company?: string | null
  phone?: string | null
  message?: string
  pageUrl?: string | null
}

const row = { ...text, margin: '2px 0' }

const ContactLeadEmail = ({
  name = '',
  email = '',
  company,
  phone,
  message = '',
  pageUrl,
}: Props) => (
  <BrandShell preview="Nieuwe lead via /contact">
    <Heading style={h1}>Nieuwe lead via /contact</Heading>
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
    <Text style={{ ...row, margin: '16px 0 4px' }}>
      <strong>Bericht:</strong>
    </Text>
    <Text style={{ ...text, whiteSpace: 'pre-wrap' as const, margin: '0' }}>{message}</Text>
    <Text style={footerText}>Pagina: {pageUrl || '—'}</Text>
  </BrandShell>
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
