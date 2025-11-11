type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  const classes = 'animate-pulse bg-gray-200 rounded-md' + (className ? ` ${className}` : '');
  return <div className={classes} />;
}


