'use client';

import { useEffect, useState } from 'react';
import type { SocialLink } from '../../types';

const emptyForm = {
  title: '',
  link: '',
  logo: '',
};

export default function SocialLinksAdmin() {
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const loadSocials = async () => {
    const res = await fetch('/api/socials', { cache: 'no-store' });
    setSocials(await res.json());
  };

  useEffect(() => {
    loadSocials();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);

    await fetch(
      editingId ? `/api/socials/${editingId}` : '/api/socials',
      {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      }
    );

    setForm(emptyForm);
    setEditingId(null);
    await loadSocials();
    setLoading(false);
  };

  const handleEdit = (social: SocialLink) => {
    setForm({
      title: social.title,
      link: social.link,
      logo: social.logo,
    });
    setEditingId(social.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this social link?')) return;

    await fetch(`/api/socials/${id}`, { method: 'DELETE' });
    loadSocials();
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-lg border space-y-6">
      <h2 className="text-2xl font-bold text-primary">
        Social Networks
      </h2>

      {/* Form */}
      <div className="grid md:grid-cols-3 gap-4">
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="px-3 py-2 border rounded-md bg-base-100"
        />
        <input
          placeholder="Link"
          value={form.link}
          onChange={e => setForm({ ...form, link: e.target.value })}
          className="px-3 py-2 border rounded-md bg-base-100"
        />
        <input
          placeholder="Logo URL"
          value={form.logo}
          onChange={e => setForm({ ...form, logo: e.target.value })}
          className="px-3 py-2 border rounded-md bg-base-100"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-6 py-2 rounded-md bg-primary text-white font-semibold"
      >
        {editingId ? 'Update Social' : 'Add Social'}
      </button>

      {/* List */}
      <div className="space-y-3">
        {socials.map(social => (
          <div
            key={social.id}
            className="flex items-center justify-between border rounded-md p-3"
          >
            <div>
              <p className="font-semibold text-text-primary">
                {social.title}
              </p>
              <p className="text-sm text-text-secondary">
                {social.link}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(social)}
                className="text-primary font-medium"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(social.id)}
                className="text-red-500 font-medium"
              >
                Deletar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
