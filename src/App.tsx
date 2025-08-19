import { RouterProvider } from 'react-router-dom';
import router from './router';
import { SidebarProvider } from './components/ui/sidebar';

function App() {
  return (
    <SidebarProvider>
      <RouterProvider router={router} />
    </SidebarProvider>
  );
}

export default App;
