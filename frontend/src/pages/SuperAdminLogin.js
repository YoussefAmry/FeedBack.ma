import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SUPERADMIN_PASSWORD = "superadmin2024"; // À modifier si besoin

export default function SuperAdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (password === SUPERADMIN_PASSWORD) {
      localStorage.setItem("superadmin", "1");
      navigate("/superadmin");
    } else {
      setError("Mot de passe incorrect");
    }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#00CFFF 0%,#02496B 100%)'}}>
      <div style={{background:'#fff',borderRadius:24,boxShadow:'0 4px 24px #0003',padding:40,maxWidth:400,display:'flex',flexDirection:'column',alignItems:'center'}}>
        <h2 style={{fontSize:'2rem',fontWeight:800,marginBottom:16,textAlign:'center',color:'#00CFFF'}}>Super Admin</h2>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:18,width:'100%'}}>
          <input
            type="password"
            style={{border:'1px solid #06A6DF',background:'#fff',color:'#02496B',borderRadius:8,padding:'12px 16px',fontSize:'1rem',marginBottom:8}}
            placeholder="Mot de passe superadmin"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div style={{color:'#ef4444',fontSize:'0.98rem',marginBottom:8}}>{error}</div>}
          <button
            type="submit"
            style={{background:'#00CFFF',color:'#02496B',padding:'12px 0',border:'none',borderRadius:8,fontWeight:'bold',fontSize:'1.1rem',marginTop:8,boxShadow:'0 2px 8px #0001',cursor:'pointer',transition:'background 0.2s'}}
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
} 