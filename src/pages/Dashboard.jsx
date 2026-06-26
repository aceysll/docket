import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F7F7F5',
    fontFamily: "'Inter', sans-serif",
  },
  nav: {
    background: '#FFFFFF',
    borderBottom: '1px solid #E5E7EB',
    padding: '0 24px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navLogo: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111111',
    letterSpacing: '-0.5px',
  },
  navCredit: {
    fontSize: '12px',
    color: '#9CA3AF',
    textDecoration: 'none',
  },
  main: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '40px 24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111111',
    letterSpacing: '-0.5px',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: '#6B7280',
    marginTop: '4px',
  },
  newBtn: {
    background: '#2563EB',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    letterSpacing: '-0.2px',
  },
  empty: {
    textAlign: 'center',
    padding: '80px 24px',
    background: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E5E7EB',
  },
  emptyIcon: {
    fontSize: '40px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111111',
    margin: '0 0 8px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#6B7280',
    margin: '0 0 24px',
  },
  emptyBtn: {
    background: '#2563EB',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  card: {
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  },
  cardLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  cardClient: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#111111',
  },
  cardMeta: {
    fontSize: '13px',
    color: '#6B7280',
  },
  cardRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px',
  },
  cardAmount: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111111',
    letterSpacing: '-0.5px',
  },
  pill: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#9CA3AF',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    marginLeft: '16px',
  },
  summary: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
  },
  stat: {
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '10px',
    padding: '16px 20px',
    flex: 1,
  },
  statLabel: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
  },
  statValue: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#111111',
    letterSpacing: '-0.5px',
  },
}

const pillStyle = (status) => {
  if (status === 'paid') return { ...styles.pill, background: '#D1FAE5', color: '#065F46' }
  if (status === 'unpaid') return { ...styles.pill, background: '#FEE2E2', color: '#991B1B' }
  return { ...styles.pill, background: '#F3F4F6', color: '#374151' }
}

function formatAmount(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('docket_invoices')
    if (saved) setInvoices(JSON.parse(saved))
  }, [])

  const deleteInvoice = (e, id) => {
    e.stopPropagation()
    const updated = invoices.filter(inv => inv.id !== id)
    setInvoices(updated)
    localStorage.setItem('docket_invoices', JSON.stringify(updated))
  }

  const openInvoice = (inv) => {
    localStorage.setItem('docket_current', JSON.stringify(inv))
    navigate('/preview')
  }

  const total = invoices.reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0)
  const unpaid = invoices.filter(inv => inv.status === 'unpaid').reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0)
  const paid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0)

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <span style={styles.navLogo}>Docket</span>
        <a href="https://buildbyace.vercel.app" target="_blank" rel="noreferrer" style={styles.navCredit}>by ace ↗</a>
      </nav>

      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Invoices</h1>
            <p style={styles.subtitle}>{invoices.length} total</p>
          </div>
          <button style={styles.newBtn} onClick={() => navigate('/create')}>+ New Invoice</button>
        </div>

        {invoices.length > 0 && (
          <div style={styles.summary}>
            <div style={styles.stat}>
              <div style={styles.statLabel}>Total Billed</div>
              <div style={styles.statValue}>{formatAmount(total)}</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statLabel}>Paid</div>
              <div style={{ ...styles.statValue, color: '#065F46' }}>{formatAmount(paid)}</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statLabel}>Unpaid</div>
              <div style={{ ...styles.statValue, color: '#991B1B' }}>{formatAmount(unpaid)}</div>
            </div>
          </div>
        )}

        {invoices.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🧾</div>
            <h2 style={styles.emptyTitle}>No invoices yet</h2>
            <p style={styles.emptyText}>Create your first invoice and it will appear here.</p>
            <button style={styles.emptyBtn} onClick={() => navigate('/create')}>Create Invoice</button>
          </div>
        ) : (
          <div style={styles.list}>
            {invoices.map(inv => (
              <div
                key={inv.id}
                style={styles.card}
                onClick={() => openInvoice(inv)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={styles.cardLeft}>
                  <div style={styles.cardClient}>{inv.clientName || 'Unnamed Client'}</div>
                  <div style={styles.cardMeta}>#{inv.invoiceNumber} · Due {formatDate(inv.dueDate)}</div>
                </div>
                <div style={styles.cardRight}>
                  <div style={styles.cardAmount}>{formatAmount(inv.total)}</div>
                  <span style={pillStyle(inv.status)}>{inv.status || 'draft'}</span>
                </div>
                <button style={styles.deleteBtn} onClick={(e) => deleteInvoice(e, inv.id)} title="Delete">×</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
