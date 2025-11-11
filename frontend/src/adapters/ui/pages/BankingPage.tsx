import { useState } from 'react';
import { api } from '../../infrastructure/api';
import { useToast } from '../../../shared/toast/ToastProvider';
import { Icons } from '../../../shared/icons';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

type Adjusted =
  | { shipId: string; year: number; cb_before: number; bankedSum: number; cb_after: number }
  | Array<{ shipId: string; year: number; cb_before: number; bankedSum: number; cb_after: number }>;

export default function BankingPage() {
  const [shipId, setShipId] = useState('SHIP-001');
  const [year, setYear] = useState('2025');
  const [amount, setAmount] = useState('');
  const [adjusted, setAdjusted] = useState<Adjusted | null>(null);
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const computeCB = async () => {
    setBusy(true);
    try {
      await api.get(`/compliance/cb?shipId=${encodeURIComponent(shipId)}&year=${encodeURIComponent(year)}`);
      await loadAdjusted();
      toast.success('CB computed');
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to compute CB');
    } finally {
      setBusy(false);
    }
  };

  const loadAdjusted = async () => {
    setBusy(true);
    try {
      const res = await api.get<Adjusted>(`/compliance/adjusted-cb?shipId=${encodeURIComponent(shipId)}&year=${encodeURIComponent(year)}`);
      setAdjusted(res);
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to load adjusted CB');
    } finally {
      setBusy(false);
    }
  };

  const bank = async () => {
    const amt = Number(amount);
    if (!adj) {
      toast.error('Compute CB first');
      return;
    }
    const prev = adj;
    // optimistic: increase bankedSum and cb_after
    setAdjusted({ ...adj, bankedSum: adj.bankedSum + amt, cb_after: adj.cb_after + amt });
    setBusy(true);
    try {
      await api.post('/banking/bank', { shipId, year: Number(year), amount: amt });
      toast.success('Banked successfully');
    } catch (e: any) {
      setAdjusted(prev);
      toast.error(e.message ?? 'Banking failed');
    } finally {
      setBusy(false);
    }
  };

  const apply = async () => {
    const amt = Number(amount);
    if (!adj) {
      toast.error('Compute CB first');
      return;
    }
    const prev = adj;
    // optimistic: reduce bankedSum and increase cb_after
    setAdjusted({ ...adj, bankedSum: adj.bankedSum - amt, cb_after: adj.cb_after + amt });
    setBusy(true);
    try {
      await api.post('/banking/apply', { shipId, year: Number(year), amount: amt });
      toast.success('Applied successfully');
    } catch (e: any) {
      setAdjusted(prev);
      toast.error(e.message ?? 'Apply failed');
    } finally {
      setBusy(false);
    }
  };

  const adj = adjusted && !Array.isArray(adjusted) ? adjusted : null;

  return (
    <div className="p-4">
      <h2 className="mb-4">Banking</h2>

      <Card className="p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Input className="w-full" placeholder="Ship ID" value={shipId} onChange={e => setShipId(e.target.value)} />
          <Input className="w-full" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} />
          <Input className="w-full" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
          <div className="flex gap-2">
            <Button className="w-full" onClick={computeCB}><Icons.Calculator className="mr-2" /> Compute</Button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={loadAdjusted}><Icons.Refresh className="mr-2" /> Load Adjusted</Button>
          <Button onClick={bank}><Icons.Download className="mr-2" /> Bank</Button>
          <Button onClick={apply}><Icons.Upload className="mr-2" /> Apply</Button>
        </div>
      </Card>
      {busy && (
        <div className="card p-4 space-y-2">
          <div className="text-sm text-gray-700">Loading…</div>
          <div className="animate-pulse h-12 bg-gray-200 rounded-md" />
        </div>
      )}
      {!busy && adj && (
        <Card className="p-4 text-sm">
          <div>cb_before: {adj.cb_before.toFixed(2)}</div>
          <div>bankedSum: {adj.bankedSum.toFixed(2)}</div>
          <div>cb_after: {adj.cb_after.toFixed(2)}</div>
        </Card>
      )}
    </div>
  );
}