Attribute Dictionary — PRD Cliff Notes

Owner: Luxi Kanazir • Last updated: Aug 11, 2025. 

Vision & Scope

Build a single source of truth (SSOT) inside PCC for all attributes used across LinkedIn (LBP + BizApps).

Each attribute in the dictionary must have a definition and an owner (domain), and PCC should point to the owning domain’s SOT for values. 

P0 Requirements

Lookup: Business users can look up any attribute to understand how it’s used in PCC. 

SSOT: PCC is the SSOT for attribute mappings at LinkedIn and for the definitions of all attributes. 

Ownership: Every attribute has a domain owner; other domains read from that SOT. 

Definition required for every attribute. 

Acceptable values exist for each attribute (where applicable). 

Type is defined for each attribute (boolean, enum, etc.). 

Data Model (as shown in examples)

Fields: attribute_id, name, domain, default_value, description, change_audit_stamps { created {time, actor}, lastModified {time, actor} }.

Example names/domains:

showAdminCenterBanner (CONTRACTS, boolean, default=false)

isEligibleForSelfServedFieldAddon (QUOTING, boolean, default=false)

hasPrepaidCredits (PRODUCT_CATALOG, boolean, default=false)

ineligibleAmendmentIntents (CONTRACTS, set)
These are provided as JSON samples in the PRD. 

Channel Reference (example taxonomy)

Online (desktop), Offline (SFDC), CS grant (verify OMS vs. LBP), iOS (Apple), Field (D365), GPB (Google Play Billing). 

Open Questions / Notes from PRD

Seed data: “Attribution Dictionary — need help to get started; can we do a data dump of all attributes we know of?” 

CS grant usage needs verification for LBP vs. OMS. 

Bottom line: It’s a read-only reference that standardizes attribute meaning, ownership, type, and allowed values, with PCC acting as the authoritative place to look it up (and linking out to the owning domain’s SOT for values).