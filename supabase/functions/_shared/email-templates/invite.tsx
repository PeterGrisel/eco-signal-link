/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Button, Heading, Link, Text } from 'npm:@react-email/components@0.0.22'
import { BrandShell, button, footerText, h1, link, text } from './brand.tsx'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <BrandShell preview={`Je bent uitgenodigd voor ${siteName}`}>
    <Heading style={h1}>Je bent uitgenodigd</Heading>
    <Text style={text}>
      Je bent uitgenodigd voor{' '}
      <Link href={siteUrl} style={link}>
        <strong>{siteName}</strong>
      </Link>
      . Klik op de knop om de uitnodiging te accepteren en je account te maken.
    </Text>
    <Button style={button} href={confirmationUrl}>
      Uitnodiging accepteren
    </Button>
    <Text style={footerText}>
      Verwachtte je deze uitnodiging niet? Negeer deze mail.
    </Text>
  </BrandShell>
)

export default InviteEmail
