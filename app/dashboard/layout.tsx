import SideNav from './side-nav';
import Header from '@/components/header'

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: '%s | Dashboard',
    default: 'Account',
  }
};

export default function layout({ children } : { children: React.ReactNode}) {
  return (
    <div className="dashboard-shell">
      <div className="dashboard-sidebar">
        <SideNav />
      </div>
      <div className="dashboard-main">
        <Header visibility='auth' current='/dashboard'/>
        {children}
        </div>
    </div>
  );
}