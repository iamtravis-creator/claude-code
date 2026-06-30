/* main.js — shared JS for all Main10 pages */

/* ── UTM capture ─────────────────────────────────────────────────────────── */
(function () {
  const params = new URLSearchParams(location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach(k => {
    if (params.get(k)) sessionStorage.setItem(k, params.get(k));
  });
})();

/* ── FAQ accordion ───────────────────────────────────────────────────────── */
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = answer.classList.contains('open');
  document.querySelectorAll('.faq-a.open').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-q').forEach(q => {
    q.classList.remove('open');
    q.setAttribute('aria-expanded', 'false');
  });
  if (!isOpen) {
    answer.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}

/* ── Pricing data (wizard) ───────────────────────────────────────────────── */
const BASE_PRICES    = { 1: 299, 2: 389, 3: 489, 4: 589 };
const BATHROOM_EXTRA = { 1: 0, 2: 60, 3: 120 };
const CARPET_PRICES  = { 1: 80, 2: 140, 3: 185, 4: 240 };
const ADDON_PRICES   = { fridge: 65, balcony: 55, walls: 80 };

function getBedroomCount() {
  const sel = document.getElementById('wiz-bedrooms');
  return sel ? (parseInt(sel.value) || 2) : 2;
}

function updateTotal() {
  const beds    = getBedroomCount();
  const bathSel = document.getElementById('wiz-bathrooms');
  if (!bathSel) return;
  const baths = parseInt(bathSel.value) || 1;
  let total   = (BASE_PRICES[beds] || 389) + (BATHROOM_EXTRA[baths] || 0);

  const carpetLabel = document.getElementById('carpet-price-label');
  if (carpetLabel) carpetLabel.textContent = '+$' + (CARPET_PRICES[beds] || 140);

  const cbCarpet  = document.getElementById('cb-carpet');
  const cbFridge  = document.getElementById('cb-fridge');
  const cbBalcony = document.getElementById('cb-balcony');
  const cbWalls   = document.getElementById('cb-walls');
  if (cbCarpet?.checked)  total += CARPET_PRICES[beds] || 140;
  if (cbFridge?.checked)  total += ADDON_PRICES.fridge;
  if (cbBalcony?.checked) total += ADDON_PRICES.balcony;
  if (cbWalls?.checked)   total += ADDON_PRICES.walls;

  const display = document.getElementById('quote-total-display');
  if (display) display.textContent = '$' + total;
  const ap = document.getElementById('afterpay-instalment');
  if (ap) ap.textContent = '$' + (total / 4).toFixed(2);
  const rt = document.getElementById('running-total');
  if (rt) rt.textContent = 'Quote: $' + total;
}

/* ── Validation helpers ──────────────────────────────────────────────────── */
function showError(fieldId, groupId) {
  const grp = document.getElementById(groupId);
  const err = document.getElementById('err-' + fieldId);
  if (grp) grp.classList.add('has-error');
  if (err) err.classList.add('visible');
}
function clearError(fieldId, groupId) {
  const grp = document.getElementById(groupId);
  const err = document.getElementById('err-' + fieldId);
  if (grp) grp.classList.remove('has-error');
  if (err) err.classList.remove('visible');
}

/* ── Addon toggle ────────────────────────────────────────────────────────── */
function toggleAddon(id, row) {
  const cb = document.getElementById('cb-' + id);
  if (event.target !== cb) cb.checked = !cb.checked;
  row.classList.toggle('checked', cb.checked);
  row.setAttribute('aria-pressed', cb.checked ? 'true' : 'false');
  updateTotal();
}

/* ── Wizard navigation ───────────────────────────────────────────────────── */
function setStep(n) {
  for (let i = 1; i <= 4; i++) {
    const panel = document.getElementById('step-' + i);
    const tab   = document.getElementById('step-tab-' + i);
    if (!panel || !tab) continue;
    panel.classList.toggle('active', i === n);
    tab.classList.remove('active', 'done');
    tab.setAttribute('aria-selected', i === n ? 'true' : 'false');
    tab.setAttribute('tabindex', i === n ? '0' : '-1');
    if (i === n) tab.classList.add('active');
    if (i < n)   tab.classList.add('done');
  }
}

