import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GalleryPage from './components/GalleryPage'
import MainLayout from './components/MainLayout';
import Clandestina from './pages/Clandestina';
import ClandestinaMain from './pages/ClandestinaMain';
import Agregar_semanas_canciones from './pages/Agregar_semanas_canciones';
import SongsAdmin from './pages/SongsAdmin';
import WeekSongs from './pages/WeekSongs';
import UserSongWeek from './pages/UserSongWeek';

// import AboutPage from './pages/AboutPage';
// import ContactPage from './pages/ContactPage';
// import LoginPage from './pages/LoginPage';



function RouteApp() {
  useEffect(() => {
    document.title = "Pump It Up League V1";
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ramdom" element={<MainLayout><GalleryPage></GalleryPage></MainLayout>}/>
        <Route path="/clandestina" element={<Clandestina></Clandestina>}/>
        <Route path="/clandestina-main" element={<ClandestinaMain></ClandestinaMain>}/>
        <Route path="/semana-add" element={<Agregar_semanas_canciones></Agregar_semanas_canciones>}/>
        <Route path="/song-admi" element={<SongsAdmin></SongsAdmin>}/>
        <Route path="/week-songs-admi" element={<WeekSongs></WeekSongs>}/>
        <Route path="/user-week-admin" element={<UserSongWeek></UserSongWeek>}/>
        

        {/* <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} /> */}
        {/* Otras rutas */}
      </Routes>
    </Router>
  );
}

export default RouteApp;