import { NextSeo, FAQPageJsonLd } from 'next-seo';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AdSlot from '../../components/AdSlot';
import CalculatorAccordion from '../../components/CalculatorAccordion';
import FAQ from '../../components/FAQ';
import SectionHeading from '../../components/SectionHeading';
import { calculatorCategories, calculators } from '../../data/calculators';
import { calculatorFaqs } from '../../data/faqs';

export default function CalculatorsPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    calculatorCategories.find((category) => calculators.some((calc) => calc.category === category.id))?.id ?? ''
  );
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const scrollToTop = () => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredCalculators = useMemo(() => {
    if (!query.trim()) return calculators;
    const search = query.toLowerCase();
    return calculators.filter(
      (calc) => calc.title.toLowerCase().includes(search) || calc.description.toLowerCase().includes(search)
    );
  }, [query]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    calculatorCategories.forEach((category) => {
      counts[category.id] = filteredCalculators.filter((calc) => calc.category === category.id).length;
    });
    return counts;
  }, [filteredCalculators]);

  useEffect(() => {
    if (query.trim()) {
      setSelectedCalculator(null);
      return;
    }

    const categoriesWithItems = calculatorCategories.filter((category) =>
      filteredCalculators.some((calc) => calc.category === category.id)
    );
    const defaultCategory = categoriesWithItems.find((category) => category.id === selectedCategory) ?? categoriesWithItems[0];

    if (!defaultCategory) return;

    if (defaultCategory.id !== selectedCategory) {
      setSelectedCategory(defaultCategory.id);
      setSelectedCalculator(null);
      return;
    }

    const activeItems = filteredCalculators.filter((calc) => calc.category === defaultCategory.id);
    if (activeItems.length === 0) {
      setSelectedCalculator(null);
      return;
    }

    if (!selectedCalculator || !activeItems.some((calc) => calc.slug === selectedCalculator)) {
      setSelectedCalculator(activeItems[0].slug);
    }
  }, [query, selectedCategory, filteredCalculators, selectedCalculator]);

  const activeCategory = calculatorCategories.find((category) => category.id === selectedCategory);
  const calculatorsInActive = useMemo(() => {
    if (!activeCategory) return [];
    return filteredCalculators.filter((calc) => calc.category === activeCategory.id);
  }, [filteredCalculators, activeCategory]);

  const selectedCalc = selectedCalculator
    ? filteredCalculators.find((calc) => calc.slug === selectedCalculator)
    : null;

  const displayCalculators = useMemo(() => {
    if (query.trim()) return filteredCalculators;
    if (selectedCalc) return [selectedCalc];
    return calculatorsInActive.slice(0, 1);
  }, [query, filteredCalculators, selectedCalc, calculatorsInActive]);

  const handleCategoryClick = (id: string) => {
    setQuery('');
    setSelectedCategory(id);
    const first = calculators.find((calc) => calc.category === id);
    setSelectedCalculator(first?.slug ?? null);
    scrollToTop();
  };

  const handleCalculatorClick = (slug: string, categoryId: string) => {
    setQuery('');
    setSelectedCategory(categoryId);
    setSelectedCalculator(slug);
    scrollToTop();
  };

  const headerTitle = query.trim()
    ? 'Search Results'
    : selectedCalc
      ? selectedCalc.title
      : activeCategory?.label ?? 'Calculators';
  const headerSubtitle = query.trim()
    ? `${filteredCalculators.length} calculators match "${query.trim()}"`
    : selectedCalc
      ? selectedCalc.description
      : activeCategory?.description ?? 'Choose a category to begin.';

  const renderCategoryNav = (onClose?: () => void) => (
    <nav className="mt-3 space-y-2 text-sm">
              {calculatorCategories.map((category) => {
                const isActive = category.id === selectedCategory;
                const categoryItems = calculators.filter((calc) => calc.category === category.id);
                return (
          <div key={category.id}>
            <button
              type="button"
              onClick={() => {
                handleCategoryClick(category.id);
                onClose?.();
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition ${
                isActive ? 'bg-base/60 text-text' : 'text-muted hover:bg-base/60 hover:text-text'
              }`}
            >
              <span>{category.label}</span>
              <span className="badge">{categoryCounts[category.id] ?? 0}</span>
            </button>
            {isActive && (
              <div className="mt-2 space-y-1 pl-3">
                {categoryItems.map((calc) => (
                  <button
                    key={calc.slug}
                    type="button"
                    onClick={() => {
                      handleCalculatorClick(calc.slug, category.id);
                      onClose?.();
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition ${
                      selectedCalculator === calc.slug
                        ? 'bg-accent/20 text-text'
                        : 'text-muted hover:bg-base/60 hover:text-text'
                    }`}
                  >
                    <span>{calc.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      <NextSeo
        title="Calculators - RupeePlanner"
        description="All financial calculators for loans, investments, tax, savings, and retirement."
      />
      <FAQPageJsonLd
        mainEntity={calculatorFaqs.map((item) => ({
          questionName: item.question,
          acceptedAnswerText: item.answer
        }))}
      />

      <section className="section-pad">
        <div className="container-max py-10">
          <SectionHeading title="Calculators" subtitle="All-in-one financial calculators for Indians" />
          <p className="max-w-2xl text-sm text-muted">
            Explore every calculator you need to plan loans, investments, tax, savings, and retirement. Each tool includes charts, Excel exports, and breakdown tables.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <input
              className="input max-w-md"
              placeholder="Search calculators (EMI, SIP, tax, retirement...)"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button
              type="button"
              className="btn-secondary lg:hidden"
              onClick={() => setIsPanelOpen(true)}
            >
              Browse Categories
            </button>
          </div>
        </div>
      </section>

      {isPanelOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close categories"
            onClick={() => setIsPanelOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col bg-surface p-5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-text">Categories</p>
              <button type="button" className="text-xs text-muted" onClick={() => setIsPanelOpen(false)}>
                Close
              </button>
            </div>
            {renderCategoryNav(() => setIsPanelOpen(false))}
          </div>
        </div>
      )}

      <section className="section-pad">
        <div className="container-max py-10">
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-6rem)] space-y-4 overflow-y-auto pr-1">
                <div className="card">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Categories</p>
                  {renderCategoryNav()}
                </div>
                <div className="card">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Quick Access</p>
                  <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
                    <Link href="/tools" className="hover:text-text">Planning Tools</Link>
                    <Link href="/blog" className="hover:text-text">Guides & Tips</Link>
                  </div>
                </div>
              </div>
            </aside>

            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="label">{headerTitle}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-text">{headerSubtitle}</h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge">{displayCalculators.length} tool</span>
                  {query.trim() && (
                    <button type="button" className="btn-secondary" onClick={() => setQuery('')}>
                      Clear Search
                    </button>
                  )}
                </div>
              </div>

              {displayCalculators.length === 0 ? (
                <div className="card">
                  <p className="text-sm font-semibold text-text">No calculators found</p>
                  <p className="mt-2 text-sm text-muted">Try adjusting your search or pick another category.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayCalculators.map((calc) => (
                    <CalculatorAccordion
                      key={calc.slug}
                      calculator={calc}
                      defaultOpen={displayCalculators.length === 1}
                    />
                  ))}
                </div>
              )}

              <AdSlot label="Calculator List Ad" adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-max py-12">
          <SectionHeading title="FAQs" subtitle="Common questions about financial calculators" />
          <FAQ items={calculatorFaqs} />
        </div>
      </section>
    </>
  );
}
