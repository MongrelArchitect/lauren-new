import { Outlet } from 'react-router-dom';

import Footer from '@components/Footer';
import Nav from '@components/Nav';

export default function Root() {
  return (
    <div>
      <Nav />
      <Outlet />
      <Footer />
    </div>
  );
}
