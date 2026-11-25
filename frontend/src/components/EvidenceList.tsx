import { useState } from 'react';
import type { Evidence, Hypothesis } from '../types';

interface Props {
  evidence: Evidence[];
  activeHypothesis: Hypothesis | null;
  selectedCount: number;
  onCreate: (description: string) => void;
  onToggleLink: (evidenceId: string) => void;
}

export function EvidenceList({
  evidence,
  activeHypothesis,
  selectedCount,
  onCreate,
  onToggleLink,
}: Props) {
  const [description, setDescription] = useState('');

  const create = () => {
    if (!description.trim() || selectedCount === 0) return;
    onCreate(description.trim());
    setDescription('');
  };

  return (
    <section className="panel" aria-label="Evidence">
      <h2 className="panel__title">
        Evidence <span className="count">{evidence.length}</span>
      </h2>

      <div className="form form--inline">
        <input
          className="input"
          placeholder={
            selectedCount
              ? `Что показывают выбранные события (${selectedCount})`
              : 'Сначала отметьте события в таблице'
          }
          value={description}
          disabled={selectedCount === 0}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && create()}
        />
        <button
          className="btn"
          onClick={create}
          disabled={selectedCount === 0 || !description.trim()}
        >
          Создать evidence
        </button>
      </div>

      <p className="hint">
        {activeHypothesis
          ? `Привязка к гипотезе: ${activeHypothesis.title}`
          : 'Выберите гипотезу, чтобы привязывать evidence'}
      </p>

      <ul className="list">
        {evidence.map((ev) => {
          const linked = activeHypothesis?.evidence_ids.includes(ev.id) ?? false;
          return (
            <li key={ev.id} className="evidence">
              <div>
                <p className="evidence__desc">{ev.description}</p>
                <p className="evidence__events mono">{ev.event_ids.join(', ')}</p>
              </div>
              <button
                className={`btn ${linked ? 'btn--ghost' : ''}`}
                disabled={!activeHypothesis}
                onClick={() => onToggleLink(ev.id)}
              >
                {linked ? 'Отвязать' : 'Привязать'}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
