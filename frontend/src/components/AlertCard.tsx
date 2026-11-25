import type { Alert } from '../types';

export function AlertCard({ alert }: { alert: Alert }) {
  return (
    <section className={`panel alert alert--${alert.severity}`} aria-label="Alert">
      <header className="alert__head">
        <h2 className="alert__title">{alert.title}</h2>
        <span className={`severity severity--${alert.severity}`}>{alert.severity}</span>
      </header>
      <p className="alert__desc">{alert.description}</p>
      <dl className="alert__meta">
        <div>
          <dt>Время</dt>
          <dd className="mono">{alert.timestamp.replace('T', ' ').replace('Z', ' UTC')}</dd>
        </div>
        <div>
          <dt>Источник</dt>
          <dd className="mono">{alert.src_ip}</dd>
        </div>
        <div>
          <dt>Назначение</dt>
          <dd className="mono">{alert.dst_ip}</dd>
        </div>
      </dl>
    </section>
  );
}
