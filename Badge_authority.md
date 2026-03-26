# Badge Authority Specification

## Overview
The Badge Authority is the governing subsystem responsible for issuing, validating, managing, and revoking badges within the Polar ecosystem. Badges represent verifiable proof of contribution, impact, governance alignment, and long‑term commitment. All badges are backed by meter data, governance events, or documented contribution history.

---

# 1. Badge Categories

## 1.1 Proof‑of‑Work
**Definition:** Awarded for hands‑on contributions measured directly through activity and issue‑level performance.  
**Description:** Recognizes consistent, measurable work output.  
**Meters Used:**  
- Workspace Activity Meter  
- Issue Response Time Meter  
- Issue Resolution Rate Meter  

---

## 1.2 Proof‑of‑Impact
**Definition:** Awarded for contributions that materially improve project outcomes and ecosystem health.  
**Description:** Recognizes contributors whose work meaningfully shifts project velocity or stability.  
**Meters Used:**  
- Project Velocity Meter  
- Project Health Meter  

---

## 1.3 Governance
**Definition:** Awarded for participation in governance processes.  
**Description:** Recognizes contributors who help shape policy, review proposals, or participate in decision‑making.  
**Meters Used:**  
- *Event‑based (no meters)*  
**Trigger Sources:**  
- Proposal reviews  
- Governance discussions  
- Policy votes  

---

## 1.4 Loyalty
**Definition:** Awarded for long‑term, consistent engagement in the ecosystem.  
**Description:** Recognizes contributors who show sustained commitment.  
**Meters Used:**  
- Workspace Contributor Growth Meter  

---

## 1.5 Documentation
**Definition:** Awarded for producing high‑quality documentation.  
**Description:** Recognizes contributors who improve clarity, onboarding, and knowledge transfer.  
**Meters Used:**  
- *Event‑based (no meters)*  
**Trigger Sources:**  
- Documentation PRs  
- Documentation reviews  
- Documentation quality assessments  

---

## 1.6 Collaboration
**Definition:** Awarded for teamwork, co‑creation, and community support.  
**Description:** Recognizes contributors who elevate others.  
**Meters Used:**  
- Workspace Activity Meter (collaborative interactions)  

---

## 1.7 Ecosystem
**Definition:** Awarded for contributions that improve the ecosystem’s overall health.  
**Description:** Recognizes contributors who strengthen stability, reliability, and long‑term viability.  
**Meters Used:**  
- Project Health Meter  

---

# 2. Badge Tiers

## Bronze
**Definition:** Entry‑level badge for initial, verifiable contributions.  
**Description:** Demonstrates early engagement and participation.

## Silver
**Definition:** Mid‑tier badge for consistent, measurable contributions.  
**Description:** Demonstrates reliability and ongoing involvement.

## Gold
**Definition:** High‑tier badge for significant, sustained contributions.  
**Description:** Demonstrates leadership and ecosystem impact.

## Obsidian
**Definition:** Elite badge for exceptional, long‑term, transformative contributions.  
**Description:** Demonstrates mastery, stewardship, and ecosystem‑level influence.

---

# 3. Badge‑to‑Meter Mapping

| Badge Category     | Meter                               | Trigger Condition |
|--------------------|--------------------------------------|-------------------|
| Proof‑of‑Work      | Workspace Activity Meter             | Threshold = Green |
| Proof‑of‑Work      | Issue Response Time Meter            | < 2 hours         |
| Proof‑of‑Work      | Issue Resolution Rate Meter          | > 80%             |
| Proof‑of‑Impact    | Project Velocity Meter               | > 10 commits/day  |
| Proof‑of‑Impact    | Project Health Meter                 | Threshold = Green |
| Loyalty            | Workspace Contributor Growth Meter   | > 5 new contributors/month |
| Collaboration      | Workspace Activity Meter             | > 10 interactions/day |
| Ecosystem          | Project Health Meter                 | Threshold = Green |

---

# 4. Trigger Rules

## 4.1 Threshold‑Based Triggers
- **Green:** 80–100% of target  
- **Yellow:** 50–79% of target  
- **Red:** < 50% of target  

Badges are issued only when a meter reaches **Green** or exceeds a defined numeric threshold.

---

## 4.2 Streak‑Based Triggers
- **5‑day streak:** Bronze  
- **20‑day streak:** Silver  
- **50‑day streak:** Gold  
- **100‑day streak:** Obsidian  

Streaks apply to:
- Workspace Activity  
- Issue Resolution  
- Project Velocity  

---

## 4.3 Composite Triggers
Some badges require multiple meters to be green simultaneously:

**Example:**  
Proof‑of‑Impact (Gold) requires:  
- Project Velocity Meter = Green  
- Project Health Meter = Green  

---

# 5. Revocation Rules

Badges may be revoked when:

1. A contributor violates governance hygiene standards.  
2. A contributor’s meter performance drops below **Red** for 30 consecutive days.  
3. Fraudulent or manipulated contributions are detected.  
4. Governance body votes for revocation with a simple majority.  

Revocations are logged in the governance audit ledger.

---

# 6. Verification Payload Schema

```json
{
  "badge_id": "string",
  "category": "string",
  "tier": "string",
  "recipient_id": "string",
  "meter_snapshot": {
    "workspace_activity": "number",
    "issue_response_time": "number",
    "issue_resolution_rate": "number",
    "project_velocity": "number",
    "project_health": "number",
    "contributor_growth": "number"
  },
  "timestamp": "string"
}
```

---

# 7. Signature Block Format

```json
{
  "issuer": "string",
  "signature": "string",
  "public_key": "string",
  "method": "ed25519",
  "chain_of_custody": [
    {
      "event": "issued",
      "timestamp": "string"
    }
  ]
}
```

---

# 8. Issuance Workflow

1. Meter data is collected and validated.  
2. Trigger conditions are evaluated.  
3. Badge Authority signs the issuance payload.  
4. Badge is added to the Badge Registry.  
5. Contributor receives notification.  

---

# 9. Revocation Workflow

1. Governance body identifies a revocation condition.  
2. Evidence is logged in the audit ledger.  
3. Badge Authority signs a revocation payload.  
4. Badge is marked as revoked in the Badge Registry.  
5. Contributor receives notification.  

---

# End of Specification
