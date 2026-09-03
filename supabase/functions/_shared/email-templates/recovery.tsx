/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Button, Heading, Text } from 'npm:@react-email/components@0.0.22'
import { BrandShell, button, footerText, h1, text } from './brand.tsx'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <BrandShell preview={`Stel je wachtwoord opnieuw in voor ${siteName}`}>
    <Heading style={h1}>Stel je wachtwoord opnieuw in</Heading>
    <Text style={text}>
      Wij kregen een verzoek voor een nieuw wachtwoord bij {siteName}. Kies
      hieronder een nieuw wachtwoord.
    </Text>
    <Button style={button} href={confirmationUrl}>
      Nieuw wachtwoord kiezen
    </Button>
    <Text style={footerText}>
      Heb je dit niet aangevraagd? Negeer deze mail. Je wachtwoord blijft dan
      hetzelfde.
    </Text>
  </BrandShell>
)

export default RecoveryEmail
