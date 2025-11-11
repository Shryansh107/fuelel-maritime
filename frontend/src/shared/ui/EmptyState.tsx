type EmptyProps = {
  title: string;
  message?: string;
};

export function EmptyState({ title, message }: EmptyProps) {
  return (
    <div className="card p-6 text-center text-sm text-gray-600">
      <div className="font-medium text-gray-800 mb-1">{title}</div>
      {message && <div>{message}</div>}
    </div>
  );
}


