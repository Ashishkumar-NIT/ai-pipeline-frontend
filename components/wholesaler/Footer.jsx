export default function Footer() {
  return (
    <footer className="mt-16 border-t border-celestique-border bg-white px-6 py-8">
      <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-celestique-muted">
          &copy; {new Date().getFullYear()} Wholesaler Dashboard. All rights reserved.
        </p>
        <p className="text-xs text-celestique-border">Powered by Celestique</p>
      </div>
    </footer>
  );
}
