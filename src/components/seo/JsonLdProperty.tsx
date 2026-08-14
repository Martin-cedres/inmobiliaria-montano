import { Property } from '@/types/property';
import { generatePropertyJsonLd } from '@/utils/seo';

interface JsonLdPropertyProps {
  property: Property;
}

export default function JsonLdProperty({ property }: JsonLdPropertyProps) {
  const jsonLd = generatePropertyJsonLd(property);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
