interface ProductInfoProps {
  productName: string;
  productSlug: string;
}

const PRODUCT_DESCRIPTIONS: Record<string, string> = {
  "rouge-chaotique":
    "A chaotic and passionate fragrance, deep red and intense. Saffron, Plum, Praline and Patchouli weave together in a dark, sophisticated symphony.",
  "bal-d-afrique":
    "An ode to Africa and a celebration of its influence on modern culture. Marigold, African violet, musk and Cedarwood.",
  bibliotheque:
    "The smell of knowledge — rich woods, iris and vanilla create an atmosphere of intellectual warmth.",
  default:
    "A sensory experience that transcends the ordinary. Each note is carefully chosen to evoke memory and emotion.",
};

export function ProductInfo({
  productName,
  productSlug,
}: ProductInfoProps): React.JSX.Element {
  const description =
    PRODUCT_DESCRIPTIONS[productSlug] ?? PRODUCT_DESCRIPTIONS.default;

  return (
    <div className="mb-8">
      {/* Product title — Sk-Modernist Bold 26px, uppercase, tracking -0.5px */}
      <h1 className="font-bold text-[26px] leading-[1.5] tracking-[-0.5px] uppercase text-black mb-16">
        {productName}
      </h1>

      {/* Description — Sk-Modernist Regular 18px, uppercase, line-height 1.8 */}
      <p className="font-normal text-[18px] leading-[1.8] uppercase text-black">
        {description}
      </p>
    </div>
  );
}
