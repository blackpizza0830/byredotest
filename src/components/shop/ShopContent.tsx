"use client";

import { useState } from "react";
import { ShopFilter } from "./ShopFilter";
import { ShopGrid } from "./ShopGrid";

export function ShopContent(): React.JSX.Element {
  const [activeFilter, setActiveFilter] = useState("ALL");

  return (
    <>
      <ShopFilter onFilterChange={setActiveFilter} />
      <ShopGrid activeFilter={activeFilter} />
    </>
  );
}
