type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
  nonce?: string;
};

export function JsonLd({ data, nonce }: JsonLdProps) {
  const payload = Array.isArray(data) ? data : [data];

  return (
    <>
      {payload.map((entry) => (
        <script
          key={JSON.stringify(entry)}
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}
    </>
  );
}
