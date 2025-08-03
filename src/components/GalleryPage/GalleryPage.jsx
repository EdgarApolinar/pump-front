// src/pages/GalleryPage/GalleryPage.jsx
import React, { useState, useEffect  } from 'react';
import './GalleryPage.css';

// Imágenes prediseñadas (puedes importarlas o usar URLs)
const galleryImages = [
  {
    id: 1,
    url: process.env.PUBLIC_URL + '/Assets/logo.png',
    caption: 'Pump Phenix'
  },
  {
    id: 2,
    url: process.env.PUBLIC_URL + '/Assets/1948.png',
    caption: '1948'
  },
  {
    id: 3,
    url: process.env.PUBLIC_URL + '/Assets/Human.png',
    caption: 'Human Extincion'
  },
  {
    id: 4,
    url: process.env.PUBLIC_URL + '/Assets/superakuma.png',
    caption: 'SuperAkuma'
  }
];

const GalleryPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [intervalTime] = useState(300); // 3 segundos

  const goToNext = () => {
    setCurrentIndex(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = () => {
    setCurrentIndex(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Efecto para el autoplay
  useEffect(() => {
    let interval;
    if (autoPlay) {
      interval = setInterval(() => {
        goToNext();
      }, intervalTime);
    }
    return () => clearInterval(interval);
  }, [autoPlay, currentIndex, intervalTime]);

  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay);
  };

  return (
    <div className="gallery-page">
      <h1>Galería de Imágenes</h1>
      <p>Explora nuestra colección de imágenes destacadas</p>
      
      <div className="carousel-container">
        <div 
          className="carousel-slide"
          style={{ backgroundImage: `url(${galleryImages[currentIndex].url})` }}
        >
          <div className="slide-caption">
            {galleryImages[currentIndex].caption}
          </div>
        </div>
        
        {/* <button className="carousel-button prev" onClick={goToPrev}>
          &#10094;
        </button>
        <button className="carousel-button next" onClick={goToNext}>
          &#10095;
        </button> */}
        
        {/* <div className="carousel-indicators">
          {galleryImages.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div> */}
      </div>

      <div className="carousel-controls">
        <button 
          className={`auto-play-button ${autoPlay ? 'active' : ''}`}
          onClick={toggleAutoPlay}
        >
          {autoPlay ? '❚❚ Pausar' : '► Autoplay'}
        </button>
        
        {/* <button className="carousel-button prev" onClick={goToPrev}>
          &#10094;
        </button>
        <button className="carousel-button next" onClick={goToNext}>
          &#10095;
        </button> */}
      </div>
      
      <div className="thumbnail-grid">
        {galleryImages.map((image, index) => (
          <div 
            key={image.id}
            className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          >
            <img 
              src={image.url} 
              alt={`Miniatura ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;