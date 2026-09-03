/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Button, Heading, Text } from 'npm:@react-email/components@0.0.22'
import { BrandShell, button, footerText, h1, text } from './brand.tsx'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({
  siteName,
  confirmationUrl,
}: MagicLinkEmailProps) => (
  <BrandShell preview={`Je inloglink voor ${siteName}`}>
    <Heading style={h1}>Je inloglink</Heading>
    <Text style={text}>
      Klik op de knop om in te loggen bij {siteName}. Deze link verloopt snel.
    </Text>
    <Button style={button} href={confirmationUrl}>
      Inloggen
    </Button>
    <Text style={footerText}>
      Heb je deze link niet aangevraagd? Negeer deze mail.
    </Text>
  </BrandShell>
)

export default MagicLinkEmail
