import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0)
}

function formatDate(iso) {
  if (!iso) return 'N/A'
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function getTemplateStyles(template) {
  if (template === 'modern') {
    return {
      headerBg: '#2563EB',
      headerColor: '#FFFFFF',
      accentColor: '#2563EB',
      pageBg: '#FFFFFF',
      textColor: '#111111',
      mutedColor: '#6B7280',
      borderColor: '#F3F4F6',
      totalBg: '#2563EB',
      totalColor: '#FFFFFF',
    }
  }
  if (template === 'bold') {
    return {
      headerBg: '#111111',
      headerColor: '#FFFFFF',
      accentColor: '#FFFFFF',
      pageBg: '#111111',
      textColor: '#FFFFFF',
      mutedColor: '#6B7280',
      borderColor: '#2A2A2A',
      totalBg: 'transparent',
      totalColor: '#FFFFFF',
    }
  }
  return {
    headerBg: '#FFFFFF',
    headerColor: '#111111',
    accentColor: '#111111',
    pageBg: '#FFFFFF',
    textColor: '#111111',
    mutedColor: '#6B7280',
    borderColor: '#F3F4F6',
    totalBg: 'transparent',
    totalColor: '#111111',
  }
}

function InvoicePrintView({ inv, template }) {
  const t = getTemplateStyles(template)
  const isBold = template === 'bold'
  const isModern = template === 'modern'

  return (
    <div id="invoice-print" style={{ background: t.pageBg, fontFamily: "'Inter', sans-serif", color: t.textColor, width: '100%' }}>
      {isModern ? (
        <div style={{ background: t.headerBg, padding: '40px 48px', color: t.headerColor }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px' }}>{inv.fromName || 'Your Business'}</div>
              <div style={{ fontSize: '13px', opacity: 0.75, marginTop: '4px', whiteSpace: 'pre-line' }}>{inv.fromAddress}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', opacity: 0.75 }}>INVOICE #{inv.invoiceNumber}</div>
              <div style={{ fontSize: '30px', fontWeight: '700', letterSpacing: '-1px' }}>{formatCurrency(inv.total)}</div>
              <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.75, textTransform: 'uppercase' }}>{inv.status}</div>
            </div>
          </div>
        </div>
      ) : isBold ? (
        <div style={{ background: '#111111', padding: '48px', borderBottom: '1px solid #2A2A2A' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Invoice</div>
              <div style={{ fontSize: '44px', fontWeight: '700', letterSpacing: '-2px', lineHeight: 1, color: '#FFFFFF' }}>{formatCurrency(inv.total)}</div>
              <div style={{ fontSize: '11px', marginTop: '10px', color: '#6B7280', textTransform: 'uppercase' }}>{inv.status}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '-0.5px', color: '#FFFFFF' }}>{inv.fromName || 'Your Business'}</div>
              <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>#{inv.invoiceNumber}</div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: '48px 48px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
            <div>
              <div style={{ fontSize: '26px', fontWeight: '700', letterSpacing: '-0.5px' }}>{inv.fromName || 'Your Business'}</div>
              <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px', whiteSpace: 'pre-line' }}>{inv.fromAddress}</div>
              <div style={{ fontSize: '13px', color: '#6B7280' }}>{inv.fromEmail}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', color: '#6B7280' }}>INVOICE</div>
              <div style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px' }}>#{inv.invoiceNumber}</div>
              <div style={{ fontSize: '11px', marginTop: '6px', color: '#6B7280', textTransform: 'uppercase' }}>{inv.status}</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: isModern ? '40px 48px' : isBold ? '40px 48px' : '24px 48px' }}>
        {!isModern && !isBold && null}

        <div style={{ display: 'flex', gap: '48px', marginBottom: '40px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: isModern ? '#2563EB' : t.mutedColor, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Bill To</div>
            <div style={{ fontWeight: '600', color: t.textColor }}>{inv.clientName || 'Client'}</div>
            <div style={{ fontSize: '13px', color: t.mutedColor, whiteSpace: 'pre-line' }}>{inv.clientAddress}</div>
            <div style={{ fontSize: '13px', color: t.mutedColor }}>{inv.clientEmail}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: isModern ? '#2563EB' : t.mutedColor, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Dates</div>
            <div style={{ fontSize: '13px', color: t.textColor }}>Issued: {formatDate(inv.issueDate)}</div>
            <div style={{ fontSize: '13px', color: t.textColor }}>Due: {formatDate(inv.dueDate)}</div>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
          <thead>
            <tr style={{ background: isModern ? '#F7F7F5' : 'transparent', borderBottom: isModern ? 'none' : `2px solid ${t.borderColor}` }}>
              <th style={{ textAlign: 'left', padding: isModern ? '10px 12px' : '8px 0', fontSize: '12px', fontWeight: '600', color: t.mutedColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</th>
              <th style={{ textAlign: 'right', padding: isModern ? '10px 12px' : '8px 0', fontSize: '12px', fontWeight: '600', color: t.mutedColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Qty</th>
              <th style={{ textAlign: 'right', padding: isModern ? '10px 12px' : '8px 0', fontSize: '12px', fontWeight: '600', color: t.mutedColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rate</th>
              <th style={{ textAlign: 'right', padding: isModern ? '10px 12px' : '8px 0', fontSize: '12px', fontWeight: '600', color: t.mutedColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {(inv.lines || []).map((line, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${t.borderColor}` }}>
                <td style={{ padding: isModern ? '12px' : '12px 0', fontSize: '14px', color: t.textColor }}>{line.description}</td>
                <td style={{ padding: isModern ? '12px' : '12px 0', fontSize: '14px', textAlign: 'right', color: t.mutedColor }}>{line.qty}</td>
                <td style={{ padding: isModern ? '12px' : '12px 0', fontSize: '14px', textAlign: 'right', color: t.mutedColor }}>{formatCurrency(line.rate)}</td>
                <td style={{ padding: isModern ? '12px' : '12px 0', fontSize: '14px', textAlign: 'right', fontWeight: '500', color: t.textColor }}>{formatCurrency(parseFloat(line.qty || 0) * parseFloat(line.rate || 0))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ minWidth: '200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px', color: t.mutedColor }}>
              <span>Subtotal</span><span>{formatCurrency(inv.subtotal)}</span>
            </div>
            {isModern ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', marginTop: '8px', fontSize: '18px', fontWeight: '700', background: '#2563EB', color: '#FFFFFF', borderRadius: '8px', letterSpacing: '-0.3px' }}>
                <span>Total</span><span>{formatCurrency(inv.total)}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontSize: '18px', fontWeight: '700', borderTop: `2px solid ${isBold ? '#2A2A2A' : '#111111'}`, color: t.textColor, letterSpacing: '-0.3px' }}>
                <span>Total</span><span>{formatCurrency(inv.total)}</span>
              </div>
            )}
          </div>
        </div>

        {inv.notes && (
          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: `1px solid ${t.borderColor}` }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: isModern ? '#2563EB' : t.mutedColor, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Notes</div>
            <div style={{ fontSize: '13px', color: t.mutedColor, whiteSpace: 'pre-line' }}>{inv.notes}</div>
          </div>
        )}
      </div>
    </div>
  )
}

const ui = {
  page: { minHeight: '100vh', background: '#F7F7F5', fontFamily: "'Inter', sans-serif" },
  nav: { background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  navLogo: { fontSize: '18px', fontWeight: '700', color: '#111111', letterSpacing: '-0.5px' },
  backBtn: { background: 'none', border: 'none', color: '#6B7280', fontSize: '14px', cursor: 'pointer' },
  navCredit: { fontSize: '12px', color: '#9CA3AF', textDecoration: 'none' },
  main: { maxWidth: '800px', margin: '0 auto', padding: '40px 24px' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  printBtn: { background: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  doneBtn: { background: '#FFFFFF', color: '#111111', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  hint: { background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', fontSize: '13px', color: '#1D4ED8', lineHeight: 1.5 },
  previewWrap: { border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' },
}

export default function Download() {
  const navigate = useNavigate()
  const [inv, setInv] = useState(null)
  const [template, setTemplate] = useState('minimal')

  useEffect(() => {
    const savedInv = localStorage.getItem('docket_current')
    const savedTemplate = localStorage.getItem('docket_template')
    if (savedInv) setInv(JSON.parse(savedInv))
    if (savedTemplate) setTemplate(savedTemplate)
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const saveAndFinish = () => {
    if (!inv) return navigate('/')
    const all = JSON.parse(localStorage.getItem('docket_invoices') || '[]')
    const exists = all.findIndex(i => i.id === inv.id)
    if (exists >= 0) all[exists] = inv
    else all.unshift(inv)
    localStorage.setItem('docket_invoices', JSON.stringify(all))
    navigate('/')
  }

  if (!inv) return (
    <div style={{ ...ui.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#6B7280' }}>No invoice loaded.</p>
        <button onClick={() => navigate('/')} style={ui.printBtn}>Go Home</button>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-print, #invoice-print * { visibility: visible; }
          #invoice-print { position: fixed; top: 0; left: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div style={ui.page}>
        <nav style={ui.nav} className="no-print">
          <div style={ui.navLeft}>
            <span style={ui.navLogo}>Docket</span>
            <button style={ui.backBtn} onClick={() => navigate('/preview')}>← Back</button>
          </div>
          <a href="https://buildbyace.vercel.app" target="_blank" rel="noreferrer" style={ui.navCredit}>by ace ↗</a>
        </nav>

        <main style={ui.main}>
          <div style={ui.hint} className="no-print">
            To save as PDF: tap <strong>Download PDF</strong>, then choose <strong>Save as PDF</strong> as the destination in your print dialog.
          </div>

          <div style={ui.toolbar} className="no-print">
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#111111' }}>
              Invoice #{inv.invoiceNumber} for {inv.clientName || 'Client'}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={ui.doneBtn} onClick={saveAndFinish}>Save and Finish</button>
              <button style={ui.printBtn} onClick={handlePrint}>Download PDF</button>
            </div>
          </div>

          <div style={ui.previewWrap}>
            <InvoicePrintView inv={inv} template={template} />
          </div>
        </main>
      </div>
    </>
  )
}
