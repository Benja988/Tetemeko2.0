'use client';

import CategoriesPageLayout from "@/components/admin/settings/categories/CategoriesPageLayout";

export default function CategoriesPage() {
  return (
    <CategoriesPageLayout
      heading="Podcast Categories"
      fixedFilter="podcast"  
      showFilter={false}       
    />
  );
}
