import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Explorer from './pages/Explorer';
import ChatAI from './pages/ChatAI';
import Connexion from './pages/Connexion';
import VideoDetail from './pages/VideoDetail';
import Layout from './layout/layout';
import OAuthCallback from './pages/Oauthcallback';
import ProtectedRoute from './components/ProtectedRoute'; 
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <div className="app">
      <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />} > 
            <Route index element={<Home/>}/>
            <Route
              path="explorer"
              element={
                <ProtectedRoute>
                  <Explorer />
                </ProtectedRoute>
              }
            />
            <Route
              path="chatai"
              element={
                <ProtectedRoute>
                  <ChatAI />
                </ProtectedRoute>
              }
            />
            <Route path="connexion" element={<Connexion/>} />
            <Route path="video-detail/:id" element={<VideoDetail/>}  />
            <Route path="/auth-success" element={<OAuthCallback />} />
          </Route>
        </Routes>
    </div>
  );
}
export default App;