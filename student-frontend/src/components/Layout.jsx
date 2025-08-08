import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children, sidebarItems }) => {
  return (
    <div>
      <Header />
      <div style={{ display: 'flex',paddingTop:"60px"}}>
        <Sidebar items={sidebarItems} />
        <div style={{ flexGrow: 1, padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
