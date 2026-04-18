import type { Metadata } from "next";
import { ProductPageClient } from "@/components/shop/ProductPageClient";

interface ProductPageProps {
  params: {
    product: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const productName = decodeURIComponent(params.product)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: productName,
    description: `Discover ${productName} by Byredo.`,
  };
}

export default function ProductPage({
  params,
}: ProductPageProps): React.JSX.Element {
  return <ProductPageClient productSlug={params.product} />;
}
