import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardChart from "../components/DashboardChart";

function setFavicon(url) {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = url;
}

function getRestaurantInfo() {
  try {
    const data = JSON.parse(localStorage.getItem('restaurant'));
    return data || null;
  } catch {
    return null;
  }
}

function getLogoUrl(logo) {
  if (logo) {
    return `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/uploads/logos/${logo}`;
  }
  return null;
}

// Table de correspondance FR <-> AR
const CRITERIA_MAP = {
  "Qualité des boissons": ["Qualité des boissons", "جودة المشروبات"],
  "Qualité des plats": ["Qualité des plats", "جودة الأطباق"],
  "Service": ["Service", "الخدمة"],
  "Temps d'attente": ["Temps d'attente", "مدة الانتظار"],
  "Propreté des locaux": ["Propreté des locaux", "نظافة المكان"],
  "Hygiène alimentaire": ["Hygiène alimentaire", "نظافة الطعام"],
  "Prix de vente": ["Prix de vente", "السعر"],
  "Problèmes de commande": ["Problèmes de commande", "مشاكل في الطلب"]
};

function computeCriteriaStats(ratings) {
  // On regroupe toutes les notes sous le label FR
  const stats = {};
  Object.keys(CRITERIA_MAP).forEach(labelFr => {
    stats[labelFr] = { sum: 0, count: 0 };
  });
  ratings.forEach(r => {
    r.criteria.forEach(c => {
      Object.entries(CRITERIA_MAP).forEach(([labelFr, variants]) => {
        if (variants.includes(c.label)) {
          if (c.rating) {
            stats[labelFr].sum += c.rating;
            stats[labelFr].count++;
          }
        }
      });
    });
  });
  return stats;
}

