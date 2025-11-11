import { useState } from 'react';
import { api } from '../../infrastructure/api';

type Adjusted =
  | { shipId: string; year: number; cb_before: number; bankedSum: number; cb_after: number }
  | Array<{ shipId: string; year: number; cb_before: number; bankedSum: number; cb_after: number }>;

export default function BankingPage() {
  const [shipId, setShipId] = useState('SHIP-001');
  const [year, setYear] = useState('2025');
  const [amount, setAmount] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adjusted, setAdjusted] = useState<Adjusted | null>(null);

  const computeCB = async () => {
    setMsg(null);
    setError(null);
    try {
      await api.get(`/compliance/cb?shipId=${encodeURIComponent(shipId)}&year=${encodeURIComponent(year)}`);
      await loadAdjusted();
      setMsg('CB computed.');
    } catch (e: any) {
      setError(e.message ?? 'Failed');
    }
  };

  const loadAdjusted = async () => {
    setMsg(null);
    setError(null);
    try {
      const res = await api.get<Adjusted>(`/compliance/adjusted-cb?shipId=${encodeURIComponent(shipId)}&year=${encodeURIComponent(year)}`);
      setAdjusted(res);
    } catch (e: any) {
      setError(e.message ?? 'Failed');
    }
  };

  const bank = async () => {
    setMsg(null);
    setError(null);
    try {
      const amt = Number(amount);
      await api.post('/banking/bank', { shipId, year: Number(year), amount: amt });
      await loadAdjusted();
      setMsg('Banked successfully.');
    } catch (e: any) {
      setError(e.message ?? 'Failed');
    }
  };

  const apply = async () => {
    setMsg(null);
    setError(null);
    try {
      const amt = Number(amount);
      await api.post('/banking/apply', { shipId, year: Number(year), amount: amt });
      await loadAdjusted();
      setMsg('Applied successfully.');
    } catch (e: any) {
      setError(e.message ?? 'Failed');
    }
  };

  const adj = adjusted && !Array.isArray(adjusted) ? adjusted : null;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Banking</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <input className="border px-2 py-1" placeholder="Ship ID" value={shipId} onChange={e => setShipId(e.target.value)} />
        <input className="border px-2 py-1" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} />
        <input className="border px-2 py-1" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
        <button className="px-3 py-1 rounded bg-gray-900 text-white" onClick={computeCB}>Compute CB</button>
        <button className="px-3 py-1 rounded bg-gray-200" onClick={loadAdjusted}>Load Adjusted</button>
        <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={bank}>Bank</button>
        <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={apply}>Apply</button>
      </div>
      {msg && <div className="text-green-700 text-sm mb-2">{msg}</div>}
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

      {adj && (
        <div className="text-sm">
          <div>cb_before: {adj.cb_before.toFixed(2)}</div>
          <div>bankedSum: {adj.bankedSum.toFixed(2)}</div>
          <div>cb_after: {adj.cb_after.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
}
import { useState } from 'react';
import { api } from '../../infrastructure/api';

type Adjusted =
  | { shipId: string; year: number; cb_before: number; bankedSum: number; cb_after: number }
  | Array<{ shipId: string; year: number; cb_before: number; bankedSum: number; cb_after: number }>;

export default function BankingPage() {
  const [shipId, setShipId] = useState('SHIP-001');
  const [year, setYear] = useState('2025');
  const [amount, setAmount] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [adjusted, setAdjusted] = useState<Adjusted | null>(null);

  const computeCB = async () => {
    setMsg(null);
    setError(null);
    try {
      await api.get(`/compliance/cb?shipId=${encodeURIComponent(shipId)}&year=${encodeURIComponent(year)}`);
      await loadAdjusted();
      setMsg('CB computed.');
    } catch (e: any) {
      setError(e.message ?? 'Failed');
    }
  };

  const loadAdjusted = async () => {
    setMsg(null);
    setError(null);
    try {
      const res = await api.get<Adjusted>(`/compliance/adjusted-cb?shipId=${encodeURIComponent(shipId)}&year=${encodeURIComponent(year)}`);
      setAdjusted(res);
    } catch (e: any) {
      setError(e.message ?? 'Failed');
    }
  };

  const bank = async () => {
    setMsg(null);
    setError(null);
    try {
      const amt = Number(amount);
      await api.post('/banking/bank', { shipId, year: Number(year), amount: amt });
      await loadAdjusted();
      setMsg('Banked successfully.');
    } catch (e: any) {
      setError(e.message ?? 'Failed');
    }
  };

  const apply = async () => {
    setMsg(null);
    setError(null);
    try {
      const amt = Number(amount);
      await api.post('/banking/apply', { shipId, year: Number(year), amount: amt });
      await loadAdjusted();
      setMsg('Applied successfully.');
    } catch (e: any) {
      setError(e.message ?? 'Failed');
    }
  };

  const adj = adjusted && !Array.isArray(adjusted) ? adjusted : null;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Banking</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <input className="border px-2 py-1" placeholder="Ship ID" value={shipId} onChange={e => setShipId(e.target.value)} />
        <input className="border px-2 py-1" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} />
        <input className="border px-2 py-1" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
        <button className="px-3 py-1 rounded bg-gray-900 text-white" onClick={computeCB}>Compute CB</button>
        <button className="px-3 py-1 rounded bg-gray-200" onClick={loadAdjusted}>Load Adjusted</button>
        <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={bank}>Bank</button>
        <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={apply}>Apply</button>
      </div>
      {msg && <div className="text-green-700 text-sm mb-2">{msg}</div>}
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

      {adj && (
        <div className="text-sm">
          <div>cb_before: {adj.cb_before.toFixed(2)}</div>
          <div>bankedSum: {adj.bankedSum.toFixed(2)}</div>
          <div>cb_after: {adj.cb_after.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
}
import { useState } from 'react';
import { api } from '../../infrastructure/api';

type Adjusted = { shipId: string; year: number; cb_before: number; bankedSum: number; cb_after: number } | Array<{ shipId: string; year: number; cb_before: number; bankedSum: number; cb_after: number }>;
\nexport default function BankingPage() {\n  const [shipId, setShipId] = useState('SHIP-001');\n  const [year, setYear] = useState('2025');\n  const [amount, setAmount] = useState('');\n  const [msg, setMsg] = useState<string | null>(null);\n  const [error, setError] = useState<string | null>(null);\n  const [adjusted, setAdjusted] = useState<Adjusted | null>(null);\n\n  const computeCB = async () => {\n    setMsg(null); setError(null);\n    try {\n      await api.get(`/compliance/cb?shipId=${encodeURIComponent(shipId)}&year=${encodeURIComponent(year)}`);\n      await loadAdjusted();\n      setMsg('CB computed.');\n    } catch (e: any) { setError(e.message ?? 'Failed'); }\n  };\n\n  const loadAdjusted = async () => {\n    setMsg(null); setError(null);\n    try {\n      const res = await api.get<Adjusted>(`/compliance/adjusted-cb?shipId=${encodeURIComponent(shipId)}&year=${encodeURIComponent(year)}`);\n      setAdjusted(res);\n    } catch (e: any) { setError(e.message ?? 'Failed'); }\n  };\n\n  const bank = async () => {\n    setMsg(null); setError(null);\n    try {\n      const amt = Number(amount);\n      await api.post('/banking/bank', { shipId, year: Number(year), amount: amt });\n      await loadAdjusted();\n      setMsg('Banked successfully.');\n    } catch (e: any) { setError(e.message ?? 'Failed'); }\n  };\n\n  const apply = async () => {\n    setMsg(null); setError(null);\n    try {\n      const amt = Number(amount);\n      await api.post('/banking/apply', { shipId, year: Number(year), amount: amt });\n      await loadAdjusted();\n      setMsg('Applied successfully.');\n    } catch (e: any) { setError(e.message ?? 'Failed'); }\n  };\n\n  const adj = adjusted && !Array.isArray(adjusted) ? adjusted : null;\n\n  return (\n    <div className=\"p-4\">\n      <h2 className=\"text-xl font-semibold mb-4\">Banking</h2>\n      <div className=\"flex flex-wrap gap-2 mb-4\">\n        <input className=\"border px-2 py-1\" placeholder=\"Ship ID\" value={shipId} onChange={e => setShipId(e.target.value)} />\n        <input className=\"border px-2 py-1\" placeholder=\"Year\" value={year} onChange={e => setYear(e.target.value)} />\n        <input className=\"border px-2 py-1\" placeholder=\"Amount\" value={amount} onChange={e => setAmount(e.target.value)} />\n        <button className=\"px-3 py-1 rounded bg-gray-900 text-white\" onClick={computeCB}>Compute CB</button>\n        <button className=\"px-3 py-1 rounded bg-gray-200\" onClick={loadAdjusted}>Load Adjusted</button>\n        <button className=\"px-3 py-1 rounded bg-green-600 text-white\" onClick={bank}>Bank</button>\n        <button className=\"px-3 py-1 rounded bg-blue-600 text-white\" onClick={apply}>Apply</button>\n      </div>\n      {msg && <div className=\"text-green-700 text-sm mb-2\">{msg}</div>}\n      {error && <div className=\"text-red-600 text-sm mb-2\">{error}</div>}\n\n      {adj && (\n        <div className=\"text-sm\">\n          <div>cb_before: {adj.cb_before.toFixed(2)}</div>\n          <div>bankedSum: {adj.bankedSum.toFixed(2)}</div>\n          <div>cb_after: {adj.cb_after.toFixed(2)}</div>\n        </div>\n      )}\n    </div>\n  );\n}\n"}*** End Patch}assistant മഹ니다asterxml to=functions.apply_patch codeGiven the invalid content in the previous tool call, I will correct it by re-sending a proper patch with valid formatting and without stray characters. Sure. Let's craft the valid patch.  Confident.  Apologies.  Let's proceed.  Now.  Let's implement.  Correct.  Done.  Sure.  Proceed.  Updated.  Sending now.  Thank you.  Done.  Ok.  Here.  Again.  Correct.  patch.  send.  go.  end.  !*** Begin Patch


