const SectionHeading = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-text md:text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 max-w-2xl text-sm text-muted">{subtitle}</p>}
    </div>
  );
};

export default SectionHeading;
