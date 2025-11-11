import { useState } from 'react';
import { api } from '../../infrastructure/api';
import { useToast } from '../../../shared/toast/ToastProvider';

type Adjusted =
  | { shipId: string; year: number; cb_before: number; bankedSum: number; cb_after: number }
  | Array<{ shipId: string; year: number; cb_before: number; bankedSum: number; cb_after: number }>;

export default function BankingPage() {
  const [shipId, setShipId] = useState('SHIP-001');
  const [year, setYear] = useState('2025');
  const [amount, setAmount] = useState('');
  const [adjusted, setAdjusted] = useState<Adjusted | null>(null);
  const toast = useToast();

  const computeCB = async () => {
    try {
      await api.get(`/compliance/cb?shipId=${encodeURIComponent(shipId)}&year=${encodeURIComponent(year)}`);
      await loadAdjusted();
      toast.success('CB computed');
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to compute CB');
    }
  };

  const loadAdjusted = async () => {
    try {
      const res = await api.get<Adjusted>(`/compliance/adjusted-cb?shipId=${encodeURIComponent(shipId)}&year=${encodeURIComponent(year)}`);
      setAdjusted(res);
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to load adjusted CB');
    }
  };

  const bank = async () => {
    try {
      const amt = Number(amount);
      await api.post('/banking/bank', { shipId, year: Number(year), amount: amt });
      await loadAdjusted();
      toast.success('Banked successfully');
    } catch (e: any) {
      toast.error(e.message ?? 'Banking failed');
    }
  };

  const apply = async () => {
    try {
      const amt = Number(amount);
      await api.post('/banking/apply', { shipId, year: Number(year), amount: amt });
      await loadAdjusted();
      toast.success('Applied successfully');
    } catch (e: any) {
      toast.error(e.message ?? 'Apply failed');
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