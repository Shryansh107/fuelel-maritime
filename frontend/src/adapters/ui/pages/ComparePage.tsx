import { useEffect, useState } from 'react';
import { api } from '../../infrastructure/api';
import { useToast } from '../../../shared/toast/ToastProvider';
import { Skeleton } from '../../../shared/ui/Skeleton';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { sleep } from '../../../shared/utils/sleep';
import { Card } from '../../../components/ui/card';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../../components/ui/table';

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
      await sleep(150);
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2>Compare</h2>
        {data && (
          <div className="px-3 py-1 rounded-md bg-blue-600 text-white font-semibold whitespace-nowrap">
            Target: {data.target.toFixed(4)} gCO₂e/MJ
          </div>
        )}
      </div>
      {loading && (
        <Card className="p-4 space-y-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </Card>
      )}
      {!loading && data && data.comparisons.length === 0 && <EmptyState title="No comparison data" message="Set a baseline or add routes." />}
      {!loading && data && data.comparisons.length > 0 && (
        <div className="space-y-6">
          <Card className="overflow-auto">
            <Table>
              <Thead>
                <Tr>
                  <Th>Route ID</Th>
                  <Th>Baseline GHG Intensity</Th>
                  <Th>Comparison GHG Intensity</Th>
                  <Th>% Diff</Th>
                  <Th>Compliant</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.comparisons.map(c => (
                  <Tr key={c.route.id} className="odd:bg-white even:bg-gray-50">
                    <Td>{c.route.routeId}</Td>
                    <Td>{data.baseline?.ghgIntensity.toFixed(2) ?? '-'}</Td>
                    <Td>{c.route.ghgIntensity.toFixed(2)}</Td>
                    <Td>{c.percentDiff.toFixed(2)}%</Td>
                    <Td>{c.compliant ? '✅' : '❌'}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>

          {/* Simple SVG bar chart comparing baseline vs route ghgIntensity */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium">GHG Intensity Comparison</div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1"><span className="inline-block h-2 w-4 bg-gray-800 rounded-sm" /> Baseline</div>
                <div className="flex items-center gap-1"><span className="inline-block h-2 w-4 bg-blue-600 rounded-sm" /> Route</div>
              </div>
            </div>
            <ChartBaselineVsRoutes
              baseline={data.baseline?.ghgIntensity ?? null}
              items={data.comparisons.map(c => ({ id: c.route.routeId, value: c.route.ghgIntensity }))}
            />
          </Card>
        </div>
      )}
    </div>
  );
}

type ChartItem = { id: string; value: number };
function ChartBaselineVsRoutes({ baseline, items }: { baseline: number | null; items: ChartItem[] }) {
  const padding = 24;
  const width = Math.max(360, items.length * 60 + padding * 2);
  const height = 180;
  const maxValue = Math.max(
    baseline ?? 0,
    ...items.map(i => i.value),
  ) || 1;
  const barWidth = 22;
  const gap = 18;
  const groupWidth = baseline !== null ? barWidth * 2 + gap : barWidth;
  const startX = padding;
  const baselineColor = '#111827'; // gray-900
  const routeColor = '#2563eb'; // blue-600

  return (
    <svg width={width} height={height} role="img" aria-label="GHG Intensity chart">
      {/* axes */}
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e5e7eb" />
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e5e7eb" />

      {items.map((item, idx) => {
        const groupX = startX + idx * (groupWidth + gap);
        const routeH = (item.value / maxValue) * (height - padding * 2);
        const routeY = height - padding - routeH;
        const baseH = baseline !== null ? (baseline / maxValue) * (height - padding * 2) : 0;
        const baseY = height - padding - baseH;
        return (
          <g key={item.id}>
            {baseline !== null && (
              <rect x={groupX} y={baseY} width={barWidth} height={baseH} fill={baselineColor} rx="3" />
            )}
            <rect x={groupX + (baseline !== null ? barWidth + 4 : 0)} y={routeY} width={barWidth} height={routeH} fill={routeColor} rx="3" />
            {/* labels */}
            <text x={groupX + (baseline !== null ? (barWidth + 4) : 0) + barWidth / 2} y={height - padding + 12} textAnchor="middle" fontSize="10" fill="#374151">
              {item.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}


