import SideNav from './side-nav';
import Header from '@/components/header'

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