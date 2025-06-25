import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("restaurant", JSON.stringify(res.data.restaurant));
      navigate("/admin/dashboard");
    } catch {
      setError("Identifiants invalides");
    }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#00CFFF 0%,#02496B 100%)'}}>
      <div style={{background:'#011C24',borderRadius:24,boxShadow:'0 4px 24px #0003',padding:40,width:'100%',maxWidth:400,display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div style={{width:64,height:64,background:'#00CFFF',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:24,boxShadow:'0 2px 8px #0002'}}>
          <span style={{fontSize:36,color:'#02496B',fontWeight:800,letterSpacing:2}}>A</span>
        </div>
        <h2 style={{fontSize:'2rem',fontWeight:800,marginBottom:16,textAlign:'center',color:'#00CFFF'}}>Connexion Admin</h2>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:18,width:'100%'}}>
          <input
            type="email"
            style={{border:'1px solid #06A6DF',background:'#011C24',color:'#fff',borderRadius:8,padding:'12px 16px',fontSize:'1rem',marginBottom:8}}
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            style={{border:'1px solid #06A6DF',background:'#011C24',color:'#fff',borderRadius:8,padding:'12px 16px',fontSize:'1rem',marginBottom:8}}
            placeholder="Mot de passe"
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