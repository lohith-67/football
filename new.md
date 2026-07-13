# StadiumIQ 2026 — Master build prompt

Paste this whole document into your coding agent (Claude Code, Cursor, etc.) as the project brief. It is written to be handed to an AI agent directly.

## 1. One-line pitch
StadiumIQ is a GenAI copilot for the FIFA World Cup 2026 with two faces on one backend: a rich fan companion app and a volunteer/ops dashboard, covering navigation, crowd management, accessibility, transportation, sustainability, multilingual assistance, operational intelligence, and real-time decision support — for any of the 16 host venues across the US, Canada, and Mexico.

## 2. Users and modes
- **Fan mode** — attendee looking for wayfinding, transit, accessibility routing, live match context, and multilingual help.
- **Volunteer/staff mode** — venue staff who file incident reports and get GenAI-drafted recommended actions and translated announcements.
- **Organizer mode (stretch)** — a rollup view across zones/venues for a shift supervisor.

A single role toggle switches views; both modes call the same orchestrator backend.

## 3. Required feature coverage (do not drop any of these)
| Category | What it means here |
|---|---|
| Navigation | Turn-by-turn in-venue and to-venue routing, updated for live congestion |
| Crowd management | Zone-level congestion state (simulated feed for demo), redirect suggestions |
| Accessibility | Step-free routing, quiet zones, sensory-friendly notes, wheelchair/assistive-device flag carried through every recommendation |
| Transportation | Transit/rideshare/parking options ranked by time |
| Sustainability | Same options ranked/labelled by estimated carbon footprint, "greenest choice" badge |
| Multilingual assistance | Full conversation (voice + text) in the fan's language; staff-side translation of alerts and instructions |
| Operational intelligence | Incident classification, recommended actions, shift/zone summaries for staff |
| Real-time decision support | Everything above regenerates as congestion/incident state changes, not a static plan |

## 4. New requirements from this round
1. **Venue switcher** — a dropdown/selector letting the user pick any of the 16 host stadiums (US, Canada, Mexico). Switching venue reloads: venue map/zones, accessibility data, transit options, and the live match tied to that venue.
2. **Live match detail panel** — this is not a chatbot-only UI. The fan screen must show real match context: teams, score, kickoff time/countdown, venue, weather at venue, and (if available) a simple event timeline — pulled from the match API you provide, not invented.
3. **Rich, app-like frontend** — dashboard/companion-app feel: cards, tabs, live tickers, maps, badges — chat is one panel among several, not the whole interface.
4. **Animations** — meaningful motion, not decoration: congestion bars/heatmaps transitioning as zone state changes, score/timer ticking, route line drawing in on the map, card entrance transitions. Use Framer Motion (React) or GSAP; keep every animation under ~2s and respect `prefers-reduced-motion`.
5. **Use Stitch MCP for UI generation** — when building the frontend in your coding agent, configure and use the Google Stitch MCP server (`stitch-mcp`) to generate and iterate screens from text prompts, then pull the generated HTML/CSS into the codebase. Two-step flow: `extract_design_context` from an existing screen to capture the design system, then `generate_screen_from_text` for each new screen so styling stays consistent across fan mode, ops mode, and the venue switcher. Note this requires a Google Cloud project with the Stitch API enabled — treat it as a design-generation aid, not a runtime dependency; the shipped app should not require Stitch at runtime.
6. **Animated 3D stadium background on venue switch** — the fan copilot chat sits on top of a background layer showing the selected stadium. When the user switches venue:
   - Crossfade from the old stadium image/render to the new one (300-500ms).
   - Add a subtle 3D effect on the transition — a slight parallax tilt (CSS `perspective` + `rotateX/rotateY`, a few degrees) and a gentle scale-in, so the new stadium feels like it "arrives" rather than just swapping.
   - The chat/plan panels stay legible over the image via a semi-transparent, blurred glass panel (`backdrop-filter: blur(...)`), not a solid overlay.
   - Respect `prefers-reduced-motion` — fall back to a plain crossfade with no tilt/scale.
   - Use real venue photography per stadium once available (licensed/official assets); use a stylized placeholder render until then — don't scrape or hotlink unlicensed stadium photos.

