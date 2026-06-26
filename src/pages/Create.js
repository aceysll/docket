import { useState } from 'react'
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
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  navLogo: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#111111',
    letterSpacing: '-0.5px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#6B7280',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '4px 0',
  },
  navCredit: {
    fontSize: '12px',
    color: '#9CA3AF',
    textDecoration: 'none',
  },
  main: {
    maxWidth: '640px',
    margin: '0 auto',
    padding: '40px 24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111111',
    letterSpacing: '-0.5px',
    margin: '0 0 32px',
  },
  section: {
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '16px',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
    marginBottom: '16px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '14px',
    color: '#111111',
    background: '#FFFFFF',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: "'Inter', sans-serif",
  },
  textarea: {
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '14px',
    color: '#111111',
    background: '#FFFFFF',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: "'Inter', sans-serif",
    resize: 'vertical',
    minHeight: '80px',
  },
  lineItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end',
    marginBottom: '12px',
  },
  lineDesc: { flex: 3 },
  lineQty: { flex: 1 },
  lineRate: { flex: 1 },
  lineTotal: {
    flex: 1,
    fontSize: '14px',
    fontWeight: '600',
    color: '#111111',
    paddingBottom: '10px',
    textAlign: 'right',
    minWidth: '60px',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#9CA3AF',
    fontSize: '20px',
    cursor: 'pointer',
    paddingBottom: '8px',
    lineHeight: 1,
  },
  addLineBtn: {
    background: 'none',
    border: '1px dashed #D1D5DB',
    borderRadius: '8px',
    padding: '10px',
    width: '100%',
    fontSize: '14px',
    color: '#6B7280',
    cursor: 'pointer',
    marginTop: '4px',
  },
  totalsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#6B7280',
    padding: '8px 0',
    borderTop: '1px solid #F3F4F6',
  },
  totalsTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '18px',
    fontWeight: '700',
    color: '#111111',
    padding: '12px 0 0',
    letterSpacing: '-0.3px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  previewBtn: {
    flex: 1,
    background: '#2563EB',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  saveBtn: {
    flex: 1,
    background: '#FFFFFF',
    color: '#111111',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
}

function calcLineTotal(qty, rate) {
  const q = parseFloat(qty) || 0
  const r = parseFloat(rate) || 0
  return q * r
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function generateInvoiceNumber() {
  const saved = localStorage.getItem('docket_invoice_counter')
  const next = saved ? parseInt(saved) + 1 : 1001
  localStorage.setItem('docket_invoice_counter', next.toString())
  return next.toString()
}

const defaultLine = () => ({ id: generateId(), description: '', qty: '1', rate: '' })

export default function Create() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    invoiceNumber: generateInvoiceNumber(),
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: '',
    status: 'unpaid',
    fromName: '',
    fromEmail: '',
    fromAddress: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    notes: '',
  })

  const [lines, setLines] = useState([defaultLine()])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const setLine = (id, key, val) => setLines(ls => ls.map(l => l.id === id ? { ...l, [key]: val } : l))
  const addLine = () => setLines(ls => [...ls, defaultLine()])
  const removeLine = (id) => setLines(ls => ls.filter(l => l.id !== id))

  const subtotal = lines.reduce((sum, l) => sum + calcLineTotal(l.qty, l.rate), 0)
  const total = subtotal

  const buildInvoice = () => ({
    ...form,
    id: generateId(),
    lines,
    subtotal,
    total,
    createdAt: new Date().toISOString(),
  })

  const goPreview = () => {
    const inv = buildInvoice()
    localStorage.setItem('docket_current', JSON.stringify(inv))
    navigate('/preview')
  }

  const saveDraft = () => {
    const inv = { ...buildInvoice(), status: 'draft' }
    const saved = JSON.parse(localStorage.getItem('docket_invoices') || '[]')
    saved.unshift(inv)
    localStorage.setItem('docket_invoices', JSON.stringify(saved))
    navigate('/')
  }

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <span style={styles.navLogo}>Docket</span>
          <button style={styles.backBtn} onClick={() => navigate('/')}>← Back</button>
        </div>
        <a href="https://buildbyace.vercel.app" target="_blank" rel="noreferrer" style={styles.navCredit}>by ace ↗</a>
      </nav>

      <main style={styles.main}>
        <h1 style={styles.title}>New Invoice</h1>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Invoice Details</div>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Invoice Number</label>
              <input style={styles.input} value={form.invoiceNumber} onChange={e => set('invoiceNumber', e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Status</label>
              <select style={styles.input} value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Issue Date</label>
              <input style={styles.input} type="date" value={form.issueDate} onChange={e => set('issueDate', e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Due Date</label>
              <input style={styles.input} type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>From</div>
          <div style={styles.field}>
            <label style={styles.label}>Your Name or Business</label>
            <input style={styles.input} placeholder="Ace Studio" value={form.fromName} onChange={e => set('fromName', e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" placeholder="you@email.com" value={form.fromEmail} onChange={e => set('fromEmail', e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Address</label>
            <textarea style={styles.textarea} placeholder="Street, City, Country" value={form.fromAddress} onChange={e => set('fromAddress', e.target.value)} />
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Bill To</div>
          <div style={styles.field}>
            <label style={styles.label}>Client Name or Business</label>
            <input style={styles.input} placeholder="Client Co." value={form.clientName} onChange={e => set('clientName', e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" placeholder="client@email.com" value={form.clientEmail} onChange={e => set('clientEmail', e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Address</label>
            <textarea style={styles.textarea} placeholder="Street, City, Country" value={form.clientAddress} onChange={e => set('clientAddress', e.target.value)} />
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Line Items</div>
          {lines.map((line, i) => (
            <div key={line.id} style={styles.lineItem}>
              <div style={{ ...styles.field, ...styles.lineDesc, marginBottom: 0 }}>
                {i === 0 && <label style={styles.label}>Description</label>}
                <input style={styles.input} placeholder="Service or product" value={line.description} onChange={e => setLine(line.id, 'description', e.target.value)} />
              </div>
              <div style={{ ...styles.field, ...styles.lineQty, marginBottom: 0 }}>
                {i === 0 && <label style={styles.label}>Qty</label>}
                <input style={styles.input} type="number" min="0" placeholder="1" value={line.qty} onChange={e => setLine(line.id, 'qty', e.target.value)} />
              </div>
              <div style={{ ...styles.field, ...styles.lineRate, marginBottom: 0 }}>
                {i === 0 && <label style={styles.label}>Rate</label>}
                <input style={styles.input} type="number" min="0" placeholder="0.00" value={line.rate} onChange={e => setLine(line.id, 'rate', e.target.value)} />
              </div>
              <div style={{ ...styles.lineTotal, paddingBottom: i === 0 ? '10px' : '10px' }}>
                {formatCurrency(calcLineTotal(line.qty, line.rate))}
              </div>
              {lines.length > 1 && (
                <button style={styles.removeBtn} onClick={() => removeLine(line.id)}>×</button>
              )}
            </div>
          ))}
          <button style={styles.addLineBtn} onClick={addLine}>+ Add line item</button>

          <div style={{ marginTop: '20px' }}>
            <div style={styles.totalsRow}>
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div style={styles.totalsTotal}>
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Notes</div>
          <textarea
            style={styles.textarea}
            placeholder="Payment terms, bank details, thank you note..."
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
          />
        </div>

        <div style={styles.actions}>
          <button style={styles.saveBtn} onClick={saveDraft}>Save Draft</button>
          <button style={styles.previewBtn} onClick={goPreview}>Preview Invoice →</button>
        </div>
      </main>
    </div>
  )
}
