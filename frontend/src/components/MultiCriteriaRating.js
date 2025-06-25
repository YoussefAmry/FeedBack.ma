import { useState } from "react";
import "./MultiCriteriaRating.css";

const CRITERIA = [
  "Qualité des boissons",
  "Qualité des plats",
  "Service",
  "Temps d'attente",
  "Propreté des locaux",
  "Hygiène alimentaire",
  "Prix de vente",
  "Problèmes de commande"
];

const CRITERIA_AR = [
  "جودة المشروبات",
  "جودة الأطباق",
  "الخدمة",
  "مدة الانتظار",
  "نظافة المكان",
  "نظافة الطعام",
  "السعر",
  "مشاكل في الطلب"
];

function StarRating({ value, onChange }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(star => (
        <span
          key={star}
          className={`star${star <= value ? " selected" : ""}`}
          onClick={() => onChange(star)}
        >★</span>
      ))}
    </div>
  );
}

export default function MultiCriteriaRating({ onSubmit, loading, language }) {
  const isArabic = language === 'ar';
  const [criteria, setCriteria] = useState(
    (isArabic ? CRITERIA_AR : CRITERIA).map(label => ({ label, rating: 0, comment: "" }))
  );

  // Si la langue change après le montage, on met à jour les labels
  // (utile si le composant reste monté)
  // eslint-disable-next-line
  if ((isArabic && criteria[0].label !== CRITERIA_AR[0]) || (!isArabic && criteria[0].label !== CRITERIA[0])) {
    setCriteria((isArabic ? CRITERIA_AR : CRITERIA).map(label => ({ label, rating: 0, comment: "" })));
  }

  const handleRating = (idx, rating) => {
    setCriteria(c =>
      c.map((item, i) => i === idx ? { ...item, rating } : item)
    );
  };

  const handleComment = (idx, comment) => {
    setCriteria(c =>
      c.map((item, i) => i === idx ? { ...item, comment } : item)
    );
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(criteria);
  };

  return (
    <form onSubmit={handleSubmit} className="multi-criteria-form" style={isArabic ? {direction:'rtl',textAlign:'right'} : {}}>
      {criteria.map((item, idx) => (
        <div key={item.label} className="critere-card">
          <div className="critere-label">{item.label}</div>
          <StarRating value={item.rating} onChange={r => handleRating(idx, r)} />
          <textarea
            className="commentaire-area"
            placeholder={isArabic ? "تعليقك (اختياري)" : "Votre commentaire (facultatif)"}
            value={item.comment}
            onChange={e => handleComment(idx, e.target.value)}
            rows={2}
            style={isArabic ? {direction:'rtl',textAlign:'right'} : {}}
          />
        </div>
      ))}
      <button
        type="submit"
        className="btn-submit"
        disabled={loading}
        style={isArabic ? {fontWeight:800,fontSize:'1.1rem',letterSpacing:0.5} : {}}
      >
        {loading ? (isArabic ? "...جاري الإرسال" : "Envoi...") : (isArabic ? "إرسال رأيي" : "Envoyer mon avis")}
      </button>
    </form>
  );
} 