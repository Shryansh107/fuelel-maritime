import { useState } from 'react';
import { api } from '../../infrastructure/api';
import { useToast } from '../../../shared/toast/ToastProvider';
import { Skeleton } from '../../../shared/ui/Skeleton';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { sleep } from '../../../shared/utils/sleep';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../../components/ui/table';
import { Select } from '../../../components/ui/select';

type AdjustedShip = { shipId: string; year: number; cb_before: number; bankedSum: number; cb_after: number };
type PoolMember = { shipId: string; cb_before: number; cb_after: number };
type PoolResponse = { poolId: number; year: number; members: PoolMember[]; sumAfter: number };

export default function PoolingPage() {
  const [year, setYear] = useState('2025');
  const [ships, setShips] = useState<AdjustedShip[]>([]);
  const [members, setMembers] = useState<Array<{ shipId: string; cb_before: string }>>([]);
  const [result, setResult] = useState<PoolResponse | null>(null);
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const computeGreedy = () => {
    const inputs = members.map(m => ({ shipId: m.shipId, cb_before: Number(m.cb_before) }));
    const surpluses = inputs.filter(m => m.cb_before > 0).sort((a, b) => b.cb_before - a.cb_before);
    const deficits = inputs.filter(m => m.cb_before < 0).sort((a, b) => a.cb_before - b.cb_before);
    const afterMap = new Map<string, number>(inputs.map(m => [m.shipId, m.cb_before]));
    for (const s of surpluses) {
      let sRemain = afterMap.get(s.shipId)!;
      for (const d of deficits) {
        const dRemain = afterMap.get(d.shipId)!;
        if (sRemain <= 0) break;
        if (dRemain >= 0) continue;
        const transfer = Math.min(sRemain, Math.abs(dRemain));
        sRemain -= transfer;
        afterMap.set(s.shipId, sRemain);
        afterMap.set(d.shipId, dRemain + transfer);
      }
    }
    const afterList = inputs.map(m => ({ shipId: m.shipId, cb_before: m.cb_before, cb_after: afterMap.get(m.shipId)! }));
    const sumAfter = afterList.reduce((acc, m) => acc + m.cb_after, 0);
    return { afterList, sumAfter };
  };

  const validity = (() => {
    const { afterList, sumAfter } = computeGreedy();
    let ok = sumAfter >= 0;
    let reason: string | null = ok ? null : 'Pool sum must be ≥ 0';
    if (ok) {
      for (const m of afterList) {
        if (m.cb_before < 0 && m.cb_after < m.cb_before) {
          ok = false; reason = `Deficit ship ${m.shipId} would exit worse`; break;
        }
        if (m.cb_before > 0 && m.cb_after < 0) {
          ok = false; reason = `Surplus ship ${m.shipId} would exit negative`; break;
        }
      }
    }
    return { ok, reason, sumAfter, afterList };
  })();

  const loadShips = async () => {
    setLoading(true);
    try {
      const data = await api.get<AdjustedShip[]>(`/compliance/adjusted-cb?year=${encodeURIComponent(year)}`);
      setShips(data);
      setMembers(data.map(d => ({ shipId: d.shipId, cb_before: String(d.cb_before) })));
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to load ships');
    } finally {
      await sleep(150);
      setLoading(false);
    }
  };

  const createPool = async () => {
    // optimistic
    const { afterList, sumAfter } = validity;
    const prev = result;
    setResult({ poolId: -1, year: Number(year), members: afterList, sumAfter });
    try {
      const body = {
        year: Number(year),
        members: members.map(m => ({ shipId: m.shipId, cb_before: Number(m.cb_before) })),
      };
      const resp = await api.post<PoolResponse>('/pools', body);
      setResult(resp);
      toast.success('Pool created');
    } catch (e: any) {
      setResult(prev ?? null);
      toast.error(e.message ?? 'Failed to create pool');
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Pooling</h2>
      <div className="flex gap-2 mb-4">
        {/* Use years from routes/filters if available */}
        <YearSelect value={year} onChange={setYear} />
        <Button onClick={loadShips}>Load Ships</Button>
      </div>

      {loading && (
        <Card className="mb-4 p-4 space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </Card>
      )}
      {!loading && members.length === 0 && <EmptyState title="No ships loaded" message="Load ships to configure a pool." />}
      {!loading && members.length > 0 && (
        <Card className="mb-4 overflow-auto">
          <Table>
            <Thead>
              <Tr>
                <Th>shipId</Th>
                <Th>cb_before</Th>
                <Th>cb_after (preview)</Th>
              </Tr>
            </Thead>
            <Tbody>
              {members.map((m, i) => (
                <Tr key={m.shipId} className="odd:bg-white even:bg-gray-50">
                  <Td>{m.shipId}</Td>
                  <Td>
                    <Input className="w-40" value={m.cb_before}
                      onChange={e => setMembers(curr => curr.map((x, idx) => idx === i ? { ...x, cb_before: e.target.value } : x))}
                    />
                  </Td>
                  <Td>{validity.afterList.find(x => x.shipId === m.shipId)?.cb_after.toFixed(2)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Card>
      )}

      {members.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="text-sm">Pool Sum: <span className={validity.sumAfter >= 0 ? 'text-green-700' : 'text-red-700'}>{validity.sumAfter.toFixed(2)}</span></div>
          {!validity.ok && <div className="text-sm text-red-700">{validity.reason}</div>}
          <Button disabled={!validity.ok} onClick={createPool}>Create Pool</Button>
        </div>
      )}

      {result && (
        <div className="mt-4">
          <div className="text-sm mb-2">Pool #{result.poolId} (year {result.year})</div>
          <div className="text-sm mb-2">Sum After: <span className={result.sumAfter >= 0 ? 'text-green-700' : 'text-red-700'}>{result.sumAfter.toFixed(2)}</span></div>
          <Card className="overflow-auto">
            <Table>
              <Thead>
                <Tr>
                  <Th>shipId</Th>
                  <Th>cb_before</Th>
                  <Th>cb_after</Th>
                </Tr>
              </Thead>
              <Tbody>
                {result.members.map(m => (
                  <Tr key={m.shipId} className="odd:bg-white even:bg-gray-50">
                    <Td>{m.shipId}</Td>
                    <Td>{m.cb_before.toFixed(2)}</Td>
                    <Td>{m.cb_after.toFixed(2)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>
        </div>
      )}
    </div>
  );
}

function YearSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [years, setYears] = useState<number[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const f = await api.get<{ vesselTypes: string[]; fuelTypes: string[]; years: number[] }>('/routes/filters');
        setYears(f.years);
      } catch {
        setYears([]);
      }
    })();
  }, []);
  if (years.length === 0) {
    return <Input className="w-28" placeholder="Year" value={value} onChange={e => onChange(e.target.value)} />;
  }
  return (
    <Select className="w-28" value={value} onChange={e => onChange(e.target.value)}>
      {years.map(y => <option key={y} value={String(y)}>{y}</option>)}
    </Select>
  );
}


