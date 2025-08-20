import { RouterProvider } from 'react-router-dom';
import router from './router';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <>
      <Toaster position='top-center' richColors />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
