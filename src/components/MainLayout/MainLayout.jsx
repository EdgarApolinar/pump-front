import React from 'react';
import { isMobile } from 'react-device-detect';
import PropTypes from 'prop-types';
import Header from '../Header';
import Footer from '../Footer';
import './MainLayout.css';
import { App } from 'antd';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      <div style={{ position: 'relative', width: '98vw', height: '20vh', overflow: 'hidden' }}>
        {/* Video solo para desktop */}
        {!isMobile && (
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: -1
            }}
          >
            <source src="/assets/mainBg.mp4" type="video/mp4" />
          </video>
        )}
        
        {/* Imagen para móviles */}
        {isMobile && (
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: 'url(/assets/logo.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: -1
          }} />
        )}
        
        <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
          {/* <h1>Liga Yeiden xD</h1> */}
        </div>
      </div>
      <main className="main-content">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default MainLayout;