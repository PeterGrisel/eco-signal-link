# Content Autopilot + Link Validation Gate

## Edge function: validate-external-links

Template: `assets/validate-external-links.template.ts` (kopieer naar `supabase/functions/validate-external-links/index.ts`).

**Input:** `{ content: string, ignoreHosts?: string[] }`
**Output:** `{ checked, ok, broken: [{url, status, reason}], skipped_internal }`

**Gedrag:**
- HEAD request met browser User-Agent + 10s timeout
- Fallback naar ranged GET op status 0/404/410/5xx
- 401/403/405/429/503 = soft-ok (bot-blocking, niet dood)
- Skip interne hosts (configureer per project)

## Integratie patroon

### 1. Blog editor (handmatige publish)
```ts
if (status === 'published') {
  const result = await supabase.functions.invoke('validate-external-links', {
    body: { content: markdown }
  });
  if (result.data.broken.length && !forceOverride) {
    showBrokenLinks(result.data.broken);
    return; // eerste save blokkeert
  }
  // tweede save met forceOverride = admin bypass
}
```

### 2. Autopilot (auto-publish)
```ts
// In autopilot-run, generate_article mode
const validation = await validateLinks(article.content);
if (validation.broken.length) {
  await insertArticle({ ...article, status: 'draft' });
  await updateQueue({ status: 'failed', error_message: validation.broken.map(b => b.url).join('\n') });
  return; // geen indexing, geen prerender
}
await insertArticle({ ...article, status: 'published' });
```

## Per project aanpassen
In `validate-external-links/index.ts`, pas `INTERNAL_HOSTS` aan:
```ts
const INTERNAL_HOSTS = ['mijnsite.nl', 'mijnsite.lovable.app', 'preview-...lovable.app'];
```

## Waarom
Externe links worden stilletjes 404 bij site migraties. Een pre-publish gate voorkomt dat blogposts met dode links live gaan.
