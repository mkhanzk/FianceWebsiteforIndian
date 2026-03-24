import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import { RequestModalProvider } from './RequestModalContext';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <RequestModalProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <Breadcrumbs />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </RequestModalProvider>
  );
};

export default Layout;
