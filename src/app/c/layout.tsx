export default function PatientIntakeRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] bg-[color:var(--background)]">{children}</div>
  );
}
