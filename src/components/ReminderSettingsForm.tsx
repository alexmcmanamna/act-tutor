"use client";

import { useState } from "react";

interface ReminderSettings {
  reminderEmailEnabled: boolean;
  reminderSmsEnabled: boolean;
  reminderEmail: string;
  reminderPhone: string;
  reminderTime: string;
}

export function ReminderSettingsForm({ initial }: { initial: ReminderSettings }) {
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Couldn't save settings.");
      }
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="mb-1 font-semibold text-slate-900">Daily study reminders</h2>
        <p className="text-sm text-slate-500">
          Get a nudge at a set time each day if you haven&apos;t finished today&apos;s plan items yet.
        </p>
        <p className="mt-1 rounded-lg bg-amber-50 p-2 text-xs text-amber-800">
          Opt-in and scheduling are fully wired up here, but actually sending emails/texts needs an email or SMS
          provider API key that isn&apos;t configured yet — see the note on the dashboard/README. Your preferences
          are saved either way.
        </p>
      </div>

      <div className="space-y-3">
        <label className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-slate-700">Email reminders</span>
          <input
            type="checkbox"
            checked={settings.reminderEmailEnabled}
            onChange={(e) => setSettings((s) => ({ ...s, reminderEmailEnabled: e.target.checked }))}
            className="h-5 w-5"
          />
        </label>
        {settings.reminderEmailEnabled && (
          <input
            type="email"
            value={settings.reminderEmail}
            onChange={(e) => setSettings((s) => ({ ...s, reminderEmail: e.target.value }))}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        )}
      </div>

      <div className="space-y-3">
        <label className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-slate-700">Text (SMS) reminders</span>
          <input
            type="checkbox"
            checked={settings.reminderSmsEnabled}
            onChange={(e) => setSettings((s) => ({ ...s, reminderSmsEnabled: e.target.checked }))}
            className="h-5 w-5"
          />
        </label>
        {settings.reminderSmsEnabled && (
          <input
            type="tel"
            value={settings.reminderPhone}
            onChange={(e) => setSettings((s) => ({ ...s, reminderPhone: e.target.value }))}
            placeholder="+1 555 123 4567"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        )}
      </div>

      {(settings.reminderEmailEnabled || settings.reminderSmsEnabled) && (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Reminder time</label>
          <input
            type="time"
            value={settings.reminderTime}
            onChange={(e) => setSettings((s) => ({ ...s, reminderTime: e.target.value }))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && !error && <p className="text-sm text-green-600">Saved.</p>}

      <button
        onClick={save}
        disabled={saving}
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save settings"}
      </button>
    </div>
  );
}
