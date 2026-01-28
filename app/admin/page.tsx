'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useRouter } from 'next/navigation';
import SocialLinksAdmin from '../components/SocialAdmin';

const ColorInput: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-text-secondary">
      {label}
    </label>
    <div className="flex items-center space-x-2 mt-1">
      <input
        type="color"
        value={value}
        onChange={onChange}
        className="w-10 h-10 p-1 border rounded-md"
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="block w-full px-3 py-2 bg-base-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
      />
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const {
    theme,
    setTheme,
    updateTheme,
  } = useTheme();

  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // 1️⃣ Ensure freshest theme from DB
  /*
  useEffect(() => {
    getTheme();
  }, [getTheme]);*/

  const handleThemeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setTheme(prev => ({ ...prev, [name]: value }));
  };

  // 2️⃣ Persist theme to DB
  const handleSaveTheme = async () => {
    try {
      setSaving(true);
      await updateTheme(theme);
    } catch (err) {
      console.error('Failed to save theme:', err);
    } finally {
      setSaving(false);
    }
  };
/*
  if (loading) {
    return <div>Loading theme…</div>;
  }
*/
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-extrabold text-text-primary">
        Admin Dashboard
      </h1>

      <div className="p-6 bg-base-100 rounded-lg shadow-lg border">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Site Customization
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ColorInput
            label="Primary Color"
            value={theme.primaryColor}
            onChange={e =>
              setTheme({ ...theme, primaryColor: e.target.value })
            }
          />
          <ColorInput
            label="Secondary Color"
            value={theme.secondaryColor}
            onChange={e =>
              setTheme({ ...theme, secondaryColor: e.target.value })
            }
          />
          <ColorInput
            label="Accent Color"
            value={theme.accentColor}
            onChange={e =>
              setTheme({ ...theme, accentColor: e.target.value })
            }
          />
          <ColorInput
            label="Background Color"
            value={theme.base100Color}
            onChange={e =>
              setTheme({ ...theme, base100Color: e.target.value })
            }
          />
          <ColorInput
            label="Primary Text Color"
            value={theme.textPrimaryColor}
            onChange={e =>
              setTheme({
                ...theme,
                textPrimaryColor: e.target.value,
              })
            }
          />
          <ColorInput
            label="Secondary Text Color"
            value={theme.textSecondaryColor}
            onChange={e =>
              setTheme({
                ...theme,
                textSecondaryColor: e.target.value,
              })
            }
          />

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-secondary">
              Header Text
            </label>
            <input
              type="text"
              name="headerText"
              value={theme.headerText}
              onChange={handleThemeChange}
              className="mt-1 block w-full px-3 py-2 bg-base-100 border rounded-md"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-secondary">
              Footer Text
            </label>
            <input
              type="text"
              name="footerText"
              value={theme.footerText}
              onChange={handleThemeChange}
              className="mt-1 block w-full px-3 py-2 bg-base-100 border rounded-md"
            />
          </div>
        </div>

        <button
          onClick={handleSaveTheme}
          disabled={saving}
          className="mt-6 inline-flex items-center px-6 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Theme'}
        </button>
      </div>
     
      <SocialLinksAdmin />
    </div>
  );
};

export default AdminDashboard;
