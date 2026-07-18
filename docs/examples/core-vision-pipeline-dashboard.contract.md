# Telemetrie DATA-contract (Core-Vision pipeline dashboard)

> **Let op:** de opdracht verwees naar een aangeleverd bestand
> `core-vision-pipeline-dashboard__1_.jsx` dat hier geplaatst moest worden.
> Dat bestand zat niet bij de aanlevering; dit document legt daarom het
> DATA-contract vast zoals opgebouwd uit de opdracht-specificatie (v3, deel
> F9/I2). De frontend-implementatie staat in `src/pages/app/Telemetry.tsx`;
> de compositie in `supabase/functions/_shared/rt-telemetry.ts`. Wordt de
> originele JSX alsnog aangeleverd, plaats hem hier en lijn `Telemetry.tsx`
> erop uit — de JSX is dan leidend.

Het `get_telemetry`-/`portal-telemetry`-antwoord:

```jsonc
{
  "data": {
    "pipedrive": {                 // uit pull_pipedrive_stats
      "open":  { "count": 12, "value": 480000 },
      "won":   { "count": 9,  "value": 310000 },
      "lost":  { "count": 6,  "value": 90000 },
      "winRateCount": 60.0,        // won / (won+lost), %
      "winRateValue": 77.5,        // op waarde, %
      "stages": [ { "name": "Kwalificatie", "count": 4, "value": 120000 } ],
      "topOpen":  [ { "title": "...", "org": "...", "value": 85000, "stage": "..." } ],   // max 6
      "recentWon":[ { "title": "...", "org": "...", "value": 42000, "won_time": "..." } ] // max 4
    },
    "salescycle": {                // uit pull_pipedrive_stats (add_time -> won_time)
      "medianFunnel": 41.0, "meanFunnel": 55.3, "sameDayPct": 8.0, "funnelDeals": 9
    },
    "winloss": {                   // uit pull_pipedrive_stats
      "stages": [ { "stage": "Voorstel", "wonC": 3, "wonV": 120000, "lostC": 2, "lostV": 30000 } ],
      "lostReasons": [ { "reason": "budget", "count": 3 } ]
    },
    "herkomst": {                  // uit pull_pipedrive_stats (deal-labels)
      "bronnen":  [ { "naam": "Netwerk", "open": 5, "won": 4 } ],   // Netwerk/Outbound/Training/Overig
      "channels": [ { "naam": "LinkedIn", "count": 7 } ],
      "hot":      [ { "title": "...", "org": "...", "value": 60000 } ]
    },
    "monthly": [                   // uit pull_pipedrive_stats, laatste 12 maanden
      { "month": "2026-06", "total": 14, "netwerk": 6, "outbound": 5 }
    ],
    "heyreach": {                  // uit pull_heyreach_stats
      "uniqueLeads": 412, "connectionsSent": 380, "connectionsAccepted": 121, "acceptRate": 31.8,
      "messagesStarted": 121, "messageReplies": 34, "replyRate": 28.1,
      "inmailStarted": 40, "inmailReplies": 6, "inmailReplyRate": 15.0,
      "interested": 12, "tagged": 9, "interestedRate": 2.9,
      "profileViews": 240, "postLikes": 55, "since": "2026-06-18"
    },
    "apollo": {                    // uit pull_apollo_sequence_stats
      "contactsInSequence": 640, "emailsSent": 1800, "delivered": 1710,
      "opened": 940, "openRate": 55.0, "replied": 86, "replyRate": 5.0, "meetings": 7
    },
    "planable": {                  // uit pull_planable_stats
      "posts": 14, "impressions": 21000, "engagement": 640, "likes": 480,
      "comments": 90, "shares": 70, "engagementRate": 3.0,
      "pages": [ { "name": "Rob Schalken" } ], "since": "2026-06-18"
    },
    "staroids": {                  // uit pull_stairoids_scores (provider 'stairoids'!)
      "scored": 63,
      "stages": [ { "naam": "Hot", "min": 80 } ],
      "top": [ { "company": "Wefabricate", "score": 82, "segment": "Machinebouw",
                 "person": "J. Jansen", "role": "CTO", "stage": "Hot",
                 "employees": "51-200", "fit": "sterk" } ]                     // max 8
    }
  },
  "snapshot_dates": { "pipedrive": "2026-07-18T04:31:00Z", "heyreach": null /* ... per blok ... */ },
  "stale":          { "pipedrive": false /* true als snapshot ouder dan 26 uur */ },
  "missing":        { "heyreach": "Geen (verse) snapshot voor pull_heyreach_stats" }
}
```

Regels:

- Berekeningen (win rates, mediane salescycle, herkomst-aggregatie, maandreeks)
  gebeuren in `rt-telemetry-pull`, nooit in de frontend.
- Elk blok heeft zijn eigen `snapshot_dates`- en `stale`-entry; een blok ouder
  dan 26 uur krijgt `stale: true` (RefreshCw-indicator in de UI).
- Ontbrekend of verlopen blok ⇒ `data.<blok> = null` + reden in `missing`.
- Naamconventie: de **provider** heet `stairoids`, het **DATA-blok** `staroids`.
