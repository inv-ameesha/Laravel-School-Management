import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <div style={{ display: 'flex',paddingTop:"60px"}}>
        <Sidebar />
        <div style={{ flexGrow: 1, padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
