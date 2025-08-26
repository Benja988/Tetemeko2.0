'use client';

import CategoriesPageLayout from "@/components/admin/settings/categories/CategoriesPageLayout";

export default function CategoriesPage() {
  return (
    <CategoriesPageLayout
      heading="News Categories"
      fixedFilter="news"  
      showFilter={false}       
    />
  );
}
