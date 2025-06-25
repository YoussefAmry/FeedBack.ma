import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import QRCodeGen from "../components/QRCodeGen";

const emptyForm = {
  name: "",
  ownerEmail: "",
  password: "",
  location: ""
};

export default function SuperAdmin() {
  const [form, setForm] = useState(emptyForm);
  const [restaurants, setRestaurants] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);
  const [editLogoPreview, setEditLogoPreview] = useState(null);
  const logoFileRef = useRef();
  const editLogoFileRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("superadmin") !== "1") {
      navigate("/superadmin/login");
      return;
    }
    fetchRestaurants();
    // eslint-disable-next-line
  }, []);

  const fetchRestaurants = async () => {
    const res = await api.get("/restaurants");
    setRestaurants(res.data);
  };

  const handleChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) setEditForm(f => ({ ...f, [name]: value }));
    else setForm(f => ({ ...f, [name]: value }));
  };

  const handleLogoChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (isEdit) setEditLogoPreview(url);
      else setLogoPreview(url);
    } else {
      if (isEdit) setEditLogoPreview(null);
      else setLogoPreview(null);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      // 1. Créer le restaurant
      const res = await api.post("/restaurants", form);
      const restaurantId = res.data.restaurant.id;
      // 2. Si un fichier logo est sélectionné, l'uploader
      if (logoFileRef.current && logoFileRef.current.files[0] && restaurantId) {
        const fileData = new FormData();
        fileData.append("logo", logoFileRef.current.files[0]);
        await api.post(`/restaurants/${restaurantId}/logo`, fileData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      setForm(emptyForm);
      setLogoPreview(null);
      if (logoFileRef.current) logoFileRef.current.value = "";
      setSuccess("Restaurant ajouté !");
      await fetchRestaurants();
    } catch (err) {
      setError(
        err.response?.data?.msg ||
        err.response?.data?.error ||
        err.message ||
        "Erreur"
      );
    }
  };

  const handleEdit = (r) => {
    setEditId(r._id);
    setEditForm({ ...r, password: "" });
    setEditLogoPreview(null);
    if (editLogoFileRef.current) editLogoFileRef.current.value = "";
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      // 1. Mettre à jour les infos
      await api.put(`/restaurants/${editId}`, editForm);
      // 2. Si un nouveau fichier logo est sélectionné, l'uploader
      if (editLogoFileRef.current && editLogoFileRef.current.files[0] && editId) {
        const fileData = new FormData();
        fileData.append("logo", editLogoFileRef.current.files[0]);
        const uploadRes = await api.post(`/restaurants/${editId}/logo`, fileData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        // Si l'admin modifie son propre restaurant, mettre à jour le localStorage
        const adminRestaurant = JSON.parse(localStorage.getItem("restaurant"));
        if (adminRestaurant && adminRestaurant.id === editId) {
          localStorage.setItem("restaurant", JSON.stringify({
            ...adminRestaurant,
            logo: uploadRes.data.logo
          }));
        }
      }
      setEditId(null);
      setEditLogoPreview(null);
      if (editLogoFileRef.current) editLogoFileRef.current.value = "";
      setSuccess("Restaurant mis à jour !");
      await fetchRestaurants();
    } catch (err) {
      setError(
        err.response?.data?.msg ||
        err.response?.data?.error ||
        err.message ||
        "Erreur"
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce restaurant ?")) return;
    setError(""); setSuccess("");
    try {
      await api.delete(`/restaurants/${id}`);
      setSuccess("Restaurant supprimé !");
      fetchRestaurants();
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.error || err.message || "Erreur");
    }
  };

  // Helper pour obtenir l'URL du logo
  const getLogoUrl = (restaurant) => {
    if (restaurant.logo) {
      return `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/uploads/logos/${restaurant.logo}`;
    }
    return null;
  };

  return (
    <div style={{minHeight:'100vh',background:'#f3f4f6',padding:32}}>
      <div style={{maxWidth:900,margin:'0 auto',background:'#fff',borderRadius:18,boxShadow:'0 2px 12px #0002',padding:32}}>
        <h1 style={{fontSize:'2rem',fontWeight:800,marginBottom:24,color:'#02496B'}}>Super Admin - Gestion des restaurants</h1>
        <form onSubmit={handleAdd} style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:24,alignItems:'flex-end'}}>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Nom" required style={{flex:1,padding:10,borderRadius:8,border:'1px solid #06A6DF'}} />
          <input name="ownerEmail" value={form.ownerEmail} onChange={handleChange} placeholder="Email" required style={{flex:1,padding:10,borderRadius:8,border:'1px solid #06A6DF'}} />
          <input name="password" value={form.password} onChange={handleChange} placeholder="Mot de passe" required style={{flex:1,padding:10,borderRadius:8,border:'1px solid #06A6DF'}} type="password" />
          <input name="location" value={form.location} onChange={handleChange} placeholder="Localisation" style={{flex:1,padding:10,borderRadius:8,border:'1px solid #06A6DF'}} />
          <input type="file" accept="image/*" ref={logoFileRef} onChange={e => handleLogoChange(e, false)} style={{flex:1}} />
          {logoPreview && <img src={logoPreview} alt="preview" style={{width:36,height:36,borderRadius:'50%',objectFit:'cover',border:'2px solid #00CFFF'}} />}
          <button type="submit" style={{background:'#00CFFF',color:'#02496B',padding:'10px 24px',border:'none',borderRadius:8,fontWeight:'bold',fontSize:'1rem',boxShadow:'0 2px 8px #0001',cursor:'pointer'}}>Ajouter</button>
        </form>
        {error && <div style={{color:'#ef4444',marginBottom:12}}>{error}</div>}
        {success && <div style={{color:'#06A6DF',marginBottom:12}}>{success}</div>}
        <h2 style={{fontSize:'1.2rem',fontWeight:700,margin:'24px 0 12px',color:'#00CFFF'}}>Liste des restaurants</h2>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',background:'#f9fafb',borderRadius:12,overflow:'hidden'}}>
            <thead>
              <tr style={{background:'#06A6DF',color:'#fff'}}>
                <th style={{padding:10}}>Logo</th>
                <th style={{padding:10}}>Nom</th>
                <th style={{padding:10}}>Email</th>
                <th style={{padding:10}}>Localisation</th>
                <th style={{padding:10}}>QR code</th>
                <th style={{padding:10}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map(r => (
                <tr key={r._id} style={{borderBottom:'1px solid #e5e7eb'}}>
                  <td style={{padding:10}}>
                    {r.logo ? (
                      <img src={getLogoUrl(r)} alt="logo" style={{width:36,height:36,borderRadius:'50%',objectFit:'cover',background:'#fff',border:'2px solid #00CFFF'}} />
                    ) : <span style={{color:'#ccc'}}>—</span>}
                  </td>
                  {editId === r._id ? (
                    <>
                      <td style={{padding:10}}><input name="name" value={editForm.name} onChange={e => handleChange(e, true)} style={{padding:8,borderRadius:6,border:'1px solid #06A6DF'}} /></td>
                      <td style={{padding:10}}><input name="ownerEmail" value={editForm.ownerEmail} onChange={e => handleChange(e, true)} style={{padding:8,borderRadius:6,border:'1px solid #06A6DF'}} /></td>
                      <td style={{padding:10}}><input name="location" value={editForm.location} onChange={e => handleChange(e, true)} style={{padding:8,borderRadius:6,border:'1px solid #06A6DF'}} /></td>
                      <td style={{padding:10}}>
                        <QRCodeGen value={`http://localhost:3000/rate/${r._id}`} size={64} />
                      </td>
                      <td style={{padding:10,display:'flex',gap:6}}>
                        <input type="file" accept="image/*" ref={editLogoFileRef} onChange={e => handleLogoChange(e, true)} style={{width:90}} />
                        {editLogoPreview && <img src={editLogoPreview} alt="preview" style={{width:36,height:36,borderRadius:'50%',objectFit:'cover',border:'2px solid #00CFFF'}} />}
                        <input name="password" value={editForm.password} onChange={e => handleChange(e, true)} placeholder="Nouveau mot de passe" style={{padding:8,borderRadius:6,border:'1px solid #06A6DF',width:120}} type="password" />
                        <button onClick={handleUpdate} style={{background:'#06A6DF',color:'#fff',border:'none',borderRadius:6,padding:'8px 14px',fontWeight:'bold',cursor:'pointer'}}>Enregistrer</button>
                        <button onClick={() => setEditId(null)} style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:6,padding:'8px 14px',fontWeight:'bold',cursor:'pointer'}}>Annuler</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{padding:10}}>{r.name}</td>
                      <td style={{padding:10}}>{r.ownerEmail}</td>
                      <td style={{padding:10}}>{r.location}</td>
                      <td style={{padding:10}}>
                        <QRCodeGen value={`http://localhost:3000/rate/${r._id}`} size={64} />
                      </td>
                      <td style={{padding:10}}>
                        <button onClick={() => handleEdit(r)} style={{background:'#00CFFF',color:'#02496B',border:'none',borderRadius:6,padding:'8px 14px',fontWeight:'bold',cursor:'pointer'}}>Modifier</button>
                        <button onClick={() => handleDelete(r._id)} style={{background:'#ef4444',color:'#fff',border:'none',borderRadius:6,padding:'8px 14px',fontWeight:'bold',cursor:'pointer',marginLeft:6}}>Supprimer</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 