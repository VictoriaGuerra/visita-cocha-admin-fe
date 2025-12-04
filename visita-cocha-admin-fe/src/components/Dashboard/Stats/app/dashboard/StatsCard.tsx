export default function StatsCard({
  title,
  value,
  children,
  icon,
}: {
  title: string;
  value: string | number;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5 border" style={{ borderColor: 'var(--ion-color-light-shade)' }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-gray-400 dark:text-gray-400 uppercase tracking-wide">{title}</div>
          <div className="mt-1 text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
        </div>
        {icon ? (
          <div
            className="w-12 h-12 flex items-center justify-center rounded-full"
            style={{ backgroundColor: 'var(--ion-color-tertiary-tint)', color: 'var(--ion-color-tertiary-contrast)' }}
          >
            {icon}
          </div>
        ) : (
          <div className="w-12 h-12" />
        )}
      </div>
      {children && <div className="mt-3 text-sm text-gray-500 dark:text-gray-300">{children}</div>}
    </div>
  );
}
