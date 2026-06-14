import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-panel">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-600 text-sm font-semibold text-white">
            SF
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-950">SocialFlow</h1>
            <p className="text-sm text-slate-500">Demo giriş ekranı</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">E-posta</span>
            <input
              type="email"
              className="focus-ring mt-1 w-full rounded-md border-slate-200"
              defaultValue="demo@socialflow.local"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Şifre</span>
            <input
              type="password"
              className="focus-ring mt-1 w-full rounded-md border-slate-200"
              defaultValue="demo-password"
            />
          </label>
        </div>

        <Link
          href="/dashboard"
          className="focus-ring mt-6 inline-flex w-full items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Demo panele gir
        </Link>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Bu fazda Supabase Auth bağlantısı kurulmadı. Gerçek kimlik doğrulama sonraki adımda
          eklenecek.
        </p>
      </section>
    </main>
  );
}
