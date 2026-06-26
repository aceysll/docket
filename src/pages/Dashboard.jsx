import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

function formatDate(iso) {
  if (!iso) return 'N/A'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

const pillStyle = (status) => {
  const base = {
    fontSize: '11px', fontWeight: '600', padding: '3px 9px',
    borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap',
  }
  if (status === 'paid') return { ...base, background: '#D1FAE5', color: '#065F46' }
  if (status === 'unpaid') return { ...base, background: '#FEE2E2', color: '#991B1B' }
  return { ...base, background: '#F3F4F6', color: '#6B7280' }
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const saved = localStorage.getItem('docket_invoices')
    if (saved) setInvoices(JSON.parse(saved))
  }, [])

  const deleteInvoice = (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Delete this invoice?')) return
    const updated = invoices.filter(inv => inv.id !== id)
    setInvoices(updated)
    localStorage.setItem('docket_invoices', JSON.stringify(updated))
  }

  const openInvoice = (inv) => {
    localStorage.setItem('docket_current', JSON.stringify(inv))
    navigate('/preview')
  }

  const filtered = filter === 'all' ? invoices : invoices.filter(i => i.status === filter)
  const total = invoices.reduce((s, i) => s + (parseFloat(i.total) || 0), 0)
  const paid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (parseFloat(i.total) || 0), 0)
  const unpaid = invoices.filter(i => i.status === 'unpaid').reduce((s, i) => s + (parseFloat(i.total) || 0), 0)
  const unpaidCount = invoices.filter(i => i.status === 'unpaid').length

  return (
    <div style={{ minHeight: '100vh', background: '#F7F7F5', fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px', fontWeight: '800', color: '#111111', letterSpacing: '-0.5px' }}>Docket</span>
          <span style={{ fontSize: '11px', fontWeight: '600', background: '#2563EB', color: '#fff', borderRadius: '4px', padding: '2px 6px', letterSpacing: '0.3px' }}>BETA</span>
        </div>
        <a href="https://buildbyace.vercel.app" target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#9CA3AF', textDecoration: 'none' }}>by ace</a>
      </nav>

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px' }}>

        {invoices.length === 0 ? (
          /* Empty state */
          <div>
            <div style={{ marginBottom: '48px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#111111', letterSpacing: '-1px', margin: '0 0 8px' }}>Your invoices,<br />all in one place.</h1>
              <p style={{ fontSize: '15px', color: '#6B7280', margin: 0 }}>Create professional invoices in seconds. No account needed.</p>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '48px 32px', textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧾</div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111111', margin: '0 0 8px' }}>No invoices yet</h2>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 28px' }}>Create your first invoice and get paid faster.</p>
              <button
                onClick={() => navigate('/create')}
                style={{ background: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '10px', padding: '14px 32px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', letterSpacing: '-0.2px' }}
              >
                Create Invoice
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              {[
                { icon: '⚡', title: 'Fast', desc: 'Invoice ready in under 2 minutes' },
                { icon: '🎨', title: 'Branded', desc: 'Upload your logo, pick a template' },
                { icon: '📥', title: 'PDF Ready', desc: 'Download and send instantly' },
              ].map(f => (
                <div key={f.title} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', marginBottom: '8px' }}>{f.icon}</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#111111', marginBottom: '4px' }}>{f.title}</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: 1.4 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Dashboard with invoices */
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#111111', letterSpacing: '-0.5px', margin: '0 0 4px' }}>Invoices</h1>
                {unpaidCount > 0 && (
                  <p style={{ fontSize: '13px', color: '#991B1B', fontWeight: '500', margin: 0 }}>
                    {unpaidCount} invoice{unpaidCount > 1 ? 's' : ''} awaiting payment
                  </p>
                )}
              </div>
              <button
                onClick={() => navigate('/create')}
                style={{ background: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '10px 18px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                + New
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px 20px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Billed</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#111111', letterSpacing: '-0.5px' }}>{formatCurrency(total)}</div>
              </div>
              <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px 20px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Paid</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#065F46', letterSpacing: '-0.5px' }}>{formatCurrency(paid)}</div>
              </div>
              <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px 20px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Owed</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: unpaid > 0 ? '#991B1B' : '#111111', letterSpacing: '-0.5px' }}>{formatCurrency(unpaid)}</div>
              </div>
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {['all', 'unpaid', 'paid', 'draft'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: 'none',
                    background: filter === f ? '#111111' : '#FFFFFF',
                    color: filter === f ? '#FFFFFF' : '#6B7280',
                    boxShadow: filter === f ? 'none' : '0 0 0 1px #E5E7EB',
                    textTransform: 'capitalize',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Invoice list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF', fontSize: '14px' }}>
                  No {filter} invoices.
                </div>
              ) : filtered.map(inv => (
                <div
                  key={inv.id}
                  onClick={() => openInvoice(inv)}
                  style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#111111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {inv.clientName || 'Unnamed Client'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                      #{inv.invoiceNumber} · Due {formatDate(inv.dueDate)} · {timeAgo(inv.createdAt)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, marginLeft: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '17px', fontWeight: '800', color: '#111111', letterSpacing: '-0.5px' }}>
                        {formatCurrency(inv.total, inv.currency)}
                      </div>
                      <div style={{ marginTop: '4px', display: 'flex', justifyContent: 'flex-end' }}>
                        <span style={pillStyle(inv.status)}>{inv.status || 'draft'}</span>
                      </div>
                    </div>
                    <button
                      onClick={e => deleteInvoice(e, inv.id)}
                      style={{ background: 'none', border: 'none', color: '#D1D5DB', fontSize: '18px', cursor: 'pointer', padding: '4px', borderRadius: '4px', lineHeight: 1 }}
                      title="Delete"
                    >
                      x
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
