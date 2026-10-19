import * as React from 'npm:react@18.3.1'
import { Heading, Text } from 'npm:@react-email/components@0.0.22'
import { BrandShell, footerText, h1, text } from '../email-templates/brand.tsx'
import type { TemplateEntry } from './registry.ts'

interface Vak {
  titel: string
  tekst: string
}

interface Props {
  name?: string | null
  email?: string
  company?: string | null
  mode?: string
  format?: string
  vakken?: Vak[]
  sourceUrl?: string | null
}

const row = { ...text, margin: '2px 0' }

const GroeiplanLeadEmail = ({
  name,
  email = '',
  company,
  mode = 'visitor',
  format = 'pdf',
  vakken = [],
  sourceUrl,
}: Props) => {
  const ingevuld = vakken.filter((v) => v.tekst)
  return (
    <BrandShell preview="Nieuw groeiplan gedownload">
      <Heading style={h1}>Nieuw groeiplan gedownload</Heading>
      <Text style={row}>
        <strong>Naam:</strong> {name || '—'}
      </Text>
      <Text style={row}>
        <strong>E-mail:</strong> {email}
      </Text>
      <Text style={row}>
        <strong>Bedrijf:</strong> {company || '—'}
      </Text>
      <Text style={row}>
        <strong>Download:</strong> {format === 'md' ? 'Markdown' : 'PDF'}
        {mode === 'klant' ? ' (klantversie)' : ''}
      </Text>
      <Text style={row}>
        <strong>Ingevuld:</strong> {ingevuld.length} van {vakken.length || 9} vakken
      </Text>
      {ingevuld.map((v) => (
        <React.Fragment key={v.titel}>
          <Text style={{ ...row, margin: '16px 0 4px' }}>
            <strong>{v.titel}</strong>
          </Text>
          <Text style={{ ...text, whiteSpace: 'pre-wrap' as const, margin: '0' }}>{v.tekst}</Text>
        </React.Fragment>
      ))}
      <Text style={footerText}>Pagina: {sourceUrl || '—'}</Text>
    </BrandShell>
  )
}

export const template = {
  component: GroeiplanLeadEmail,
  subject: (data: Record<string, any>) =>
    `Nieuw groeiplan: ${data.name || data.email || ''}${data.company ? ` (${data.company})` : ''}`,
  displayName: 'Nieuw groeiplan (lead)',
  previewData: {
    name: 'Jan Jansen',
    email: 'jan@voorbeeld.nl',
    company: 'Voorbeeld BV',
    mode: 'visitor',
    format: 'pdf',
    vakken: [
      { titel: '01 Mijn doelmarkt', tekst: 'Industriële maakbedrijven, 50 tot 250 medewerkers.' },
      { titel: '02 Mijn boodschap', tekst: '' },
    ],
    sourceUrl: 'https://www.b2bgroeimachine.io/groeiplan',
  },
} satisfies TemplateEntry
