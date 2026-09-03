/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Button, Heading, Link, Text } from 'npm:@react-email/components@0.0.22'
import { BrandShell, button, footerText, h1, link, text } from './brand.tsx'

interface EmailChangeEmailProps {
  siteName: string
  // oldEmail is the user's current address (HookData.OldEmail). For the
  // NEW-recipient half of a secure email_change fanout, `email` equals the
  // recipient (NEW), so the "from" line must render oldEmail to read
  // "from OLD to NEW" instead of "from NEW to NEW".
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  oldEmail,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <BrandShell preview={`Bevestig je nieuwe e-mailadres voor ${siteName}`}>
    <Heading style={h1}>Bevestig je nieuwe e-mailadres</Heading>
    <Text style={text}>
      Je wijzigt je e-mailadres voor {siteName} van{' '}
      <Link href={`mailto:${oldEmail}`} style={link}>
        {oldEmail}
      </Link>{' '}
      naar{' '}
      <Link href={`mailto:${newEmail}`} style={link}>
        {newEmail}
      </Link>
      .
    </Text>
    <Text style={text}>Klik op de knop om de wijziging te bevestigen.</Text>
    <Button style={button} href={confirmationUrl}>
      Wijziging bevestigen
    </Button>
    <Text style={footerText}>
      Heb je dit niet aangevraagd? Beveilig dan direct je account.
    </Text>
  </BrandShell>
)

export default EmailChangeEmail
