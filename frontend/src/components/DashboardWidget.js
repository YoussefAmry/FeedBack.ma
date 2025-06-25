export default function DashboardWidget({ title, value, color = '#00CFFF', children }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 18,
      boxShadow: '0 2px 12px #0001',
      padding: 24,
      minWidth: 160,
      minHeight: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      borderLeft: `6px solid ${color}`,
      position: 'relative',
      flex: 1,
      margin: 8
    }}>
      <div style={{fontSize: '1.05rem', color: '#02496B', fontWeight: 600, marginBottom: 8}}>{title}</div>
      <div style={{fontSize: '2.1rem', fontWeight: 800, color}}>{value}</div>
      {children}
    </div>
  );
} 