## 5. Architecture (recap)
```
Fan / volunteer input (voice, text, incident report)
        -> Orchestrator agent (intent parsing, tool routing)
        -> Tool layer (maps, congestion feed, translation, match data, weather)
        -> Response synthesis (personalized plan, translated)
        -> Output channels (fan app, voice, ops dashboard)
```

## 6. APIs / data (you will supply keys — wire these in, don't hardcode fake data once real keys exist)
- Match data: live score, lineup, timeline, venue, kickoff time (your provided API)
- Weather at venue (your provided API)
- Maps/transit/directions (e.g. Google Maps Directions + Transit)
- Translation/voice: Claude API for translation + synthesis; STT for voice in, TTS for voice out
- Congestion feed: simulated/mock service for the demo, clearly labelled as synthetic — this stands in for real stadium sensor/camera data, which you won't have access to
- Accessibility layer: a per-venue JSON of step-free routes, elevators, quiet zones (build manually for your demo venues, extend as data becomes available)

## 7. Orchestrator system prompts

**Fan mode**
```
You are StadiumIQ, a multilingual stadium companion. Given a fan's message
(any language), their selected venue, location, accessibility needs, and time
until kickoff:
1. Detect language and accessibility requirements from the message.
2. Call get_match_info(venue) for live score, teams, kickoff countdown, weather.
3. Call get_congestion(venue, zone) for live crowd levels near their gate.
4. Call get_route(venue, from, to, mode, accessible=true/false) for path + timing.
5. Call get_transit_options(venue, location) and score each by time and estimated
   emissions.
6. Synthesize one clear plan in the fan's own language: route, transit mode,
   ETA, buffer time before kickoff, plus the live match context.
Never suggest a route flagged non-accessible if the fan indicated a mobility need.
Never invent match data — only report what get_match_info returns.
```

**Volunteer/ops mode**
```
You are StadiumIQ Ops. Given an incident report from staff (any language) and
the selected venue:
1. Classify severity and zone.
2. Cross-reference get_congestion(venue, zone) for current crowd state.
3. Draft a short recommended action in plain language.
4. Draft a translated fan-facing announcement if needed.
Output must be concise enough to read in under 10 seconds.
```

## 8. Frontend structure (suggested)
- `VenueSwitcher` — dropdown, 16 host cities, triggers full context reload
- `StadiumBackdrop` — full-bleed background layer behind the chat/plan panels; crossfades and 3D-tilts to the new stadium image whenever `VenueSwitcher` changes, with a blurred glass panel in front for legibility
- `MatchPanel` — live score, countdown, weather, animated ticker
- `MapPanel` — venue map with animated route draw-in, zone congestion overlay
- `CopilotChat` — voice + text, one panel among several, not the whole screen
- `PlanCard` — synthesized route/transit/accessibility/eco-score result
- `OpsDashboard` (staff mode) — zone monitors, incident feed, broadcast composer
- Shared: language selector, role toggle (fan/staff), animated state transitions on all live data

## 9. Suggested stack
- Frontend: React + Tailwind, Framer Motion for animation, Mapbox/Google Maps JS for the map panel
- Backend: Node/Python orchestrator calling Claude API with tool/function calling
- Data: Postgres/Firestore for user profile + live incident log
- Design generation: Stitch MCP inside your coding agent for scaffolding screens, then hand-wired to real data

## 10. Non-functional requirements
- Every screen usable via voice for accessibility
- All fan-facing text goes through translation before display
- Animations respect `prefers-reduced-motion`
- Congestion data is clearly labelled as simulated in the demo
- No feature from Section 3 may be missing from the final build — if time-constrained, degrade gracefully (e.g. fewer venues) rather than dropping a category entirely

## 11. Build order
1. Venue switcher + static match/weather panel for one venue (real API data)
2. Fan copilot chat wired to maps + congestion (simulated) + accessibility filter
3. Language/voice layer
4. Ops dashboard reusing the same backend
5. Animations and Stitch-generated visual polish last, once data flows are real
