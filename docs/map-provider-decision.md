# Foobow Map Provider Decision

## Objective

The map is Foobow's primary exploration surface. It must support calm discovery, themed good-deed layers, collective impact visualization, and future moderation around location-sensitive content.

## Provider Shortlist

- Mapbox: best polished mobile SDKs, styled maps, performant clustering, and enterprise support.
- Google Maps Platform: strongest global POI familiarity and geocoding ecosystem, but visual differentiation and cost control require care.
- OpenStreetMap with MapLibre: strongest open ecosystem and styling control, lower vendor lock-in, but requires more operational ownership for tiles/geocoding.

## Recommended MVP Direction

Use Mapbox for the first production mobile MVP if budget allows. It fits the premium visual direction and reduces implementation risk for clustering, camera control, offline-adjacent behavior, and polished thematic layers.

Use OpenStreetMap plus MapLibre if vendor independence and cost control outweigh launch speed. This is a strong fallback for web/prototype expansion, but mobile production will need more tile, caching, and geocoding decisions.

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

- Final provider contract and API key ownership.
- Whether map tiles are cached for low-connectivity use.
- Whether public user-created spots are available at MVP or held for post-launch.
