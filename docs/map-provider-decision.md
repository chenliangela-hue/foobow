# Foobow Map Provider Decision

## Objective

The map is Foobow's primary exploration surface. It must support calm discovery, themed good-deed layers, collective impact visualization, and future moderation around location-sensitive content.

## Provider Shortlist

- OpenStreetMap with MapLibre/Leaflet: no credit-card-gated account for the MVP, strong open ecosystem, styling control, and lower vendor lock-in. Public OSM tiles are acceptable only for light development/prototype use with attribution, caching, and policy compliance.
- Mapbox: best polished mobile SDKs, styled maps, performant clustering, and enterprise support, but account setup may require billing information.
- Google Maps Platform: strongest global POI familiarity and geocoding ecosystem, but visual differentiation and cost control require care.

## Recommended MVP Direction

Use OpenStreetMap-derived tiles with MapLibre/Leaflet for the first no-credit-card MVP. This lets Foobow keep moving without Mapbox billing friction while preserving an open, popular map stack.

Use Mapbox later only if budget allows and the app needs premium styled maps, native clustering support, or enterprise-grade hosted tile reliability.

Important constraint: OpenStreetMap data is free, but the public `tile.openstreetmap.org` servers are best-effort community infrastructure. Production traffic should use a compliant hosted OSM-derived tile provider or self-hosted tiles before launch.

## Foobow Map Layers

- Animal kindness: virtual release, feeding, shelter support.
- Environment: park cleanup, beach cleanup, tree planting, water care.
- Elder care: crossing assistance, seat giving, community support.
- Emotional support: lamps, candles, blessings, encouragement.
- Donations: verified shelters, schools, hospitals, disaster zones.
- Remembrance: flowers, candles, public memorial moments.

## Data Rules

- Map spots are curated or partner-verified before appearing in donation layers.
- Symbolic spots can be broad areas, not precise private addresses.
- Disaster and hospital layers require extra moderation and source review.
- User-created public locations must pass moderation before global visibility.

## UX Requirements

- Category filters must remain one-tap and readable on mobile.
- Clusters should show collective impact without implying moral superiority.
- Donation locations must visually separate real-world verified impact from symbolic virtual deeds.
- Quiet mode should hide ranking overlays and challenge pressure.

## Open Decisions

- Final production tile host if public OSM tiles become too limited for beta/production traffic.
- Whether map tiles are cached for low-connectivity use.
- Whether public user-created spots are available at MVP or held for post-launch.
