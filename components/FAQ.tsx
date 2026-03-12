const FAQ = ({ items }: { items: { question: string; answer: string }[] }) => {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details key={item.question} className="rounded-2xl border border-white/10 bg-surface p-4">
          <summary className="cursor-pointer text-sm font-semibold text-text">
            {item.question}
          </summary>
          <p className="mt-2 text-sm text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
};

export default FAQ;
