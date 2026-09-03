/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Heading, Text } from 'npm:@react-email/components@0.0.22'
import { BrandShell, codeStyle, footerText, h1, text } from './brand.tsx'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <BrandShell preview="Je verificatiecode">
    <Heading style={h1}>Bevestig je identiteit</Heading>
    <Text style={text}>Gebruik onderstaande code om verder te gaan.</Text>
    <Text style={codeStyle}>{token}</Text>
    <Text style={footerText}>
      Deze code verloopt snel. Heb je dit niet aangevraagd? Negeer deze mail.
    </Text>
  </BrandShell>
)

export default ReauthenticationEmail
