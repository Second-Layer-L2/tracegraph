import { useState } from 'react';

export function HypothesisForm({
  onCreate,
}: {
  onCreate: (title: string, description: string) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const submit = () => {
    if (!title.trim()) return;
    onCreate(title.trim(), description.trim());
    setTitle('');
    setDescription('');
  };

  return (
    <section className="panel" aria-label="Новая гипотеза">
      <h2 className="panel__title">Новая гипотеза</h2>
      <div className="form">
        <input
          className="input"
          placeholder="Например: ложное срабатывание"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <textarea
          className="input"
          rows={2}
          placeholder="Что именно нужно проверить"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="btn btn--primary" onClick={submit} disabled={!title.trim()}>
          Создать
        </button>
      </div>
    </section>
  );
}
