const SectionHeading = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <div className="mb-8">
      <p className="label">{title}</p>
      <h2 className="mt-2 text-2xl font-semibold text-text md:text-3xl">{subtitle}</h2>
    </div>
  );
};

export default SectionHeading;