function computeAvgEvolution(ratings, mode = 'month') {
  const groups = {};
  ratings.forEach(r => {
    const d = new Date(r.createdAt);
    let key;
    if (mode === 'day') key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    else if (mode === 'year') key = `${d.getFullYear()}`;
    else key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    if (!groups[key]) groups[key] = { sum: 0, count: 0 };
    const avg = r.criteria.reduce((acc, c) => acc + (c.rating || 0), 0) / r.criteria.length;
    groups[key].sum += avg;
    groups[key].count++;
  });
  const sorted = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  return {
    labels: sorted.map(([k]) => k),
    avgValues: sorted.map(([, v]) => v.count > 0 ? (v.sum/v.count).toFixed(2) : 0)
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard');
  const [graphMode, setGraphMode] = useState('month');
  const [historyDate, setHistoryDate] = useState("");
  const [historyDateEnd, setHistoryDateEnd] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/ratings/admin", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch {
        navigate("/admin/login");
      }
      setLoading(false);
    };
    fetchStats();
  }, [navigate]);

  // Dynamically set title and favicon
  useEffect(() => {
    const restaurant = JSON.parse(localStorage.getItem('restaurant'));
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
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  if (loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#181A20',color:'#fff'}}>Chargement...</div>;
  if (!stats) return null;

  const criteriaStats = computeCriteriaStats(stats.ratings);
  const criteriaLabels = Object.keys(criteriaStats);
  const monthly = computeAvgEvolution(stats.ratings, graphMode);
  const globalAvg = stats.total > 0 ? (stats.ratings.reduce((acc, r) => acc + r.criteria.reduce((a, c) => a + (c.rating || 0), 0)/r.criteria.length, 0) / stats.total).toFixed(2) : '-';

  // Récupérer les infos du restaurant connecté
  const restaurant = getRestaurantInfo();
  const logoUrl = getLogoUrl(restaurant && restaurant.logo);
  const restaurantName = restaurant && restaurant.name ? restaurant.name : "Feedback.ma";

  return (
    <div style={{display:'flex',background:'#181A20',minHeight:'100vh',fontFamily:'Inter,Segoe UI,sans-serif'}}>
      <Sidebar
        onNavigate={setView}
        onSignOut={handleSignOut}
        active={view}
      />
      <main style={{marginLeft:220,flex:1,minHeight:'100vh',background:'#181A20',padding:'32px 0'}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:24}}>
          {/* Widgets principaux */}
          {view === 'dashboard' && (
            <>
              <div style={{display:'flex',gap:32,marginBottom:32,flexWrap:'wrap'}}>
                <div style={{flex:1,minWidth:220,background:'linear-gradient(135deg,#23242b 60%,#00CFFF22 100%)',borderRadius:18,boxShadow:'0 4px 24px #00CFFF22',padding:32,display:'flex',flexDirection:'column',alignItems:'flex-start',justifyContent:'center',marginBottom:8,border:'1.5px solid #00CFFF33'}}>
                  <div style={{fontSize:'1.1rem',color:'#b3b8c5',fontWeight:600,marginBottom:8}}>Note générale</div>
                  <div style={{fontSize:'2.5rem',fontWeight:900,color:'#00CFFF',letterSpacing:1}}>{globalAvg}</div>
                </div>
                <div style={{flex:1,minWidth:220,background:'linear-gradient(135deg,#23242b 60%,#06A6DF22 100%)',borderRadius:18,boxShadow:'0 4px 24px #06A6DF22',padding:32,display:'flex',flexDirection:'column',alignItems:'flex-start',justifyContent:'center',marginBottom:8,border:'1.5px solid #06A6DF33'}}>
                  <div style={{fontSize:'1.1rem',color:'#b3b8c5',fontWeight:600,marginBottom:8}}>Nombre d'avis</div>
                  <div style={{fontSize:'2.5rem',fontWeight:900,color:'#06A6DF',letterSpacing:1}}>{stats.total}</div>
                </div>
              </div>
              {/* Widgets des critères */}
              <div style={{display:'flex',gap:24,flexWrap:'wrap',marginBottom:32,justifyContent:'flex-start'}}>
                {criteriaLabels.map(label => (
                  <div key={label} style={{flex:'1 1 220px',minWidth:220,background:'linear-gradient(135deg,#23242b 60%,#057BAA22 100%)',borderRadius:18,boxShadow:'0 4px 24px #057BAA22',padding:24,marginBottom:8,border:'1.5px solid #057BAA33',display:'flex',flexDirection:'column',alignItems:'flex-start',justifyContent:'center'}}>
                    <div style={{fontSize:'1.05rem',color:'#b3b8c5',fontWeight:600,marginBottom:8}}>{label}</div>
                    <div style={{fontSize:'2rem',fontWeight:800,color:'#057BAA'}}>{criteriaStats[label].count > 0 ? (criteriaStats[label].sum / criteriaStats[label].count).toFixed(2) : '-'}</div>
                  </div>
                ))}
              </div>
              {/* Graphique d'évolution */}
              <div style={{marginBottom:32,background:'#23242b',borderRadius:18,boxShadow:'0 4px 24px #00CFFF11',padding:32,border:'1.5px solid #00CFFF22'}}>
                <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:8}}>
                  <h3 style={{fontSize:'1.2rem',fontWeight:700,color:'#00CFFF',margin:'24px 0 12px'}}>Évolution de la note générale</h3>
                  <select value={graphMode} onChange={e => setGraphMode(e.target.value)} style={{padding:'6px 12px',borderRadius:8,border:'1px solid #06A6DF',background:'#23242b',color:'#00CFFF',fontWeight:600}}>
                    <option value="day">Par jour</option>
                    <option value="month">Par mois</option>
                    <option value="year">Par année</option>
                  </select>
                </div>
                <DashboardChart data={{labels: monthly.labels, values: monthly.avgValues}} label="Note générale" color="#06A6DF" />
              </div>
            </>
          )}
          {/* Historique : uniquement commentaires détaillés */}
          {view === 'history' && (
            <>
              <h3 style={{fontSize:'1.3rem',fontWeight:700,margin:'32px 0 12px',color:'#00CFFF'}}>Commentaires détaillés</h3>
              {/* Filtre date moderne */}
              <div style={{display:'flex',gap:16,alignItems:'center',marginBottom:24,background:'#23242b',padding:'18px 24px',borderRadius:14,boxShadow:'0 2px 8px #00CFFF11',border:'1.5px solid #00CFFF22',flexWrap:'wrap'}}>
                <span style={{color:'#b3b8c5',fontWeight:600,fontSize:'1.05rem'}}>Filtrer par date :</span>
                <input
                  type="date"
                  value={historyDate}
                  onChange={e => setHistoryDate(e.target.value)}
                  style={{background:'#181A20',color:'#00CFFF',border:'1.5px solid #06A6DF',borderRadius:8,padding:'8px 12px',fontWeight:600,fontSize:'1rem',outline:'none'}}
                />
                <span style={{color:'#b3b8c5',fontWeight:600,fontSize:'1.05rem'}}>à</span>
                <input
                  type="date"
                  value={historyDateEnd}
                  onChange={e => setHistoryDateEnd(e.target.value)}
                  style={{background:'#181A20',color:'#00CFFF',border:'1.5px solid #06A6DF',borderRadius:8,padding:'8px 12px',fontWeight:600,fontSize:'1rem',outline:'none'}}
                />
                {(historyDate || historyDateEnd) && (
                  <button onClick={()=>{setHistoryDate("");setHistoryDateEnd("");}} style={{marginLeft:12,background:'#ef4444',color:'#fff',border:'none',borderRadius:8,padding:'8px 16px',fontWeight:700,cursor:'pointer'}}>Réinitialiser</button>
                )}
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:24}}>
                {stats.ratings
                  .filter(r => {
                    if (!historyDate && !historyDateEnd) return true;
                    const d = new Date(r.createdAt);
                    let after = true, before = true;
                    if (historyDate) after = d >= new Date(historyDate);
                    if (historyDateEnd) before = d <= new Date(historyDateEnd + 'T23:59:59');
                    return after && before;
                  })
                  .map((r) => (
                  <div key={r._id} style={{background:'#23242b',borderRadius:16,padding:20,boxShadow:'0 2px 8px #00CFFF11',border:'1.5px solid #00CFFF22'}}>
                    <div style={{fontWeight:600,color:'#00CFFF',marginBottom:8}}>
                      {new Date(r.createdAt).toLocaleString()}
                    </div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:16}}>
                      {r.criteria.map((c, i) => (
                        <div key={i} style={{minWidth:220,marginBottom:8}}>
                          <span style={{fontWeight:600,color:'#b3b8c5'}}>{c.label} :</span>
                          <span style={{marginLeft:8,fontWeight:700,color:'#fbbf24'}}>{c.rating}★</span>
                          {c.comment && <div style={{marginLeft:8,color:'#b3b8c5',fontStyle:'italic',fontSize:'0.98em'}}>&quot;{c.comment}&quot;</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
} 