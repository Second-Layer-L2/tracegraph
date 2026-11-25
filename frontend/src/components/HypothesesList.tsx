import type { Evidence, Hypothesis, HypothesisStatus } from '../types';

const STATUSES: HypothesisStatus[] = ['Supported', 'Rejected', 'Unresolved'];

interface Props {
  hypotheses: Hypothesis[];
  evidence: Evidence[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onStatusChange: (id: string, status: HypothesisStatus) => void;
  onUnlink: (hypothesisId: string, evidenceId: string) => void;
}

export function HypothesesList({
  hypotheses,
  evidence,
  activeId,
  onSelect,
  onStatusChange,
  onUnlink,
}: Props) {
  return (
    <section className="panel" aria-label="Hypotheses">
      <h2 className="panel__title">
        Гипотезы <span className="count">{hypotheses.length}</span>
      </h2>

      {hypotheses.length === 0 && (
        <p className="empty">Гипотез пока нет. Создайте первую, чтобы начать проверку.</p>
      )}

      <ul className="list">
        {hypotheses.map((h) => {
          const linked = h.evidence_ids
            .map((id) => evidence.find((ev) => ev.id === id))
            .filter((ev): ev is Evidence => Boolean(ev));
          const active = h.id === activeId;

          return (
            <li key={h.id} className={`hyp ${active ? 'is-active' : ''}`}>
              <button
                className="hyp__head"
                onClick={() => onSelect(h.id)}
                aria-pressed={active}
              >
                <span className="hyp__title">{h.title}</span>
                <span className={`badge badge--${h.status.toLowerCase()}`}>{h.status}</span>
              </button>

              {h.description && <p className="hyp__desc">{h.description}</p>}

              <div className="segmented" role="group" aria-label="Статус гипотезы">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    className={`segmented__btn segmented__btn--${s.toLowerCase()}`}
                    aria-pressed={h.status === s}
                    onClick={() => onStatusChange(h.id, s)}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="hyp__evidence">
                {linked.length === 0 ? (
                  <p className="empty empty--small">Evidence не привязано</p>
                ) : (
                  <ul className="evlist">
                    {linked.map((ev) => (
                      <li key={ev.id}>
                        <span>{ev.description}</span>
                        <button
                          className="btn btn--ghost"
                          onClick={() => onUnlink(h.id, ev.id)}
                        >
                          Отвязать
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
