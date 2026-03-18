export default function Footer() {
  return (
    <footer className="mt-0 border-t border-celestique-border bg-white px-6 py-6">
      <div className="mx-auto max-w-7xl w-full flex flex-row items-center justify-between">
        <p className="font-gilroy text-sm text-celestique-muted">
          {new Date().getFullYear()} All rights reserved &copy; Jwels India
        </p>
        <p className="font-gilroy text-sm">Crafted with&#129655;in blr</p>
      </div>
    </footer>
  );
}
