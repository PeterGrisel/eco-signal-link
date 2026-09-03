import * as React from 'npm:react@18.3.1'
import { Button, Heading, Text } from 'npm:@react-email/components@0.0.22'
import { BrandShell, button, footerText, h1, text } from '../email-templates/brand.tsx'
import type { TemplateEntry } from './registry.ts'

interface Props {
  title?: string
  confirmUrl?: string
}

const GiveAwayConfirmEmail = ({ title = '', confirmUrl = '#' }: Props) => (
  <BrandShell preview="Bevestig je aanvraag">
    <Heading style={h1}>Bevestig je aanvraag</Heading>
    <Text style={text}>
      Klik op de knop om <strong>{title}</strong> te ontvangen.
    </Text>
    <Button href={confirmUrl} style={button}>
      Bevestig en open template
    </Button>
    <Text style={footerText}>Heb je deze niet aangevraagd? Negeer dan deze mail.</Text>
  </BrandShell>
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
