import Link from "next/link";

export function CtaSection(): React.JSX.Element {
  return (
    <section className="bg-byredo-cream px-6 py-24 md:px-12">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <h2 className="font-serif text-4xl md:text-5xl tracking-wider uppercase leading-tight">
          Discover the World of Byredo
        </h2>
        <p className="text-byredo-gray-500 text-sm leading-relaxed">
          From iconic fragrances to handcrafted leather goods — each piece is a
          memory waiting to be made.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-byredo-black text-byredo-white text-xs tracking-widest uppercase hover:bg-byredo-gray-700 transition-colors duration-300"
          >
            Shop Now
          </Link>
          <Link
            href="/shop?collection=new"
            className="inline-block px-8 py-3 border border-byredo-black text-xs tracking-widest uppercase hover:bg-byredo-black hover:text-byredo-white transition-all duration-300"
          >
            View Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
