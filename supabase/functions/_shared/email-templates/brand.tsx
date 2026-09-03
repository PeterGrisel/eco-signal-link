/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

/** Merkstijlen voor alle e-mails van B2BGroeiMachine. */
export const brand = {
  accent: '#E8945A',
  ink: '#121212',
  muted: '#55575d',
  line: '#eeeeee',
  headingFont: "'Space Grotesk', 'Helvetica Neue', Arial, sans-serif",
  bodyFont: "Inter, 'Helvetica Neue', Arial, sans-serif",
}

export const main = {
  backgroundColor: '#ffffff',
  fontFamily: brand.bodyFont,
  padding: '24px 12px',
}

export const container = {
  maxWidth: '560px',
  margin: '0 auto',
  border: `1px solid ${brand.line}`,
  borderRadius: '14px',
  padding: '32px',
}

export const h1 = {
  fontFamily: brand.headingFont,
  fontSize: '22px',
  fontWeight: 700 as const,
  color: brand.ink,
  margin: '18px 0 12px',
}

export const text = {
  fontSize: '15px',
  color: brand.muted,
  lineHeight: '1.6',
  margin: '0 0 20px',
}

export const link = { color: brand.ink, textDecoration: 'underline' }

export const button = {
  backgroundColor: brand.accent,
  color: brand.ink,
  fontFamily: brand.headingFont,
  fontWeight: 600 as const,
  fontSize: '15px',
  borderRadius: '8px',
  padding: '13px 22px',
  textDecoration: 'none',
  display: 'inline-block',
}

export const footerText = {
  fontSize: '12px',
  color: '#999999',
  lineHeight: '1.5',
  margin: '24px 0 0',
}

export const codeStyle = {
  fontFamily: "'Space Grotesk', 'Courier New', monospace",
  fontSize: '30px',
  letterSpacing: '6px',
  fontWeight: 700 as const,
  color: brand.ink,
  backgroundColor: '#faf5f0',
  border: `1px solid ${brand.line}`,
  borderRadius: '10px',
  padding: '16px 20px',
  textAlign: 'center' as const,
  margin: '0 0 20px',
}

const wordmark = {
  fontFamily: brand.headingFont,
  fontWeight: 700 as const,
  fontSize: '18px',
  color: brand.ink,
  margin: '0',
}

const tagline = {
  fontFamily: brand.headingFont,
  fontSize: '11px',
  letterSpacing: '1.5px',
  textTransform: 'uppercase' as const,
  color: brand.accent,
  margin: '4px 0 0',
}

const hr = { borderColor: brand.line, margin: '28px 0 0' }

const signature = {
  fontSize: '12px',
  color: '#999999',
  lineHeight: '1.5',
  margin: '14px 0 0',
}

interface ShellProps {
  preview: string
  children: React.ReactNode
}

/** Vaste huisstijl-omlijsting: wordmark boven, afzenderregel onder. */
export const BrandShell = ({ preview, children }: ShellProps) => (
  <Html lang="nl" dir="ltr">
    <Head />
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section>
          <Text style={wordmark}>
            B2B<span style={{ color: brand.accent }}>GroeiMachine</span>
          </Text>
          <Text style={tagline}>Rebel Force × AI</Text>
        </Section>
        {children}
        <Hr style={hr} />
        <Text style={signature}>
          B2BGroeiMachine — b2bgroeimachine.io
        </Text>
      </Container>
    </Body>
  </Html>
)
