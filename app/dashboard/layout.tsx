import SideNav from './side-nav';
import Header from '@/components/header'

export default function layout({ children } : { children: React.ReactNode}) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">
        <Header visibility='auth' current='/dashboard'/>
        {children}
        </div>
    </div>
  );
}