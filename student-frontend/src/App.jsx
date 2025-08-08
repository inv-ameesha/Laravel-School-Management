import { RouterProvider } from 'react-router-dom';
import router from './router';
import usePushNotifications from './hooks/usePushNotifications';

function App() {
  usePushNotifications();
  return <RouterProvider router={router} />;
}

export default App;
