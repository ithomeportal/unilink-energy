export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-green-900">
      {children}
    </div>
  );
}
