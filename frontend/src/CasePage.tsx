import { useState } from 'react';
import { mockCase } from './mockCase';
import type { CaseData, HypothesisStatus } from './types';
import { AlertCard } from './components/AlertCard';
import { EventsTable } from './components/EventsTable';
import { HypothesisForm } from './components/HypothesisForm';
import { HypothesesList } from './components/HypothesesList';
import { EvidenceList } from './components/EvidenceList';
import './CasePage.css';

const newId = (prefix: string) => `${prefix}-${crypto.randomUUID().slice(0, 8)}`;

// Пока backend не готов, данные берутся из mockCase.
// Позже: заменить useState(mockCase) на загрузку через API,
// а локальные обновления ниже — на запросы (POST/PATCH).
export default function CasePage() {
  const [data, setData] = useState<CaseData>(mockCase);
  const [activeId, setActiveId] = useState<string | null>(mockCase.hypotheses[0]?.id ?? null);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);

  const activeHypothesis = data.hypotheses.find((h) => h.id === activeId) ?? null;

  const linkedEventIds = new Set(
    data.evidence
      .filter((ev) => activeHypothesis?.evidence_ids.includes(ev.id))
      .flatMap((ev) => ev.event_ids),
  );

  const toggleEvent = (id: string) =>
    setSelectedEventIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const createHypothesis = (title: string, description: string) => {
    const id = newId('hyp');
    setData((d) => ({
      ...d,
      hypotheses: [
        ...d.hypotheses,
        { id, title, description, status: 'Unresolved', evidence_ids: [] },
      ],
    }));
    setActiveId(id);
  };

  const changeStatus = (id: string, status: HypothesisStatus) =>
    setData((d) => ({
      ...d,
      hypotheses: d.hypotheses.map((h) => (h.id === id ? { ...h, status } : h)),
    }));

  const createEvidence = (description: string) => {
    setData((d) => ({
      ...d,
      evidence: [...d.evidence, { id: newId('ev'), event_ids: selectedEventIds, description }],
    }));
    setSelectedEventIds([]);
  };

  const unlink = (hypothesisId: string, evidenceId: string) =>
    setData((d) => ({
      ...d,
      hypotheses: d.hypotheses.map((h) =>
        h.id === hypothesisId
          ? { ...h, evidence_ids: h.evidence_ids.filter((x) => x !== evidenceId) }
          : h,
      ),
    }));

  const toggleLink = (evidenceId: string) => {
    if (!activeHypothesis) return;
    if (activeHypothesis.evidence_ids.includes(evidenceId)) {
      unlink(activeHypothesis.id, evidenceId);
    } else {
      setData((d) => ({
        ...d,
        hypotheses: d.hypotheses.map((h) =>
          h.id === activeHypothesis.id
            ? { ...h, evidence_ids: [...h.evidence_ids, evidenceId] }
            : h,
        ),
      }));
    }
  };

  return (
    <div className="page">
      <header className="topbar">
        <span className="topbar__brand">TraceGraph</span>
        <span className="topbar__case mono">{data.id}</span>
      </header>

      <main className="layout">
        <div className="col">
          <AlertCard alert={data.alert} />
          <EventsTable
            events={data.events}
            selectedIds={selectedEventIds}
            linkedIds={linkedEventIds}
            onToggle={toggleEvent}
          />
        </div>

        <div className="col">
          <HypothesisForm onCreate={createHypothesis} />
          <HypothesesList
            hypotheses={data.hypotheses}
            evidence={data.evidence}
            activeId={activeId}
            onSelect={setActiveId}
            onStatusChange={changeStatus}
            onUnlink={unlink}
          />
          <EvidenceList
            evidence={data.evidence}
            activeHypothesis={activeHypothesis}
            selectedCount={selectedEventIds.length}
            onCreate={createEvidence}
            onToggleLink={toggleLink}
          />
        </div>
      </main>
    </div>
  );
}
