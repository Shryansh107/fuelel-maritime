import { useEffect, useState } from 'react';
import { api } from '../../infrastructure/api';
import { useToast } from '../../../shared/toast/ToastProvider';
import { Skeleton } from '../../../shared/ui/Skeleton';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { sleep } from '../../../shared/utils/sleep';

type RouteRow = {
  id: number;
  routeId: string;
  ghgIntensity: number;
};

type ComparisonResponse = {
  baseline: RouteRow | null;
  target: number;
  comparisons: Array<{ route: RouteRow; percentDiff: number; compliant: boolean }>;
};

export default function ComparePage() {
  const [data, setData] = useState<ComparisonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const resp = await api.get<ComparisonResponse>('/routes/comparison');
      setData(resp);
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to load comparisons');
    } finally {
      await sleep(300);
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-4">
      <h2 className="mb-4">Compare</h2>
      {loading && (
        <div className="card p-4 space-y-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}
      {!loading && data && data.comparisons.length === 0 && <EmptyState title="No comparison data" message="Set a baseline or add routes." />}
      {!loading && data && data.comparisons.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm text-gray-700">Target: {data.target.toFixed(4)} gCO₂e/MJ</div>
          <div className="card overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="p-2">routeId</th>
                  <th className="p-2">baseline ghgIntensity</th>
                  <th className="p-2">comparison ghgIntensity</th>
                  <th className="p-2">% diff</th>
                  <th className="p-2">compliant</th>
                </tr>
              </thead>
              <tbody>
                {data.comparisons.map(c => (
                  <tr key={c.route.id} className="odd:bg-white even:bg-gray-50">
                    <td className="p-2">{c.route.routeId}</td>
                    <td className="p-2">{data.baseline?.ghgIntensity.toFixed(2) ?? '-'}</td>
                    <td className="p-2">{c.route.ghgIntensity.toFixed(2)}</td>
                    <td className="p-2">{c.percentDiff.toFixed(2)}%</td>
                    <td className="p-2">{c.compliant ? '✅' : '❌'}</td>
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


