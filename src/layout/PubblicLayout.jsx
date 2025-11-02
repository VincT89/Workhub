import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
  
      <main className="flex-1 bg-gray-100 py-8 px-4 md:px-8">
        <Outlet /> {/* Renderizza le pagine */}
      </main>
 
    </div>
  );
};

export default PublicLayout;
