import './Sidebar.css';
import { FaTachometerAlt, FaHistory, FaSignOutAlt } from 'react-icons/fa';

function getLogo() {
  try {
    const data = JSON.parse(localStorage.getItem('restaurant'));
    return data && data.logo ? data.logo : null;
  } catch {
    return null;
  }
}

function getRestaurantName() {
  try {
    const data = JSON.parse(localStorage.getItem('restaurant'));
    return data && data.name ? data.name : '';
  } catch {
    return '';
  }
}

export default function Sidebar({ onNavigate, onSignOut, active }) {
  const logo = getLogo();
  const restaurantName = getRestaurantName();
  const logoUrl = logo ? `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/uploads/logos/${logo}` : null;
  return (
    <nav className="sidebar" style={{background:'#181A20',color:'#fff',width:220,minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'space-between',boxShadow:'2px 0 16px #0004'}}>
      <div>
        <div className="sidebar-title" style={{display:'flex',alignItems:'center',gap:16,padding:'32px 0 24px 0',justifyContent:'center'}}>
          {logoUrl ? (
            <img src={logoUrl} alt="logo" style={{width:54,height:54,borderRadius:'16px',objectFit:'cover',background:'#23242b',border:'2px solid #00CFFF',boxShadow:'0 2px 12px #00CFFF44'}} />
          ) : (
            <svg width="44" height="44" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="16" cy="24" rx="12" ry="4" fill="#00CFFF"/>
              <rect x="8" y="10" width="16" height="10" rx="5" fill="#06A6DF"/>
              <rect x="12" y="6" width="8" height="6" rx="4" fill="#057BAA"/>
              <rect x="20" y="13" width="6" height="5" rx="2.5" fill="#02496B"/>
            </svg>
          )}
          <span
            style={{
              fontWeight: 900,
              fontSize: '1.15rem',
              color: '#00CFFF',
              letterSpacing: 1,
              maxWidth: 110,
              wordBreak: 'break-word',
              whiteSpace: 'normal',
              display: 'inline-block',
              verticalAlign: 'middle',
              lineHeight: 1.2
            }}
          >
            {restaurantName}
          </span>
        </div>
        <ul className="sidebar-menu" style={{listStyle:'none',padding:0,margin:0}}>
          <li className={active === 'dashboard' ? 'active' : ''} onClick={() => onNavigate('dashboard')} style={{display:'flex',alignItems:'center',gap:12,padding:'14px 32px',cursor:'pointer',borderRadius:12,margin:'8px 12px',background:active==='dashboard' ? 'linear-gradient(90deg,#00CFFF33 0%,#23242b 100%)' : 'none',color:active==='dashboard' ? '#00CFFF' : '#fff',fontWeight:600,transition:'background 0.2s'}}>
            <FaTachometerAlt size={20} /> Dashboard
          </li>
          <li className={active === 'history' ? 'active' : ''} onClick={() => onNavigate('history')} style={{display:'flex',alignItems:'center',gap:12,padding:'14px 32px',cursor:'pointer',borderRadius:12,margin:'8px 12px',background:active==='history' ? 'linear-gradient(90deg,#00CFFF33 0%,#23242b 100%)' : 'none',color:active==='history' ? '#00CFFF' : '#fff',fontWeight:600,transition:'background 0.2s'}}>
            <FaHistory size={20} /> Historique
          </li>
        </ul>
      </div>
      <div style={{padding:'32px 0',display:'flex',justifyContent:'center'}}>
        <button className="sidebar-signout" onClick={onSignOut} style={{display:'flex',alignItems:'center',gap:10,background:'linear-gradient(90deg,#ef4444 0%,#23242b 100%)',color:'#fff',border:'none',borderRadius:10,padding:'12px 24px',fontWeight:700,fontSize:'1rem',boxShadow:'0 2px 8px #ef444488',cursor:'pointer',transition:'background 0.2s'}}>
          <FaSignOutAlt size={18} /> Sign out
        </button>
      </div>
    </nav>
  );
} 