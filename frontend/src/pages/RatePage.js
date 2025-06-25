import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import MultiCriteriaRating from "../components/MultiCriteriaRating";

function setFavicon(url) {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = url;
}

export default function RatePage() {
  const { restaurantId } = useParams();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [language, setLanguage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRestaurant() {
      try {
        const res = await api.get(`/restaurants/${restaurantId}`);
        setRestaurant(res.data);
      } catch {
        setRestaurant(null);
      }
    }
    fetchRestaurant();
  }, [restaurantId]);

  // Dynamically set title and favicon
  useEffect(() => {
    if (restaurant) {
      document.title = restaurant.name;
      if (restaurant.logo) {
        setFavicon(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/uploads/logos/${restaurant.logo}`);
      } else {
        setFavicon("/favicon.ico");
      }
    } else {
      document.title = "Feedback.ma";
      setFavicon("/favicon.ico");
    }
  }, [restaurant]);

  const handleSubmit = async (criteria) => {
    setLoading(true);
    try {
      await api.post(`/ratings/${restaurantId}`, { criteria });
      setSent(true);
    } catch {
      alert("Erreur lors de l'envoi !");
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#00CFFF 0%,#02496B 100%)'}}>
        <div style={{background:'#fff',borderRadius:24,boxShadow:'0 4px 24px #0003',padding:40,maxWidth:400,display:'flex',flexDirection:'column',alignItems:'center'}}>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginBottom:16}}>
            <circle cx="30" cy="30" r="30" fill="#00CFFF"/>
            <path d="M18 32L27 41L43 23" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2 style={{fontSize:'1.7rem',fontWeight:800,marginBottom:8,color:'#02496B',textAlign:'center'}}>Merci pour votre avis !</h2>
          <div style={{color:'#06A6DF',fontWeight:600,textAlign:'center'}}>Votre retour a bien été pris en compte.</div>
        </div>
      </div>
    );
  }

  // Construction de l'URL du logo
  let logoUrl = null;
  if (restaurant && restaurant.logo) {
    logoUrl = `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/uploads/logos/${restaurant.logo}`;
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#00CFFF 0%,#02496B 100%)',padding:32}}>
      <div style={{width:'100%',maxWidth:700,background:'#fff',borderRadius:24,boxShadow:'0 4px 24px #0003',padding:32}}>
        {/* Affichage du logo et du nom du restaurant */}
        {restaurant && (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:24}}>
            {logoUrl ? (
              <img src={logoUrl} alt="logo" style={{width:64,height:64,borderRadius:'50%',objectFit:'cover',background:'#fff',border:'2px solid #00CFFF',marginBottom:8}} />
            ) : (
              <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginBottom:8}}>
                <ellipse cx="16" cy="24" rx="12" ry="4" fill="#00CFFF"/>
                <rect x="8" y="10" width="16" height="10" rx="5" fill="#06A6DF"/>
                <rect x="12" y="6" width="8" height="6" rx="4" fill="#057BAA"/>
                <rect x="20" y="13" width="6" height="5" rx="2.5" fill="#02496B"/>
              </svg>
            )}
            <div style={{fontWeight:800,fontSize:'1.3rem',color:'#00CFFF',textAlign:'center'}}>{restaurant.name}</div>
          </div>
        )}
        {/* Sélecteur de langue */}
        {!language && (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:24,margin:'32px 0'}}>
            <div style={{fontWeight:700,fontSize:'1.2rem',color:'#02496B',marginBottom:8}}>Choisissez votre langue</div>
            <div style={{display:'flex',gap:24}}>
              <button onClick={()=>setLanguage('fr')} style={{background:'#00CFFF',color:'#fff',border:'none',borderRadius:12,padding:'16px 32px',fontWeight:800,fontSize:'1.1rem',boxShadow:'0 2px 8px #00CFFF22',cursor:'pointer',transition:'background 0.2s',display:'flex',alignItems:'center',gap:10}}>
                <span role="img" aria-label="fr">🇫🇷</span> Français
              </button>
              <button onClick={()=>setLanguage('ar')} style={{background:'#06A6DF',color:'#fff',border:'none',borderRadius:12,padding:'16px 32px',fontWeight:800,fontSize:'1.1rem',boxShadow:'0 2px 8px #06A6DF22',cursor:'pointer',transition:'background 0.2s',display:'flex',alignItems:'center',gap:10}}>
                <span role="img" aria-label="ar">🇲🇦</span> العربية
              </button>
            </div>
          </div>
        )}
        {/* Formulaire d'avis */}
        {language && <>
          <h1 style={{fontSize:'2.2rem',fontWeight:800,marginBottom:32,textAlign:'center',color:'#00CFFF'}}>
            {language === 'ar' ? 'أضف رأيك' : 'Donnez votre avis'}
          </h1>
          <MultiCriteriaRating onSubmit={handleSubmit} loading={loading} language={language} />
        </>}
      </div>
    </div>
  );
} 