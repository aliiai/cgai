import { BrowserRouter, useRoutes } from 'react-router-dom';
import { Suspense } from 'react';
import { allRoutes } from './routes';
import './App.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Routes component
const AppRoutes = () => {
  const routes = useRoutes(allRoutes);
  return routes;
};

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
