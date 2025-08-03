import React from 'react';
import MainLayout from '../components/MainLayout';


const HomePage = () => {
  return (
    <MainLayout>
      <section className="hero-section">
        <h1 className="hero-title">
          <span className="hero-icon-home" />          
        </h1>
      </section>
    </MainLayout>
  );
};

export default HomePage;