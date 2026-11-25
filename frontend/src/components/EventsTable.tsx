import type { CaseEvent } from '../types';

interface Props {
  events: CaseEvent[];
  selectedIds: string[];
  linkedIds: Set<string>; 
  onToggle: (id: string) => void;
}

function details(e: CaseEvent): string {
  if (e.type === 'dns') {
    return [e.query, e.qtype, e.rcode].filter(Boolean).join('  ');
  }
  return [e.dst_port && `:${e.dst_port}`, e.proto].filter(Boolean).join(' ');
}

export function EventsTable({ events, selectedIds, linkedIds, onToggle }: Props) {
  const sorted = [...events].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  return (
    <section className="panel" aria-label="Events">
      <h2 className="panel__title">
        События <span className="count">{events.length}</span>
      </h2>
      <div className="table-wrap">
        <table className="events">
          <thead>
            <tr>
              <th aria-label="Выбрать" />
              <th>Время</th>
              <th>Источник</th>
              <th>Тип</th>
              <th>Src</th>
              <th>Dst</th>
              <th>Query / порт</th>
              <th>Сервис</th>
              <th className="num">Байты</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((e) => {
              const selected = selectedIds.includes(e.id);
              const linked = linkedIds.has(e.id);
              return (
                <tr
                  key={e.id}
                  className={[selected && 'is-selected', linked && 'is-linked']
                    .filter(Boolean)
                    .join(' ')}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => onToggle(e.id)}
                      aria-label={`Выбрать событие ${e.id}`}
                    />
                  </td>
                  <td className="mono">{e.timestamp.slice(11, 19)}</td>
                  <td>{e.source}</td>
                  <td>{e.type}</td>
                  <td className="mono">{e.src_ip}</td>
                  <td className="mono">{e.dst_ip}</td>
                  <td className="mono">{details(e)}</td>
                  <td>{e.service ?? '—'}</td>
                  <td className="mono num">{e.bytes ?? '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