function wizNext(from) {
  let valid = true;
  if (from === 1) {
    if (!document.getElementById('wiz-bedrooms')?.value) { showError('bedrooms','fg-bedrooms'); valid = false; }
    if (!document.getElementById('wiz-bathrooms')?.value) { showError('bathrooms','fg-bathrooms'); valid = false; }
    if (!document.getElementById('wiz-suburb')?.value.trim()) { showError('suburb','fg-suburb'); valid = false; }
    if (!valid) { document.getElementById('wiz-bedrooms').focus(); return; }
  }
  if (from === 3) {
    if (!document.getElementById('wiz-vacate')?.value) { showError('vacate','fg-vacate'); valid = false; }
    if (!document.getElementById('wiz-cleandate')?.value) { showError('cleandate','fg-cleandate'); valid = false; }
    if (!valid) { document.getElementById('wiz-vacate').focus(); return; }
  }
  updateTotal();
  setStep(from + 1);
}

function wizBack(from) { setStep(from - 1); }

/* ── Submit ──────────────────────────────────────────────────────────────── */
function submitQuote() {
  const name  = document.getElementById('wiz-name')?.value.trim();
  const email = document.getElementById('wiz-email')?.value.trim();
  const phone = document.getElementById('wiz-phone')?.value.trim();
  let valid = true;
  if (!name)  { showError('name','fg-name');   valid = false; }
  if (!email || !email.includes('@')) { showError('email','fg-email'); valid = false; }
  if (!phone) { showError('phone','fg-phone'); valid = false; }
  if (!valid) { document.getElementById('wiz-name').focus(); return; }

  const btn = document.getElementById('btn-submit');
  btn.setAttribute('aria-busy', 'true');
  btn.textContent = 'Confirming…';

  setTimeout(() => {
    btn.removeAttribute('aria-busy');
    document.querySelector('.wizard-steps').style.display = 'none';
    for (let i = 1; i <= 4; i++) document.getElementById('step-' + i).style.display = 'none';
    document.getElementById('quote-success').style.display = 'block';
    document.getElementById('quote-success').focus();
  }, 900);
}

/* ── Init on DOM ready ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  // Date minimums
  const today = new Date().toISOString().split('T')[0];
  const vacate    = document.getElementById('wiz-vacate');
  const cleandate = document.getElementById('wiz-cleandate');
  if (vacate)    vacate.min    = today;
  if (cleandate) cleandate.min = today;

  // Clear errors on field input
  const fieldMap = {
    'wiz-bedrooms': 'fg-bedrooms', 'wiz-bathrooms': 'fg-bathrooms',
    'wiz-suburb':   'fg-suburb',   'wiz-vacate':    'fg-vacate',
    'wiz-cleandate':'fg-cleandate','wiz-name':      'fg-name',
    'wiz-email':    'fg-email',    'wiz-phone':     'fg-phone'
  };
  Object.entries(fieldMap).forEach(([id, groupId]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const fieldId = id.replace('wiz-', '');
    el.addEventListener('change', () => clearError(fieldId, groupId));
    el.addEventListener('input',  () => clearError(fieldId, groupId));
  });

  // Bedroom/bathroom update total
  ['wiz-bedrooms', 'wiz-bathrooms'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', updateTotal);
  });

  // Sticky CTA — hide when footer is visible
  const cta    = document.getElementById('sticky-cta');
  const footer = document.querySelector('footer');
  if (cta && footer) {
    const obs = new IntersectionObserver(entries => {
      cta.style.display = entries[0].isIntersecting ? 'none' : 'flex';
    });
    obs.observe(footer);
  }
});
