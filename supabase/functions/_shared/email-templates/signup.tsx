/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Button, Heading, Link, Text } from 'npm:@react-email/components@0.0.22'
import { BrandShell, button, footerText, h1, link, text } from './brand.tsx'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <BrandShell preview={`Bevestig je e-mailadres voor ${siteName}`}>
    <Heading style={h1}>Bevestig je e-mailadres</Heading>
    <Text style={text}>
      Bedankt voor je aanmelding bij{' '}
      <Link href={siteUrl} style={link}>
        <strong>{siteName}</strong>
      </Link>
      .
    </Text>
    <Text style={text}>
      Bevestig je adres ({recipient}) met de knop hieronder.
    </Text>
    <Button style={button} href={confirmationUrl}>
      Bevestig e-mailadres
    </Button>
    <Text style={footerText}>
      Heb je geen account aangemaakt? Negeer deze mail.
    </Text>
  </BrandShell>
)

export default SignupEmail
