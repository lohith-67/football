Add the following updates to StadiumIQ:

TRANSLATOR
1. Universal Live Translator — a dedicated screen (not buried in chat) for
   face-to-face use between a volunteer/staff member and a fan who share no
   language:
   - Two-way voice conversation mode: person A speaks language A, person B
     hears language B, and vice versa, in near real time.
   - Also usable fan-to-fan (e.g. two supporter groups communicating).
   - Show source text and translated text simultaneously on screen, in large,
     readable subtitles suitable for a noisy stadium environment.
   - Text fallback if voice isn't practical.
2. Staff quick-phrase translator (ops mode) — a bank of common operational
   phrases ("please move to Gate D," "is anyone hurt?," "show me your ticket")
   that translate instantly with one tap, for situations too fast for full
   conversation mode.
3. Broadcast translation — any public announcement is auto-translated into
   the top 4-6 languages expected for that match: start with the languages of
   the two competing teams' countries (from the match API), plus
   English/Spanish/French/Portuguese as the host-region baseline.
4. Language coverage should expand from that baseline as needed, not be
   limited to a fixed list.

FIXES FROM CURRENT BUILD REVIEW
5. Replace any placeholder/stock camera thumbnails ("Live CCTV") with an
   abstract "Zone Sensor Feed" panel — density heatmap tiles per zone,
   clearly labelled as derived/simulated data. Avoid literal camera feeds
   entirely (surveillance/privacy concerns, and it's FIFA/Lenovo's enterprise
   turf already).
6. Add a visible language selector (flag/globe dropdown) next to the venue
   switcher on both fan and ops screens — multilingual support needs to be
   visually obvious, not just something the chat happens to do.
7. Wire in the animated 3D stadium background on the fan screen (crossfade +
   subtle 3D tilt-in on venue switch, blurred glass panel over it for the
   chat/plan cards) — currently still a plain dark gradient.
8. Add a sustainability or accessibility metric to the ops KPI row (e.g.
   "Low-carbon transit share," "Accessibility escorts fulfilled") so those
   categories are visible at a glance, not just in small tags.
9. Add an Accessibility row to Resource Allocation, alongside Security /
   Guest Services / Medical.
10. Add a mic icon to both chat inputs (fan and ops) to make voice mode
    visually obvious.
11. Add a third transport option (e.g. walking-only or parking) to the
    Recommended Route card, so ranking by time and carbon has more than two
    data points.

Keep the existing GenAI Resolution card (recommended action + drafted
broadcast + "Broadcast & Route" CTA) as-is — it's the strongest existing
proof of real-time GenAI decision support.