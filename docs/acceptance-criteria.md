# Foobow Acceptance Criteria

This file turns the ODD objects into verifiable release criteria.

## Product Metrics

- Activation: a new user can complete a first deed in under one minute.
- Ritual retention: a returning user can check in, complete a deed, and save a journal note.
- Trust: donation copy always separates symbolic karma from verified real-world impact.
- Safety: community content has report affordances before public launch.
- Privacy: journal, quiet ranking, export, and delete controls are visible before account launch.

## Object Acceptance Criteria

### User / Profile

- User can choose language and dark/light mode.
- User can enable private journal and quiet ranking preferences.
- User can export local prototype data.
- User can delete local prototype data.

### Mood Check-In

- User can select a mood.
- Selected mood updates the recommended deed.
- Daily completion increases symbolic progress and streak state.
- State persists after refresh in the prototype.

### Deed Type / Deed Action

- User can browse deed types.
- User can select a deed and see a ritual preview.
- User can perform a ritual and receive symbolic karma.
- Deed content comes from structured sample data instead of being scattered across click handlers.

### Map Spot

- User can open map spots by location.
- Spot detail updates category, name, and description.
- Pins expose accessible labels and selected state.

### Blessing / Safety Report

- User can create an anonymous blessing.
- User can react with a low-pressure action.
- User can report a blessing for moderation review.
- Reported content is visually marked and the report action is disabled.

### Donation Campaign

- User can open a verified-cause donation prompt.
- Donation copy states that payment does not buy luck, virtue, or guaranteed karma.
- Future implementation must reject unverified donation campaigns.

## Release Risks

- Symbolic good deeds can be misunderstood as moral scoring; copy must remain humble and non-coercive.
- Anonymous community features can attract abuse; moderation must be present before open sharing.
- Donation flows carry trust and compliance risk; verification, receipts, refunds, and idempotency are required before payments.
- Map features can overpromise real-world impact; prototype and product copy must clearly label virtual versus verified actions.

