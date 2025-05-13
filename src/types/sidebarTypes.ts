export type NavItem = {
  title: string;
  submenu: boolean;
  icon: React.ElementType;
  path: string;
};

export type SidebarProps = {
  darkMode: boolean;
  role: string;
  isSidebarVisible: boolean;
  toggleSidebar: () => void;
  open: boolean;
};