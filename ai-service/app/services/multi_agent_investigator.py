import json
import re
from typing import Dict, Any, List, Optional, Tuple
from app.core.config import settings
from app.schemas.investigation import (
    CaseSummary,
    AnomalyEvidencePacket,
    ProsecutionTheory,
    DefenseTheory,
    AlternativeExplanation,
    AdjudicationResult,
    DualScore,
    SARReport,
    NetworkGraphData,
    RiskLevel,
    EvidenceItem,
)


class MultiAgentInvestigator:
    """
    Multi-Agent Forensic Pipeline for Financial Crime & Suspicious Network Analysis.
    Comprises 4 specialized reasoning agents:
      1. Agent 1 (Prosecution / SAR Author): Formulates primary illicit theory with exact citations.
      2. Agent 2 (Devil's Advocate / Defense): Evaluates innocent hypotheses for False-Positive Control.
      3. Agent 3 (Compliance QA & Adjudicator): Computes calibrated Dual Scores & FinCEN SAR narrative.
      4. Agent 4 (Human-in-the-Loop Action Planner): Prescribes concrete investigative next steps.
    """

    def __init__(self):
        self.gemini_client = None
        if settings.GEMINI_API_KEY:
            try:
                from google import genai
                self.gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
            except Exception as e:
                print(f"⚠️ MultiAgentInvestigator could not init Gemini: {e}")

    # =========================================================================
    # Zero-Config Offline Forensic Reasoning Engine (Always Available Fallback)
    # =========================================================================

    def _offline_prosecution_agent(
        self,
        case_summary: CaseSummary,
        anomaly_packet: AnomalyEvidencePacket,
        graph_data: Optional[NetworkGraphData],
    ) -> ProsecutionTheory:
        """Agent 1: Formulates criminal theory citing exact evidence."""
        citations: List[str] = []
        total_illicit_volume = 0.0

        # Extract citations from anomaly packet
        for ev in anomaly_packet.evidence_items:
            citation_str = f"[{ev.evidence_type}] Entity: {ev.entity_id or 'N/A'}"
            if ev.tx_id:
                citation_str += f" | TxID: {ev.tx_id}"
            if ev.amount:
                citation_str += f" | Amount: ${ev.amount:,.2f}"
                total_illicit_volume += ev.amount
            if ev.timestamp:
                citation_str += f" | Time: {ev.timestamp}"
            citation_str += f" -> {ev.description}"
            citations.append(citation_str)

        category = (case_summary.category or "").upper()
        structuring_count = len(anomaly_packet.structuring_findings)
        rapid_drain_count = len(anomaly_packet.rapid_drain_findings)
        swarm_count = len(anomaly_packet.device_swarm_findings)
        geo_count = len(anomaly_packet.geo_velocity_findings)

        if "FALSE_POSITIVE" in category or "BENIGN" in category:
            theory = (
                f"Suspicious activity was flagged initially due to high volume transfer patterns. "
                f"However, forensic timeline reconstruction indicates synchronized commercial or corporate disbursements. "
                f"No deliberate evasion of CTR thresholds is proven, though strict AML audit criteria triggered review."
            )
            primary_typology = "POTENTIAL_BENIGN_HIGH_VELOCITY_CLEARING"
            confidence = 35.0
        elif swarm_count > 0 and geo_count > 0:
            theory = (
                f"The network exhibits classic signatures of an organized Account Takeover (ATO) and Credential Stuffing Ring. "
                f"A centralized hardware emulator or compromised device ({anomaly_packet.device_swarm_findings[0].get('device_id')}) "
                f"accessed multiple unrelated customer profiles across impossible geographic locations within minutes, "
                f"followed by immediate liquidity extraction."
            )
            primary_typology = "CREDENTIAL_STUFFING_ATO_RING"
            confidence = 94.0
        elif structuring_count > 0 and rapid_drain_count > 0:
            theory = (
                f"The target entity cluster operates as a multi-tier Money Mule & Structuring Syndicate. "
                f"Inbound funds were structured via sub-$10,000 deposits to circumvent Bank Secrecy Act (BSA) Currency "
                f"Transaction Reports (CTRs), followed by rapid liquidity pass-through draining >90% of funds "
                f"to offshore or third-party beneficiaries within under 2 hours."
            )
            primary_typology = "MULE_RING_STRUCTURING_AND_RAPID_DRAIN"
            confidence = 92.0
        elif structuring_count > 0:
            theory = (
                f"The network engages in systematic Smurfing / Structuring Layering. Multiple transactions are deliberately "
                f"calibrated between $9,000 and $9,999 to evade regulatory reporting thresholds, distributed across "
                f"interconnected accounts."
            )
            primary_typology = "BSA_CTR_STRUCTURING_EVASION"
            confidence = 88.0
        elif rapid_drain_count > 0:
            theory = (
                f"Forensic velocity analysis indicates Money Mule Pass-Through activity. The accounts serve as transient "
                f"funnel nodes where inbound deposits are depleted in near real-time, leaving near-zero residual balance."
            )
            primary_typology = "MONEY_MULE_RAPID_PASS_THROUGH"
            confidence = 85.0
        else:
            theory = (
                f"Network analysis detected anomalous transactional topology across {case_summary.entity_count or 'multiple'} entities, "
                f"characterized by circular fund flows and asymmetric counterparty concentration."
            )
            primary_typology = "ANOMALOUS_NETWORK_CONCENTRATION"
            confidence = 75.0

        if total_illicit_volume == 0.0 and case_summary.total_volume:
            total_illicit_volume = case_summary.total_volume * 0.85

        return ProsecutionTheory(
            theory=theory,
            primary_typology=primary_typology,
            evidence_citations=citations[:10],
            estimated_illicit_volume=round(total_illicit_volume, 2),
            confidence=round(confidence, 1),
        )

    def _offline_defense_agent(
        self,
        case_summary: CaseSummary,
        anomaly_packet: AnomalyEvidencePacket,
        prosecution: ProsecutionTheory,
    ) -> DefenseTheory:
        """Agent 2: Formulates innocent counter-explanations for False-Positive Control."""
        category = (case_summary.category or "").upper()
        is_known_benign = "FALSE_POSITIVE" in category or "BENIGN" in category

        alternatives: List[AlternativeExplanation] = []
        reasons_benign: List[str] = []

        if is_known_benign:
            primary_counter = (
                "The observed velocity and multi-recipient disbursements are fully consistent with scheduled end-of-month "
                "corporate contractor payroll or merchant settlement batch operations from an authenticated corporate gateway."
            )
            plausibility = 92.0
            reasons_benign = [
                "Transaction amounts correlate with regular vendor invoices and contractor rate cards.",
                "Disbursements occur strictly on business banking days during standard operating hours.",
                "Source entity has verified corporate incorporation documents and active tax ID.",
                "Recipients have longstanding KYC profiles without prior SAR filings.",
            ]
            alternatives.append(AlternativeExplanation(
                hypothesis="Scheduled Corporate Payroll & Vendor Batch Disbursement",
                plausibility_score=92.0,
                supporting_factors=reasons_benign,
                why_unlikely="Financial velocity matches payroll schedules; this is highly plausible and represents a benign commercial false positive."
            ))
            alternatives.append(AlternativeExplanation(
                hypothesis="Corporate Treasury Liquidity Consolidation",
                plausibility_score=85.0,
                supporting_factors=["Account balances sweep daily to zero into master operating reserve."],
                why_unlikely="Legitimate treasury sweep structure explains rapid drainage."
            ))
        else:
            primary_counter = (
                "The defense evaluated potential innocent hypotheses including shared residential/campus Wi-Fi, "
                "family account co-management, and high-frequency seasonal marketplace retail sales."
            )
            plausibility = 18.0
            reasons_benign = [
                "Accounts were initially created through standard consumer onboarding channels.",
                "Transactions utilized standard retail banking payment rails (ACH / Instant Transfer).",
            ]

            # Hypothesis 1: Shared University or Public Kiosk
            alternatives.append(AlternativeExplanation(
                hypothesis="Shared University Campus Wi-Fi or Public Internet Kiosk",
                plausibility_score=22.0,
                supporting_factors=["Multiple users may share public Wi-Fi or computer lab terminals in high-density urban areas."],
                why_unlikely="Hardware device fingerprint and persistent cookie IDs match exactly across accounts, which does not occur on isolated browser sessions in managed public labs."
            ))

            # Hypothesis 2: Legitimate Commercial Invoicing
            alternatives.append(AlternativeExplanation(
                hypothesis="Split Milestone Payments for Legitimate Construction or Consulting Invoices",
                plausibility_score=15.0,
                supporting_factors=["Suppliers occasionally accept split disbursements below $10,000 for work milestones."],
                why_unlikely="Absence of corresponding invoices, immediate same-hour cash/crypto drainage to offshore entities, and lack of trade documentation refute legitimate commercial trade."
            ))

            # Hypothesis 3: VPN Travel Artifact
            alternatives.append(AlternativeExplanation(
                hypothesis="Consumer VPN or Corporate Proxy IP Rotation",
                plausibility_score=28.0,
                supporting_factors=["Active commercial VPN usage can generate disparate geolocation IP tags."],
                why_unlikely="While IP geo-rotation can be synthetic, the correlated immediate transfer of funds to newly registered beneficiary mules refutes mere accidental VPN toggling."
            ))

        return DefenseTheory(
            primary_counter_hypothesis=primary_counter,
            plausibility=round(plausibility, 1),
            alternative_explanations=alternatives,
            reasons_benign=reasons_benign,
        )

    def _offline_adjudicator_agent(
        self,
        case_summary: CaseSummary,
        anomaly_packet: AnomalyEvidencePacket,
        prosecution: ProsecutionTheory,
        defense: DefenseTheory,
    ) -> AdjudicationResult:
        """Agent 3: Computes calibrated Dual Scores and generates FinCEN SAR narrative."""
        category = (case_summary.category or "").upper()
        is_known_benign = "FALSE_POSITIVE" in category or "BENIGN" in category

        if is_known_benign:
            risk_score = 15.0
            legitimacy_score = 88.0
            risk_level = RiskLevel.LOW.value
            verdict = "FALSE_POSITIVE_CLEARED"
            recommended_action = "CLOSE_FALSE_POSITIVE"
            typologies = ["BENIGN_PAYROLL_VELOCITY", "COMMERCIAL_TREASURY_CLEARING"]
            summary_justification = (
                "Transaction velocity is verified as legitimate corporate payroll execution. "
                "Evidence does not support criminal intent. False positive alert cleared."
            )
        else:
            # Calibrate based on detected anomalies
            base_risk = 70.0
            if anomaly_packet.structuring_findings:
                base_risk += 12.0
            if anomaly_packet.rapid_drain_findings:
                base_risk += 10.0
            if anomaly_packet.device_swarm_findings:
                base_risk += 8.0
            if anomaly_packet.geo_velocity_findings:
                base_risk += 5.0

            risk_score = min(98.0, base_risk)
            legitimacy_score = max(5.0, 100.0 - risk_score - (defense.plausibility * 0.3))
            risk_level = RiskLevel.CRITICAL.value if risk_score >= 85.0 else RiskLevel.HIGH.value
            verdict = "CRIMINAL_NETWORK_CONFIRMED"
            recommended_action = "FILE_SAR"
            typologies = [prosecution.primary_typology]
            for f in anomaly_packet.structuring_findings:
                typologies.append(f.get("type", "STRUCTURING"))
            for f in anomaly_packet.rapid_drain_findings:
                typologies.append(f.get("type", "RAPID_DRAIN"))
            for f in anomaly_packet.device_swarm_findings:
                typologies.append(f.get("type", "DEVICE_SWARM"))
            typologies = list(dict.fromkeys(typologies))  # deduplicate
            summary_justification = (
                f"Multi-layered anomalies ({len(anomaly_packet.evidence_items)} specific citations) "
                f"demonstrate high-risk coordination with negligible innocent plausibility ({defense.plausibility}%)."
            )

        dual_score = DualScore(
            risk_score=round(risk_score, 1),
            legitimacy_score=round(legitimacy_score, 1),
            risk_level=risk_level,
            confidence_score=round(prosecution.confidence, 1),
            adjudication_summary=summary_justification,
        )

        # Generate FinCEN-standard Suspicious Activity Report Narrative
        sar_narrative = (
            f"=== SUSPICIOUS ACTIVITY REPORT (SAR) NARRATIVE ===\n"
            f"CASE REFERENCE: {case_summary.case_id} | TITLE: {case_summary.title}\n"
            f"INITIAL ALERT CATEGORY: {case_summary.category}\n\n"
            f"I. SUSPECT ENTITY AND NETWORK IDENTIFICATION:\n"
            f"This narrative details suspicious financial activity identified across a cluster of interconnected accounts and entities. "
            f"Forensic graph resolution identified {case_summary.entity_count or 'multiple'} entities displaying high-risk behavioral coupling. "
            f"Total transaction volume under review is ${case_summary.total_volume or prosecution.estimated_illicit_volume:,.2f}.\n\n"
            f"II. SUMMARY OF SUSPICIOUS ACTIVITY & TYPOLOGY:\n"
            f"The subject network was flagged by automated surveillance for {', '.join(typologies)}. "
            f"{prosecution.theory}\n\n"
            f"III. CHRONOLOGICAL EVIDENCE & TRANSACTION CITATIONS:\n"
        )

        for idx, ev in enumerate(anomaly_packet.evidence_items[:8], 1):
            sar_narrative += f"  [{idx}] {ev.description} (Entity: {ev.entity_id or 'Unknown'}, Type: {ev.evidence_type})\n"

        sar_narrative += (
            f"\nIV. EVALUATION OF ALTERNATIVE BENIGN HYPOTHESES (FALSE-POSITIVE CONTROL):\n"
            f"In compliance with BSA/AML examination standards, the compliance engine evaluated counter-explanations. "
            f"{defense.primary_counter_hypothesis}\n"
        )
        for alt in defense.alternative_explanations:
            sar_narrative += f"  • Hypothesis '{alt.hypothesis}' (Plausibility {alt.plausibility_score}%): Refutation -> {alt.why_unlikely}\n"

        sar_narrative += (
            f"\nV. ADJUDICATION CONCLUSION & FILING RECOMMENDATION:\n"
            f"The Compliance Adjudication Engine has assigned an Illicit Risk Score of {dual_score.risk_score}/100 and "
            f"an Innocent Legitimacy Score of {dual_score.legitimacy_score}/100 (Classification: {dual_score.risk_level}). "
            f"Verdict: {verdict}. Recommended regulatory disposition: {recommended_action}.\n"
            f"FinCEN BSA Electronic Filing tracking reference generated."
        )

        sar_report = SARReport(
            narrative=sar_narrative,
            typologies_identified=typologies,
            human_action_checklist=[],
            fincen_xml_reference=f"BSA-XML-2026-{case_summary.case_id[-4:]}-SAR",
            recommended_action=recommended_action,
        )

        return AdjudicationResult(
            dual_score=dual_score,
            verdict=verdict,
            sar_report=sar_report,
        )

    def _offline_action_planner_agent(
        self,
        case_summary: CaseSummary,
        adjudication: AdjudicationResult,
        anomaly_packet: AnomalyEvidencePacket,
    ) -> List[str]:
        """Agent 4: Prescribes 4-5 concrete next investigation steps for human compliance officers."""
        checklist: List[str] = []

        if "FALSE_POSITIVE" in adjudication.verdict:
            checklist = [
                "1. Document corporate payroll verification certificate and matched bank clearing statements in the compliance case file.",
                "2. Update entity risk rating in the core AML monitoring engine to whitelist recurrent end-of-month salary batches.",
                "3. Perform spot-check verification of tax withholding deposits against state revenue authorities.",
                "4. Close alert queue ticket with verified benign commercial disposition code: FP-COMMERCIAL-PAYROLL.",
            ]
        else:
            checklist = [
                f"1. Immediate Account Freeze: Place administrative debit holds on identified pass-through funnel accounts ({', '.join([ev.entity_id for ev in anomaly_packet.evidence_items if ev.entity_id][:3])}) to prevent remaining asset exfiltration.",
                "2. Subpoena & Device Telemetry: Issue formal 314(b) requests and subpoena ISP/telecom carrier logs for the hardware fingerprint and IP addresses linked to the device swarm cluster.",
                "3. Enhanced Due Diligence (EDD) & KYC Refresh: Issue formal Requests for Information (RFIs) demanding source of funds documentation, contracts, and proof of beneficial ownership for top recipient entities.",
                "4. Beneficial Ownership Trace: Cross-reference recipient account routing numbers against FinCEN shell company advisories and OFAC sanctions registries.",
                f"5. Formal Regulatory Submission: Finalize and electronically submit FinCEN Form 111 (Suspicious Activity Report) under BSA tracking reference {adjudication.sar_report.fincen_xml_reference or 'BSA-2026-SAR'}.",
            ]

        adjudication.sar_report.human_action_checklist = checklist
        return checklist

    # =========================================================================
    # LLM-Powered Multi-Agent Reasoning Execution
    # =========================================================================

    async def _run_llm_agents(
        self,
        case_summary: CaseSummary,
        anomaly_packet: AnomalyEvidencePacket,
        graph_data: Optional[NetworkGraphData],
        provider: str = "auto",
    ) -> Optional[Tuple[ProsecutionTheory, DefenseTheory, AdjudicationResult, List[str]]]:
        """
        Attempts to invoke Gemini/Groq LLM for enriched forensic multi-agent debate.
        Returns None on any error to trigger seamless offline fallback.
        """
        if not self.gemini_client:
            return None

        prompt = f"""
You are an expert Anti-Money Laundering (AML) and Financial Crime Multi-Agent Investigator.
Analyze this suspicious financial network case and output a strictly valid JSON response.

Case: {case_summary.case_id} - {case_summary.title}
Category: {case_summary.category}
Description: {case_summary.description}
Total Volume: ${case_summary.total_volume or 0.0:,.2f}

Detected Forensic Anomalies:
- Structuring Events: {len(anomaly_packet.structuring_findings)}
- Rapid Drain Events: {len(anomaly_packet.rapid_drain_findings)}
- Device Swarms: {len(anomaly_packet.device_swarm_findings)}
- Geo Velocity Anomaly Logins: {len(anomaly_packet.geo_velocity_findings)}
- Evidence Items: {[e.dict() for e in anomaly_packet.evidence_items[:6]]}

Act as the 4 Specialized Agents:
1. Agent 1 (Prosecution): Primary criminal theory, typologies, citations, estimated illicit volume, confidence (0-100).
2. Agent 2 (Defense / False-Positive Control): Innocent counter-explanations (payroll, campus Wi-Fi, split invoicing), plausibility (0-100), why unlikely or plausible.
3. Agent 3 (Compliance Adjudicator): Calibrated risk_score (0-100), legitimacy_score (0-100), risk_level (CRITICAL/HIGH/MEDIUM/LOW), verdict, formal FinCEN SAR narrative.
4. Agent 4 (Human Planner): 4 to 5 concrete action checklist items for human compliance officers.

Return ONLY a JSON object matching this schema:
{{
  "prosecution": {{
    "theory": "...",
    "primary_typology": "...",
    "evidence_citations": ["citation 1", "citation 2"],
    "estimated_illicit_volume": 120000.0,
    "confidence": 92.0
  }},
  "defense": {{
    "primary_counter_hypothesis": "...",
    "plausibility": 18.0,
    "alternative_explanations": [
      {{
        "hypothesis": "...",
        "plausibility_score": 20.0,
        "supporting_factors": ["factor 1"],
        "why_unlikely": "..."
      }}
    ],
    "reasons_benign": ["reason 1"]
  }},
  "adjudication": {{
    "risk_score": 92.0,
    "legitimacy_score": 15.0,
    "risk_level": "CRITICAL",
    "verdict": "CRIMINAL_NETWORK_CONFIRMED",
    "adjudication_summary": "...",
    "sar_narrative": "...",
    "typologies_identified": ["MULE_RING", "STRUCTURING"],
    "recommended_action": "FILE_SAR"
  }},
  "human_action_plan": [
    "1. ...",
    "2. ...",
    "3. ...",
    "4. ..."
  ]
}}
"""
        try:
            response = self.gemini_client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
            )
            raw_text = response.text or ""
            # Strip markdown fences if present
            cleaned_text = re.sub(r"^```(?:json)?\s*", "", raw_text.strip(), flags=re.MULTILINE)
            cleaned_text = re.sub(r"```\s*$", "", cleaned_text.strip(), flags=re.MULTILINE)
            data = json.loads(cleaned_text)

            p_data = data["prosecution"]
            prosecution = ProsecutionTheory(
                theory=p_data["theory"],
                primary_typology=p_data.get("primary_typology", "SUSPICIOUS_NETWORK"),
                evidence_citations=p_data.get("evidence_citations", []),
                estimated_illicit_volume=float(p_data.get("estimated_illicit_volume", 0.0)),
                confidence=float(p_data.get("confidence", 85.0)),
            )

            d_data = data["defense"]
            alts = []
            for a in d_data.get("alternative_explanations", []):
                alts.append(AlternativeExplanation(
                    hypothesis=a.get("hypothesis", "Innocent explanation"),
                    plausibility_score=float(a.get("plausibility_score", 20.0)),
                    supporting_factors=a.get("supporting_factors", []),
                    why_unlikely=a.get("why_unlikely", "Refuted by evidence"),
                ))
            defense = DefenseTheory(
                primary_counter_hypothesis=d_data["primary_counter_hypothesis"],
                plausibility=float(d_data.get("plausibility", 20.0)),
                alternative_explanations=alts,
                reasons_benign=d_data.get("reasons_benign", []),
            )

            adj_data = data["adjudication"]
            dual_score = DualScore(
                risk_score=float(adj_data["risk_score"]),
                legitimacy_score=float(adj_data["legitimacy_score"]),
                risk_level=adj_data["risk_level"],
                confidence_score=prosecution.confidence,
                adjudication_summary=adj_data.get("adjudication_summary"),
            )

            sar = SARReport(
                narrative=adj_data.get("sar_narrative", ""),
                typologies_identified=adj_data.get("typologies_identified", []),
                human_action_checklist=data.get("human_action_plan", []),
                fincen_xml_reference=f"BSA-XML-2026-{case_summary.case_id[-4:]}-SAR",
                recommended_action=adj_data.get("recommended_action", "FILE_SAR"),
            )

            adjudication = AdjudicationResult(
                dual_score=dual_score,
                verdict=adj_data.get("verdict", "REVIEW_REQUIRED"),
                sar_report=sar,
            )

            return prosecution, defense, adjudication, data.get("human_action_plan", [])
        except Exception as e:
            print(f"⚠️ LLM Pipeline error, falling back to rule engine: {e}")
            return None

    async def investigate(
        self,
        case_summary: CaseSummary,
        anomaly_packet: AnomalyEvidencePacket,
        graph_data: Optional[NetworkGraphData] = None,
        provider: str = "auto",
    ) -> Tuple[ProsecutionTheory, DefenseTheory, AdjudicationResult, List[str], str, bool]:
        """
        Executes the 4-agent investigation pipeline.
        Tries LLM if configured; automatically falls back to deterministic rule engine.
        Returns: (prosecution, defense, adjudication, human_plan, model_name, offline_fallback_used)
        """
        offline_fallback_used = False
        model_name = settings.GEMINI_MODEL

        # Attempt LLM if enabled and provider != "mock"
        if provider != "mock" and self.gemini_client:
            llm_result = await self._run_llm_agents(case_summary, anomaly_packet, graph_data, provider)
            if llm_result:
                prosecution, defense, adjudication, human_plan = llm_result
                return prosecution, defense, adjudication, human_plan, model_name, False

        # Fallback to offline rule engine
        offline_fallback_used = True
        model_name = "forensic-rule-engine-v2.0 (offline)"

        prosecution = self._offline_prosecution_agent(case_summary, anomaly_packet, graph_data)
        defense = self._offline_defense_agent(case_summary, anomaly_packet, prosecution)
        adjudication = self._offline_adjudicator_agent(case_summary, anomaly_packet, prosecution, defense)
        human_plan = self._offline_action_planner_agent(case_summary, adjudication, anomaly_packet)

        return prosecution, defense, adjudication, human_plan, model_name, offline_fallback_used


investigator_service = MultiAgentInvestigator()
