import * as React from 'npm:react@18.3.1'
import { Button, Heading, Text } from 'npm:@react-email/components@0.0.22'
import { BrandShell, button, h1, text } from '../email-templates/brand.tsx'
import type { TemplateEntry } from './registry.ts'

interface Props {
  title?: string
  link?: string
}

const GiveAwayDeliveryEmail = ({ title = '', link = '#' }: Props) => (
  <BrandShell preview={title ? `${title} — open en print` : 'Open en print je template'}>
    <Heading style={h1}>{title}</Heading>
    <Text style={text}>
      Open de template hieronder. Met "Print / PDF" maak je er direct een A4 van.
    </Text>
    <Button href={link} style={button}>
      Open template
    </Button>
  </BrandShell>
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
