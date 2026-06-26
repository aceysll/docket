import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const TEMPLATES = ['minimal', 'modern', 'bold']

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0)
}

function formatDate(iso) {
  if (!iso) return 'N/A'
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const pillStyle = (status) => {
  const base = {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 10px',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  }
  if (status === 'paid') return { ...base, background: '#D1FAE5', color: '#065F46' }
  if (status === 'unpaid') return { ...base, background: '#FEE2E2', color: '#991B1B' }
  return { ...base, background: '#F3F4F6', color: '#374151' }
}

function MinimalTemplate({ inv }) {
  return (
    <div style={{ background: '#FFFFFF', padding: '48px', fontFamily: "'Inter', sans-serif", minHeight: '600px', color: '#111111' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px' }}>
        <div>
          <div style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px' }}>{inv.fromName || 'Your Business'}</div>
          <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px', whiteSpace: 'pre-line' }}>{inv.fromAddress}</div>
          <div style={{ fontSize: '13px', color: '#6B7280' }}>{inv.fromEmail}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>INVOICE</div>
          <div style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '-0.5px' }}>#{inv.invoiceNumber}</div>
          <div style={{ marginTop: '8px' }}><span style={pillStyle(inv.status)}>{inv.status}</span></div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '48px', marginBottom: '40px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Bill To</div>
          <div style={{ fontWeight: '600' }}>{inv.clientName || 'Client'}</div>
          <div style={{ fontSize: '13px', color: '#6B7280', whiteSpace: 'pre-line' }}>{inv.clientAddress}</div>
          <div style={{ fontSize: '13px', color: '#6B7280' }}>{inv.clientEmail}</div>
        </div>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Dates</div>
          <div style={{ fontSize: '13px' }}>Issued: {formatDate(inv.issueDate)}</div>
          <div style={{ fontSize: '13px' }}>Due: {formatDate(inv.dueDate)}</div>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #111111' }}>
            <th style={{ textAlign: 'left', padding: '8px 0', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</th>
            <th style={{ textAlign: 'right', padding: '8px 0', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Qty</th>
            <th style={{ textAlign: 'right', padding: '8px 0', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rate</th>
            <th style={{ textAlign: 'right', padding: '8px 0', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {(inv.lines || []).map((line, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
              <td style={{ padding: '12px 0', fontSize: '14px' }}>{line.description}</td>
              <td style={{ padding: '12px 0', fontSize: '14px', textAlign: 'right' }}>{line.qty}</td>
              <td style={{ padding: '12px 0', fontSize: '14px', textAlign: 'right' }}>{formatCurrency(line.rate)}</td>
              <td style={{ padding: '12px 0', fontSize: '14px', textAlign: 'right', fontWeight: '500' }}>{formatCurrency(parseFloat(line.qty || 0) * parseFloat(line.rate || 0))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ minWidth: '200px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px', color: '#6B7280' }}>
            <span>Subtotal</span><span>{formatCurrency(inv.subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontSize: '18px', fontWeight: '700', borderTop: '2px solid #111111', letterSpacing: '-0.3px' }}>
            <span>Total</span><span>{formatCurrency(inv.total)}</span>
          </div>
        </div>
      </div>

      {inv.notes && (
        <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #F3F4F6' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Notes</div>
          <div style={{ fontSize: '13px', color: '#6B7280', whiteSpace: 'pre-line' }}>{inv.notes}</div>
        </div>
      )}
    </div>
  )
}

function ModernTemplate({ inv }) {
  return (
    <div style={{ background: '#FFFFFF', fontFamily: "'Inter', sans-serif", minHeight: '600px', color: '#111111' }}>
      <div style={{ background: '#2563EB', padding: '40px 48px', color: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '26px', fontWeight: '700', letterSpacing: '-0.5px' }}>{inv.fromName || 'Your Business'}</div>
            <div style={{ fontSize: '13px', opacity: 0.75, marginTop: '4px', whiteSpace: 'pre-line' }}>{inv.fromAddress}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', opacity: 0.75, marginBottom: '2px' }}>INVOICE #{inv.invoiceNumber}</div>
            <div style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-1px' }}>{formatCurrency(inv.total)}</div>
            <div style={{ marginTop: '6px' }}><span style={{ ...pillStyle(inv.status), background: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>{inv.status}</span></div>
          </div>
        </div>
      </div>

      <div style={{ padding: '40px 48px' }}>
        <div style={{ display: 'flex', gap: '48px', marginBottom: '40px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Bill To</div>
            <div style={{ fontWeight: '600' }}>{inv.clientName || 'Client'}</div>
            <div style={{ fontSize: '13px', color: '#6B7280', whiteSpace: 'pre-line' }}>{inv.clientAddress}</div>
            <div style={{ fontSize: '13px', color: '#6B7280' }}>{inv.clientEmail}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Dates</div>
            <div style={{ fontSize: '13px' }}>Issued: {formatDate(inv.issueDate)}</div>
            <div style={{ fontSize: '13px' }}>Due: {formatDate(inv.dueDate)}</div>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
          <thead>
            <tr style={{ background: '#F7F7F5' }}>
              <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', borderRadius: '6px 0 0 6px' }}>Description</th>
              <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Qty</th>
              <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rate</th>
              <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', borderRadius: '0 6px 6px 0' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {(inv.lines || []).map((line, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '12px', fontSize: '14px' }}>{line.description}</td>
                <td style={{ padding: '12px', fontSize: '14px', textAlign: 'right' }}>{line.qty}</td>
                <td style={{ padding: '12px', fontSize: '14px', textAlign: 'right' }}>{formatCurrency(line.rate)}</td>
                <td style={{ padding: '12px', fontSize: '14px', textAlign: 'right', fontWeight: '500' }}>{formatCurrency(parseFloat(line.qty || 0) * parseFloat(line.rate || 0))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ minWidth: '200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px', color: '#6B7280' }}>
              <span>Subtotal</span><span>{formatCurrency(inv.subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', marginTop: '8px', fontSize: '18px', fontWeight: '700', background: '#2563EB', color: '#FFFFFF', borderRadius: '8px', letterSpacing: '-0.3px' }}>
              <span>Total</span><span>{formatCurrency(inv.total)}</span>
            </div>
          </div>
        </div>

        {inv.notes && (
          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #F3F4F6' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Notes</div>
            <div style={{ fontSize: '13px', color: '#6B7280', whiteSpace: 'pre-line' }}>{inv.notes}</div>
          </div>
        )}
      </div>
    </div>
  )
}

function BoldTemplate({ inv }) {
  return (
    <div style={{ background: '#111111', fontFamily: "'Inter', sans-serif", minHeight: '600px', color: '#FFFFFF' }}>
      <div style={{ padding: '48px', borderBottom: '1px solid #2A2A2A' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '13px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Invoice</div>
            <div style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '-2px', lineHeight: 1 }}>{formatCurrency(inv.total)}</div>
            <div style={{ marginTop: '12px' }}><span style={{ ...pillStyle(inv.status), background: '#2A2A2A', color: '#FFFFFF' }}>{inv.status}</span></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '26px', fontWeight: '700', letterSpacing: '-0.5px' }}>{inv.fromName || 'Your Business'}</div>
            <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>#{inv.invoiceNumber}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '40px 48px' }}>
        <div style={{ display: 'flex', gap: '48px', marginBottom: '40px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Bill To</div>
            <div style={{ fontWeight: '600' }}>{inv.clientName || 'Client'}</div>
            <div style={{ fontSize: '13px', color: '#6B7280', whiteSpace: 'pre-line' }}>{inv.clientAddress}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Dates</div>
            <div style={{ fontSize: '13px' }}>Issued: {formatDate(inv.issueDate)}</div>
            <div style={{ fontSize: '13px' }}>Due: {formatDate(inv.dueDate)}</div>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2A2A2A' }}>
              <th style={{ textAlign: 'left', padding: '8px 0', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</th>
              <th style={{ textAlign: 'right', padding: '8px 0', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Qty</th>
              <th style={{ textAlign: 'right', padding: '8px 0', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rate</th>
              <th style={{ textAlign: 'right', padding: '8px 0', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {(inv.lines || []).map((line, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #1A1A1A' }}>
                <td style={{ padding: '12px 0', fontSize: '14px' }}>{line.description}</td>
                <td style={{ padding: '12px 0', fontSize: '14px', textAlign: 'right', color: '#9CA3AF' }}>{line.qty}</td>
                <td style={{ padding: '12px 0', fontSize: '14px', textAlign: 'right', color: '#9CA3AF' }}>{formatCurrency(line.rate)}</td>
                <td style={{ padding: '12px 0', fontSize: '14px', textAlign: 'right', fontWeight: '500' }}>{formatCurrency(parseFloat(line.qty || 0) * parseFloat(line.rate || 0))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ minWidth: '200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px', color: '#6B7280' }}>
              <span>Subtotal</span><span>{formatCurrency(inv.subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontSize: '20px', fontWeight: '700', borderTop: '1px solid #2A2A2A', letterSpacing: '-0.5px' }}>
              <span>Total</span><span>{formatCurrency(inv.total)}</span>
            </div>
          </div>
        </div>

        {inv.notes && (
          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #2A2A2A' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Notes</div>
            <div style={{ fontSize: '13px', color: '#6B7280', whiteSpace: 'pre-line' }}>{inv.notes}</div>
          </div>
        )}
      </div>
    </div>
  )
}

const pageStyles = {
  page: { minHeight: '100vh', background: '#F7F7F5', fontFamily: "'Inter', sans-serif" },
  nav: { background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  navLogo: { fontSize: '18px', fontWeight: '700', color: '#111111', letterSpacing: '-0.5px' },
  backBtn: { background: 'none', border: 'none', color: '#6B7280', fontSize: '14px', cursor: 'pointer' },
  navCredit: { fontSize: '12px', color: '#9CA3AF', textDecoration: 'none' },
  main: { maxWidth: '800px', margin: '0 auto', padding: '40px 24px' },
  toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  templatePicker: { display: 'flex', gap: '8px' },
  templateBtn: (active) => ({
    padding: '8px 16px',
    borderRadius: '8px',
    border: active ? '2px solid #2563EB' : '1px solid #E5E7EB',
    background: active ? '#EFF6FF' : '#FFFFFF',
    color: active ? '#2563EB' : '#6B7280',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    textTransform: 'capitalize',
  }),
  actions: { display: 'flex', gap: '10px' },
  saveBtn: { background: '#FFFFFF', color: '#111111', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '9px 18px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  downloadBtn: { background: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  previewWrap: { border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' },
}

export default function Preview() {
  const navigate = useNavigate()
  const [inv, setInv] = useState(null)
  const [template, setTemplate] = useState('minimal')

  useEffect(() => {
    const saved = localStorage.getItem('docket_current')
    if (saved) setInv(JSON.parse(saved))
  }, [])

  const saveInvoice = () => {
    if (!inv) return
    const all = JSON.parse(localStorage.getItem('docket_invoices') || '[]')
    const exists = all.findIndex(i => i.id === inv.id)
    if (exists >= 0) all[exists] = inv
    else all.unshift(inv)
    localStorage.setItem('docket_invoices', JSON.stringify(all))
    navigate('/')
  }

  const goDownload = () => {
    if (!inv) return
    localStorage.setItem('docket_template', template)
    navigate('/download')
  }

  if (!inv) return (
    <div style={{ ...pageStyles.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#6B7280' }}>No invoice loaded.</p>
        <button onClick={() => navigate('/create')} style={pageStyles.downloadBtn}>Create Invoice</button>
      </div>
    </div>
  )

  return (
    <div style={pageStyles.page}>
      <nav style={pageStyles.nav}>
        <div style={pageStyles.navLeft}>
          <span style={pageStyles.navLogo}>Docket</span>
          <button style={pageStyles.backBtn} onClick={() => navigate('/create')}>← Edit</button>
        </div>
        <a href="https://buildbyace.vercel.app" target="_blank" rel="noreferrer" style={pageStyles.navCredit}>by ace ↗</a>
      </nav>

      <main style={pageStyles.main}>
        <div style={pageStyles.toolbar}>
          <div style={pageStyles.templatePicker}>
            {TEMPLATES.map(t => (
              <button key={t} style={pageStyles.templateBtn(template === t)} onClick={() => setTemplate(t)}>{t}</button>
            ))}
          </div>
          <div style={pageStyles.actions}>
            <button style={pageStyles.saveBtn} onClick={saveInvoice}>Save</button>
            <button style={pageStyles.downloadBtn} onClick={goDownload}>Download PDF →</button>
          </div>
        </div>

        <div style={pageStyles.previewWrap}>
          {template === 'minimal' && <MinimalTemplate inv={inv} />}
          {template === 'modern' && <ModernTemplate inv={inv} />}
          {template === 'bold' && <BoldTemplate inv={inv} />}
        </div>
      </main>
    </div>
  )
}
