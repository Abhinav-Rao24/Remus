import React from 'react';
import TopNav from '@/components/layouts/TopNav';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard content will go here */}
      </main>
    </div>
  );
};

export default Dashboard;