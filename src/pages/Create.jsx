import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD - US Dollar' },
  { code: 'GBP', symbol: '£', label: 'GBP - British Pound' },
  { code: 'EUR', symbol: '€', label: 'EUR - Euro' },
  { code: 'NGN', symbol: '₦', label: 'NGN - Nigerian Naira' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD - Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', label: 'AUD - Australian Dollar' },
  { code: 'GHS', symbol: 'GH₵', label: 'GHS - Ghanaian Cedi' },
  { code: 'KES', symbol: 'KSh', label: 'KES - Kenyan Shilling' },
  { code: 'ZAR', symbol: 'R', label: 'ZAR - South African Rand' },
  { code: 'JPY', symbol: '¥', label: 'JPY - Japanese Yen' },
]

function calcLineTotal(qty, rate) {
  return (parseFloat(qty) || 0) * (parseFloat(rate) || 0)
}

function formatCurrency(amount, currency) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount)
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

const s = {
  page: { minHeight:'100vh', background:'#F7F7F5', fontFamily:"'Inter', sans-serif" },
  nav: { background:'#FFFFFF', borderBottom:'1px solid #E5E7EB', padding:'0 24px', height:'56px', display:'flex', alignItems:'center', justifyContent:'space-between' },
  navLeft: { display:'flex', alignItems:'center', gap:'16px' },
  navLogo: { fontSize:'18px', fontWeight:'800', color:'#111111', letterSpacing:'-0.5px' },
  backBtn: { background:'none', border:'none', color:'#6B7280', fontSize:'14px', cursor:'pointer' },
  navCredit: { fontSize:'12px', color:'#9CA3AF', textDecoration:'none' },
  main: { maxWidth:'640px', margin:'0 auto', padding:'40px 24px' },
  title: { fontSize:'24px', fontWeight:'800', color:'#111111', letterSpacing:'-0.5px', margin:'0 0 32px' },
  section: { background:'#FFFFFF', border:'1px solid #E5E7EB', borderRadius:'12px', padding:'24px', marginBottom:'16px' },
  sectionTitle: { fontSize:'11px', fontWeight:'700', color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:'16px' },
  row: { display:'flex', gap:'16px' },
  field: { display:'flex', flexDirection:'column', gap:'6px', flex:1, marginBottom:'16px' },
  label: { fontSize:'13px', fontWeight:'500', color:'#374151' },
  input: { border:'1px solid #E5E7EB', borderRadius:'8px', padding:'10px 12px', fontSize:'14px', color:'#111111', background:'#FFFFFF', outline:'none', width:'100%', boxSizing:'border-box', fontFamily:"'Inter', sans-serif" },
  textarea: { border:'1px solid #E5E7EB', borderRadius:'8px', padding:'10px 12px', fontSize:'14px', color:'#111111', background:'#FFFFFF', outline:'none', width:'100%', boxSizing:'border-box', fontFamily:"'Inter', sans-serif", resize:'vertical', minHeight:'80px' },
  logoBox: { border:'2px dashed #E5E7EB', borderRadius:'10px', padding:'20px', textAlign:'center', cursor:'pointer', marginBottom:'16px', background:'#FAFAFA' },
  logoPreview: { maxHeight:'64px', maxWidth:'180px', objectFit:'contain', display:'block', margin:'0 auto 10px' },
  removeBtn: { background:'none', border:'none', color:'#EF4444', fontSize:'12px', cursor:'pointer', marginTop:'6px' },
  lineItem: { display:'flex', gap:'12px', alignItems:'flex-end', marginBottom:'12px' },
  lineTotal: { flex:1, fontSize:'14px', fontWeight:'600', color:'#111111', paddingBottom:'10px', textAlign:'right', minWidth:'60px' },
  delBtn: { background:'none', border:'none', color:'#9CA3AF', fontSize:'20px', cursor:'pointer', paddingBottom:'8px', lineHeight:1 },
  addLineBtn: { background:'none', border:'1px dashed #D1D5DB', borderRadius:'8px', padding:'10px', width:'100%', fontSize:'14px', color:'#6B7280', cursor:'pointer', marginTop:'4px' },
  totalsRow: { display:'flex', justifyContent:'space-between', fontSize:'14px', color:'#6B7280', padding:'8px 0', borderTop:'1px solid #F3F4F6' },
  totalsTotal: { display:'flex', justifyContent:'space-between', fontSize:'18px', fontWeight:'800', color:'#111111', padding:'12px 0 0', letterSpacing:'-0.3px' },
  actions: { display:'flex', gap:'12px', marginTop:'8px' },
  previewBtn: { flex:1, background:'#2563EB', color:'#FFFFFF', border:'none', borderRadius:'8px', padding:'14px', fontSize:'15px', fontWeight:'700', cursor:'pointer' },
  saveBtn: { flex:1, background:'#FFFFFF', color:'#111111', border:'1px solid #E5E7EB', borderRadius:'8px', padding:'14px', fontSize:'15px', fontWeight:'600', cursor:'pointer' },
}

