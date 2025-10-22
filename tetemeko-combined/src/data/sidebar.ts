

// data/sidebar.ts (updated with icons)
export interface NavItem {
  label: string
  href: string
  icon?: string
  subItems?: { label: string; href: string; icon?: string }[]
}

export const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: 'LayoutDashboard'
  },
  {
    label: 'Users',
    href: '/admin/dashboard/users',
    icon: 'Users',
    subItems: [
      { label: 'Registered Users', href: '/admin/dashboard/users', icon: 'User' },
      { label: 'Authors', href: '/admin/dashboard/users/authors', icon: 'UserCheck' },
    ],
  },
  {
    label: 'Stations',
    href: '/admin/dashboard/stations',
    icon: 'Radio'
  },
  {
    label: 'News',
    href: '/admin/dashboard/news',
    icon: 'Newspaper',
    subItems: [
      { label: 'All News', href: '/admin/dashboard/news', icon: 'List' },
      { label: 'Create News', href: '/admin/dashboard/news/create', icon: 'PlusCircle' },
      { label: 'Categories', href: '/admin/dashboard/news/categories', icon: 'Tag' },
    ],
  },
  {
    label: 'Podcasts',
    href: '/admin/dashboard/podcasts',
    icon: 'Mic',
    subItems: [
      { label: 'All Podcasts', href: '/admin/dashboard/podcasts', icon: 'List' },
      // { label: 'Create Podcast', href: '/admin/dashboard/podcasts/create', icon: 'PlusCircle' },
      { label: 'Categories', href: '/admin/dashboard/podcasts/categories', icon: 'Tag' },
    ],
  },
  // {
  //   label: 'Marketplace',
  //   href: '/admin/dashboard/marketplace',
  //   icon: 'ShoppingCart',
  //   subItems: [
  //     { label: 'All Products', href: '/admin/dashboard/marketplace', icon: 'Package' },
  //     { label: 'Add Product', href: '/admin/dashboard/marketplace/create', icon: 'PlusCircle' },
  //     { label: 'Categories', href: '/admin/dashboard/marketplace/categories', icon: 'Tag' },
  //     { label: 'Orders', href: '/admin/dashboard/marketplace/orders', icon: 'ShoppingBag' },
  //   ],
  // },
  // {
  //   label: 'Ads',
  //   href: '/admin/dashboard/ads',
  //   icon: 'Megaphone',
  //   subItems: [
  //     { label: 'All Ads', href: '/admin/dashboard/ads', icon: 'List' },
  //     { label: 'Create Ad', href: '/admin/dashboard/ads/create', icon: 'PlusCircle' },
  //     { label: 'Ad Campaigns', href: '/admin/dashboard/ads/campaigns', icon: 'BarChart3' },
  //   ],
  // },
  {
    label: 'Settings',
    href: '/admin/dashboard/settings',
    icon: 'Settings',
    subItems: [
      // { label: 'General', href: '/admin/dashboard/settings', icon: 'Settings' },
      { label: 'Categories', href: '/admin/dashboard/settings/categories', icon: 'Tag' },
      // { label: 'Appearance', href: '/admin/dashboard/settings/appearance', icon: 'Palette' },
    ],
  },
]