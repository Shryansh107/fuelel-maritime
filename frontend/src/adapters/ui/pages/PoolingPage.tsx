import { useState } from 'react';
import { api } from '../../infrastructure/api';
import { useToast } from '../../../shared/toast/ToastProvider';

type AdjustedShip = { shipId: string; year: number; cb_before: number; bankedSum: number; cb_after: number };
type PoolMember = { shipId: string; cb_before: number; cb_after: number };
type PoolResponse = { poolId: number; year: number; members: PoolMember[]; sumAfter: number };

export default function PoolingPage() {
  const [year, setYear] = useState('2025');
  const [ships, setShips] = useState<AdjustedShip[]>([]);
  const [members, setMembers] = useState<Array<{ shipId: string; cb_before: string }>>([]);
  const [result, setResult] = useState<PoolResponse | null>(null);
  const toast = useToast();

  const loadShips = async () => {
    try {
      const data = await api.get<AdjustedShip[]>(`/compliance/adjusted-cb?year=${encodeURIComponent(year)}`);
      setShips(data);
      setMembers(data.map(d => ({ shipId: d.shipId, cb_before: String(d.cb_before) })));
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to load ships');
    }
  };

  const createPool = async () => {
    setResult(null);
    try {
      const body = {
        year: Number(year),
        members: members.map(m => ({ shipId: m.shipId, cb_before: Number(m.cb_before) })),
      };
      const resp = await api.post<PoolResponse>('/pools', body);
      setResult(resp);
      toast.success('Pool created');
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to create pool');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Pooling</h2>
      <div className="flex gap-2 mb-4">
        <input className="border px-2 py-1" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} />
        <button className="px-3 py-1 rounded bg-gray-900 text-white" onClick={loadShips}>Load Ships</button>
      </div>

      {members.length > 0 && (
        <div className="mb-4 overflow-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">shipId</th>
                <th className="p-2 border">cb_before</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={m.shipId} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{m.shipId}</td>
                  <td className="p-2 border">
                    <input className="border px-2 py-1 w-40" value={m.cb_before}
                      onChange={e => setMembers(curr => curr.map((x, idx) => idx === i ? { ...x, cb_before: e.target.value } : x))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {members.length > 0 && (
        <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={createPool}>Create Pool</button>
      )}

      {result && (
        <div className="mt-4">
          <div className="text-sm mb-2">Pool #{result.poolId} (year {result.year})</div>
          <div className="text-sm mb-2">Sum After: <span className={result.sumAfter >= 0 ? 'text-green-700' : 'text-red-700'}>{result.sumAfter.toFixed(2)}</span></div>
          <div className="overflow-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">shipId</th>
                  <th className="p-2 border">cb_before</th>
                  <th className="p-2 border">cb_after</th>
                </tr>
              </thead>
              <tbody>
                {result.members.map(m => (
                  <tr key={m.shipId} className="odd:bg-white even:bg-gray-50">
                    <td className="p-2 border">{m.shipId}</td>
                    <td className="p-2 border">{m.cb_before.toFixed(2)}</td>
                    <td className="p-2 border">{m.cb_after.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