export default function Create() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    invoiceNumber: generateInvoiceNumber(),
    issueDate: new Date().toISOString().slice(0,10),
    dueDate: '',
    status: 'unpaid',
    currency: 'USD',
    fromName: '',
    fromEmail: '',
    fromAddress: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    notes: '',
  })
  const [lines, setLines] = useState([defaultLine()])
  const [logo, setLogo] = useState(null)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const setLine = (id, key, val) => setLines(ls => ls.map(l => l.id === id ? { ...l, [key]: val } : l))
  const addLine = () => setLines(ls => [...ls, defaultLine()])
  const removeLine = (id) => setLines(ls => ls.filter(l => l.id !== id))

  const handleLogo = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setLogo(ev.target.result)
    reader.readAsDataURL(file)
  }

  const subtotal = lines.reduce((sum, l) => sum + calcLineTotal(l.qty, l.rate), 0)
  const selectedCurrency = CURRENCIES.find(c => c.code === form.currency) || CURRENCIES[0]

  const buildInvoice = () => ({ ...form, id: generateId(), lines, subtotal, total: subtotal, logo, createdAt: new Date().toISOString() })

  const goPreview = () => {
    localStorage.setItem('docket_current', JSON.stringify(buildInvoice()))
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
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.navLeft}>
          <span style={s.navLogo}>Docket</span>
          <button style={s.backBtn} onClick={() => navigate('/')}>Back</button>
        </div>
        <a href="https://buildbyace.vercel.app" target="_blank" rel="noreferrer" style={s.navCredit}>by ace</a>
      </nav>

      <main style={s.main}>
        <h1 style={s.title}>New Invoice</h1>

        <div style={s.section}>
          <div style={s.sectionTitle}>Invoice Details</div>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Invoice Number</label>
              <input style={s.input} value={form.invoiceNumber} onChange={e => set('invoiceNumber', e.target.value)} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Status</label>
              <select style={s.input} value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>Issue Date</label>
              <input style={s.input} type="date" value={form.issueDate} onChange={e => set('issueDate', e.target.value)} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Due Date</label>
              <input style={s.input} type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
            </div>
          </div>
          <div style={s.field}>
            <label style={s.label}>Currency</label>
            <select style={s.input} value={form.currency} onChange={e => set('currency', e.target.value)}>
              {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div style={s.section}>
          <div style={s.sectionTitle}>From</div>
          <div style={s.field}>
            <label style={s.label}>Logo (optional)</label>
            <div style={s.logoBox} onClick={() => document.getElementById('logo-input').click()}>
              {logo ? (
                <>
                  <img src={logo} alt="logo" style={s.logoPreview} />
                  <div style={{ fontSize:'13px', color:'#6B7280' }}>Click to change</div>
                  <button style={s.removeBtn} onClick={e => { e.stopPropagation(); setLogo(null) }}>Remove</button>
                </>
              ) : (
                <>
                  <div style={{ fontSize:'13px', fontWeight:'600', color:'#374151', marginBottom:'4px' }}>Upload logo</div>
                  <div style={{ fontSize:'12px', color:'#9CA3AF' }}>PNG, JPG, SVG</div>
                </>
              )}
            </div>
            <input id="logo-input" type="file" accept="image/*" style={{ display:'none' }} onChange={handleLogo} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Your Name or Business</label>
            <input style={s.input} placeholder="Ace Studio" value={form.fromName} onChange={e => set('fromName', e.target.value)} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" placeholder="you@email.com" value={form.fromEmail} onChange={e => set('fromEmail', e.target.value)} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Address</label>
            <textarea style={s.textarea} placeholder="Street, City, Country" value={form.fromAddress} onChange={e => set('fromAddress', e.target.value)} />
          </div>
        </div>

        <div style={s.section}>
          <div style={s.sectionTitle}>Bill To</div>
          <div style={s.field}>
            <label style={s.label}>Client Name or Business</label>
            <input style={s.input} placeholder="Client Co." value={form.clientName} onChange={e => set('clientName', e.target.value)} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" placeholder="client@email.com" value={form.clientEmail} onChange={e => set('clientEmail', e.target.value)} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Address</label>
            <textarea style={s.textarea} placeholder="Street, City, Country" value={form.clientAddress} onChange={e => set('clientAddress', e.target.value)} />
          </div>
        </div>

        <div style={s.section}>
          <div style={s.sectionTitle}>Line Items</div>
          {lines.map((line, i) => (
            <div key={line.id} style={s.lineItem}>
              <div style={{ ...s.field, flex:3, marginBottom:0 }}>
                {i === 0 && <label style={s.label}>Description</label>}
                <input style={s.input} placeholder="Service or product" value={line.description} onChange={e => setLine(line.id, 'description', e.target.value)} />
              </div>
              <div style={{ ...s.field, flex:1, marginBottom:0 }}>
                {i === 0 && <label style={s.label}>Qty</label>}
                <input style={s.input} type="number" min="0" placeholder="1" value={line.qty} onChange={e => setLine(line.id, 'qty', e.target.value)} />
              </div>
              <div style={{ ...s.field, flex:1, marginBottom:0 }}>
                {i === 0 && <label style={s.label}>Rate ({selectedCurrency.symbol})</label>}
                <input style={s.input} type="number" min="0" placeholder="0.00" value={line.rate} onChange={e => setLine(line.id, 'rate', e.target.value)} />
              </div>
              <div style={{ ...s.lineTotal }}>
                {formatCurrency(calcLineTotal(line.qty, line.rate), form.currency)}
              </div>
              {lines.length > 1 && <button style={s.delBtn} onClick={() => removeLine(line.id)}>x</button>}
            </div>
          ))}
          <button style={s.addLineBtn} onClick={addLine}>+ Add line item</button>
          <div style={{ marginTop:'20px' }}>
            <div style={s.totalsRow}><span>Subtotal</span><span>{formatCurrency(subtotal, form.currency)}</span></div>
            <div style={s.totalsTotal}><span>Total</span><span>{formatCurrency(subtotal, form.currency)}</span></div>
          </div>
        </div>

        <div style={s.section}>
          <div style={s.sectionTitle}>Notes</div>
          <textarea style={s.textarea} placeholder="Payment terms, bank details, thank you note..." value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>

        <div style={s.actions}>
          <button style={s.saveBtn} onClick={saveDraft}>Save Draft</button>
          <button style={s.previewBtn} onClick={goPreview}>Preview Invoice</button>
        </div>
      </main>
    </div>
  )
}
