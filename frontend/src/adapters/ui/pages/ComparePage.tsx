import { useEffect, useState } from 'react';
import { api } from '../../infrastructure/api';

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
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await api.get<ComparisonResponse>('/routes/comparison');
      setData(resp);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Compare</h2>
      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      {data && (
        <div className="space-y-4">
          <div className="text-sm text-gray-700">Target: {data.target.toFixed(4)} gCO₂e/MJ</div>
          <div className="overflow-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">routeId</th>
                  <th className="p-2 border">baseline ghgIntensity</th>
                  <th className="p-2 border">comparison ghgIntensity</th>
                  <th className="p-2 border">% diff</th>
                  <th className="p-2 border">compliant</th>
                </tr>
              </thead>
              <tbody>
                {data.comparisons.map(c => (
                  <tr key={c.route.id} className="odd:bg-white even:bg-gray-50">
                    <td className="p-2 border">{c.route.routeId}</td>
                    <td className="p-2 border">{data.baseline?.ghgIntensity.toFixed(2) ?? '-'}</td>
                    <td className="p-2 border">{c.route.ghgIntensity.toFixed(2)}</td>
                    <td className="p-2 border">{c.percentDiff.toFixed(2)}%</td>
                    <td className="p-2 border">{c.compliant ? '✅' : '❌'}</td>
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


