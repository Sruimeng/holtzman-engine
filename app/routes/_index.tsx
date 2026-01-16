import { useTranslation } from 'react-i18next';

const features = [
  {
    icon: 'i-carbon-lightning',
    title: 'React Router v7',
    desc: 'File-based routing with SPA mode',
  },
  {
    icon: 'i-carbon-paint-brush',
    title: 'UnoCSS',
    desc: 'Atomic CSS with instant HMR',
  },
  {
    icon: 'i-carbon-translate',
    title: 'i18n Ready',
    desc: '7 languages out of the box',
  },
  {
    icon: 'i-carbon-moon',
    title: 'Dark Mode',
    desc: 'System preference + manual toggle',
  },
  {
    icon: 'i-carbon-code',
    title: 'TypeScript',
    desc: 'Strict type checking enabled',
  },
  {
    icon: 'i-carbon-cube',
    title: 'Zustand',
    desc: 'Lightweight state management',
  },
];

const techStack = [
  { name: 'React 19', url: 'https://react.dev' },
  { name: 'React Router v7', url: 'https://reactrouter.com' },
  { name: 'Vite 7', url: 'https://vite.dev' },
  { name: 'UnoCSS', url: 'https://unocss.dev' },
  { name: 'TypeScript', url: 'https://typescriptlang.org' },
  { name: 'Zustand', url: 'https://zustand.docs.pmnd.rs' },
];

export default function Index() {
  const { t } = useTranslation('common');

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 inline-flex items-center gap-2 border border-border rounded-full bg-background px-4 py-2 text-sm text-muted">
          <span className="i-carbon-rocket inline-block h-4 w-4" />
          {t('hero.badge', 'Production Ready Template')}
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-6xl">
          <span className="text-primary">Holtzman</span> Engine
        </h1>

        <p className="mb-8 max-w-xl text-lg text-muted">
          {t(
            'hero.desc',
            'A modern React SPA template with everything you need to build fast, scalable applications.',
          )}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-white font-medium transition-opacity hover:opacity-90"
          >
            <span className="i-carbon-logo-github h-5 w-5" />
            GitHub
          </a>
          <a
            href="#features"
            className="inline-flex items-center gap-2 border border-border rounded-lg px-6 py-3 font-medium transition-colors hover:bg-foreground/5"
          >
            {t('hero.explore', 'Explore Features')}
            <span className="i-carbon-arrow-down h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            {t('features.title', 'Features')}
          </h2>

          <div className="grid gap-6 lg:grid-cols-3 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="border border-border rounded-xl p-6 transition-colors hover:border-primary/50"
              >
                <span className={`${f.icon} mb-4 block h-8 w-8 text-primary`} />
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="border-t border-border px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold">{t('stack.title', 'Tech Stack')}</h2>

          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech) => (
              <a
                key={tech.name}
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-border rounded-lg px-4 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
              >
                {tech.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8 text-center text-sm text-muted">
        <p>Built with Holtzman Engine Template</p>
      </footer>
    </div>
  );
}
