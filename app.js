/* ============================================================
   Verify · Eligibility prototype — main app.
   Static SPA: vanilla JS state + render. No build step.
   ============================================================ */

/* ---- Feedback link ----
   Where the "Send feedback" button points. Swap this for a Tally
   form, Google Form, Notion page, or your own mailto:. */
const FEEDBACK_URL = 'mailto:maxbinet3@gmail.com?subject=Verify%20prototype%20feedback&body=What%20worked%2C%20what%20didn%27t%2C%20what%27s%20unclear%3A%0A%0A';

/* -------------------- State + router -------------------- */

const State = {
  screen: 'signin',
  params: {},
  history: [],

  newCheck: {
    payer: 'Traditional Medicare',
    payerType: 'medicare-ffs',
    memberId: '',
    firstName: '',
    lastName: '',
    dob: '',
    groupNumber: '',
    plan: ''
  },
  result: {
    state: 'empty',                      // empty | pending | result
    patientId: null
  },

  detailMode: 'plain',                   // plain | detailed
  historyFilter: 'all',
  historySearch: '',
  patientNotes: {},                      // dynamic notes added at runtime
  bottomTab: 'home',                     // home | history | profile

  modal: null,                           // null | 'payer' | 'share' | 'ios-share' | 'pdf'
  modalParams: {},
  toast: null,
  offline: false
};

function setState(updates) {
  Object.assign(State, updates);
  render();
}

function navigate(screen, params = {}) {
  if (State.screen) State.history.push({ screen: State.screen, params: State.params });
  State.screen = screen;
  State.params = params;
  if (screen === 'home') State.bottomTab = 'home';
  if (screen === 'history') State.bottomTab = 'history';
  if (screen === 'profile') State.bottomTab = 'profile';
  render();
}

function back() {
  const prev = State.history.pop();
  if (prev) {
    State.screen = prev.screen;
    State.params = prev.params;
    render();
  }
}

function openModal(name, params = {}) { State.modal = name; State.modalParams = params; render(); }
function closeModal() { State.modal = null; State.modalParams = {}; render(); }
function showToast(text, ms = 2000) {
  State.toast = { text, id: Date.now() };
  render();
  setTimeout(() => {
    if (State.toast && State.toast.id) {
      State.toast = null;
      render();
    }
  }, ms);
}

/* -------------------- Helpers -------------------- */

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

function badge(p) {
  const icon = p.icon ? `<i data-lucide="${p.icon}"></i>` : '';
  return `<span class="badge ${p.cls}">${icon}${esc(p.text)}</span>`;
}

function fieldLabelFor(key, payerType) {
  if (key === 'memberId' && payerType === 'medicare-ffs') return FIELD_LABELS.memberId_mbi;
  return FIELD_LABELS[key];
}
function fieldPlaceholderFor(key, payerType) {
  if (key === 'memberId' && payerType === 'medicare-ffs') return FIELD_PLACEHOLDERS.memberId_mbi;
  return FIELD_PLACEHOLDERS[key];
}

function patientPrivateName(p) {
  return `${p.firstName} ${p.lastName.charAt(0)}.`;
}

function payerForPatient(payerName) {
  return PAYER_TYPE_BY_NAME[payerName] || 'commercial';
}

function minFieldsMet() {
  const t = State.newCheck.payerType;
  const required = FIELDS_BY_TYPE[t].filter(f => f !== 'groupNumber');
  return required.every(f => State.newCheck[f] && String(State.newCheck[f]).trim().length > 0);
}

function findMatchingPatient() {
  const f = State.newCheck;
  const candidates = PATIENTS.filter(p => p.payer === f.payer);
  if (!candidates.length) return PATIENTS[0];
  const exact = candidates.find(p =>
    (f.lastName && p.lastName.toLowerCase() === f.lastName.toLowerCase()) ||
    (f.memberId && p.memberId.toLowerCase() === f.memberId.toLowerCase())
  );
  return exact || candidates[0];
}

/* Field updates (called from screen-rendered inputs) */
window.updateField = function(key, val) {
  State.newCheck[key] = val;
  if (State.result.state === 'result' || State.result.state === 'pending') {
    if (!minFieldsMet()) {
      State.result.state = 'empty';
      State.result.patientId = null;
    }
  }
  if (minFieldsMet() && State.result.state === 'empty') {
    runCheck();
  } else {
    render();
  }
};

function runCheck(opts = {}) {
  const patient = opts.patient || findMatchingPatient();
  State.result.state = 'pending';
  State.result.patientId = patient.id;
  render();
  setTimeout(() => {
    State.result.state = 'result';
    render();
    const card = document.querySelector('[data-result-card]');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 1500);
}

/* -------------------- Render entry -------------------- */

const SCREENS = {};

function render() {
  const root = document.getElementById('screen');
  const offlineHTML = State.offline
    ? `<div class="offline-banner"><i data-lucide="wifi-off"></i> Offline — your check will run when you're back online.<button class="offline-banner__close" onclick="setState({offline:false})">×</button></div>`
    : '';

  const screenFn = SCREENS[State.screen] || SCREENS.home;
  root.innerHTML = `
    <div class="screen-inner">
      ${offlineHTML}
      ${screenFn(State.params)}
    </div>
  `;

  // Render modals
  const modalRoot = document.getElementById('modalRoot');
  modalRoot.innerHTML = renderModal();

  // Render toasts
  const toastRoot = document.getElementById('toastRoot');
  toastRoot.innerHTML = State.toast
    ? `<div class="toast"><i data-lucide="check"></i>${esc(State.toast.text)}</div>`
    : '';

  // (Re-)bind lucide
  if (window.lucide) lucide.createIcons();
}

/* -------------------- Sign in (§6.1) -------------------- */

SCREENS.signin = function () {
  return `
    <div class="signin">
      <div class="signin__hero">
        <div class="signin__wordmark">Verify</div>
        <div class="signin__tagline">Eligibility checks, instantly.</div>
      </div>

      <div class="signin__form">
        <div class="signin__heading">Sign in</div>

        <div class="field field--filled">
          <div class="field__control">
            <label class="field__label" style="top:8px;font-size:11px;text-transform:uppercase;letter-spacing:0.3px;color:var(--cool-400);">Email</label>
            <input class="field__input" type="email" value="${esc(AGENCY.email)}" />
          </div>
        </div>

        <button class="btn btn--primary btn--full" onclick="navigate('biometric')">Continue</button>

        <button class="signin__bio" onclick="navigate('biometric')">
          <i data-lucide="fingerprint"></i> Use Touch ID / Face ID
        </button>

        <button class="btn btn--secondary btn--full" onclick="navigate('home')">Sign in with SSO</button>

        <div class="signin__footer">
          <i data-lucide="lock"></i> Protected. HIPAA compliant.
        </div>
      </div>
    </div>
  `;
};

/* -------------------- Biometric unlock (§6.2) -------------------- */

SCREENS.biometric = function () {
  return `
    <div class="biometric">
      <div class="biometric__logo"></div>
      <div class="biometric__title">Unlock to continue</div>
      <div class="biometric__sub">Use Face ID to enter Verify</div>

      <button class="biometric__face" onclick="navigate('home')" aria-label="Authenticate with Face ID">
        <i data-lucide="scan-face"></i>
      </button>

      <button class="biometric__pwd" onclick="navigate('signin')">Sign in with password instead</button>
    </div>
  `;
};

/* -------------------- Home (§6.3) -------------------- */

SCREENS.home = function () {
  const recentRows = RECENT.map(id => {
    const p = PATIENTS_BY_ID[id];
    return `
      <button class="list-card" onclick="openPatientResult('${p.id}')">
        <div class="list-card__avatar">${esc(p.initials)}</div>
        <div class="list-card__main">
          <div class="list-card__title">
            ${esc(patientPrivateName(p))}
            ${badge(p.badge)}
          </div>
          <div class="list-card__sub">
            <span>${esc(p.payer)}</span>
            <span>·</span>
            <span>${esc(p.timestamp)}</span>
          </div>
        </div>
        <div class="list-card__chevron"><i data-lucide="chevron-right"></i></div>
      </button>
    `;
  }).join('');

  return `
    <div class="greeting">
      <div>
        <div class="greeting__name">Good morning, ${esc(AGENCY.user.split(' ')[0])}</div>
        <div class="greeting__agency">${esc(AGENCY.name)}</div>
      </div>
      <button class="bell-btn" aria-label="Notifications"><i data-lucide="bell"></i></button>
    </div>

    <div class="cta-row">
      <button class="btn btn--primary btn--full" onclick="startNewCheck()">
        <i data-lucide="plus"></i> New Eligibility Check
      </button>
    </div>

    <div class="stat-row">
      <button class="stat-tile" onclick="navigate('history',{filter:'all'})">
        <div class="stat-tile__num">${STATS.today}</div>
        <div class="stat-tile__label">Today</div>
      </button>
      <button class="stat-tile" onclick="navigate('history',{filter:'all'})">
        <div class="stat-tile__num">${STATS.week}</div>
        <div class="stat-tile__label">This week</div>
      </button>
      <button class="stat-tile is-action" onclick="navigate('history',{filter:'action'})">
        <div class="stat-tile__num">${STATS.actionNeeded}</div>
        <div class="stat-tile__label">Action needed</div>
      </button>
    </div>

    <div class="section-header">
      <span class="section-header__title">Recent checks</span>
      <button class="section-header__link" onclick="navigate('history')">See all →</button>
    </div>

    <div class="scroll-area" style="padding-top:0">
      ${recentRows}
      <div style="height:24px"></div>
    </div>

    ${renderBottomNav()}
  `;
};

function renderBottomNav() {
  const items = [
    { tab: 'home', icon: 'home', label: 'Home' },
    { tab: 'history', icon: 'clock', label: 'History' },
    { tab: 'profile', icon: 'user', label: 'Profile' }
  ];
  return `
    <div class="bottom-nav">
      ${items.map(it => `
        <button class="bottom-nav__item ${State.bottomTab === it.tab ? 'is-active' : ''}"
                onclick="navigate('${it.tab}')">
          <i data-lucide="${it.icon}"></i>
          <span>${it.label}</span>
        </button>
      `).join('')}
    </div>
  `;
}

window.startNewCheck = function () {
  // Reset form
  State.newCheck = {
    payer: 'Traditional Medicare',
    payerType: 'medicare-ffs',
    memberId: '', firstName: '', lastName: '', dob: '', groupNumber: '', plan: ''
  };
  State.result = { state: 'empty', patientId: null };
  navigate('newCheck');
};

window.openPatientResult = function (id) {
  navigate('resultDetail', { patientId: id });
};

/* -------------------- New eligibility check (§6.4) -------------------- */

SCREENS.newCheck = function () {
  const t = State.newCheck.payerType;
  const fields = FIELDS_BY_TYPE[t];

  const fieldsHTML = fields.map(key => {
    const isDOB = key === 'dob';
    const label = fieldLabelFor(key, t);
    const placeholder = fieldPlaceholderFor(key, t);
    const value = State.newCheck[key] || '';
    const filled = value.length > 0;
    return `
      <div class="field ${filled ? 'field--filled' : ''}">
        <div class="field__control">
          <label class="field__label">${esc(label)}</label>
          <input
            class="field__input"
            type="${isDOB ? 'tel' : 'text'}"
            value="${esc(value)}"
            placeholder="${esc(placeholder)}"
            inputmode="${isDOB ? 'numeric' : 'text'}"
            oninput="updateField('${key}', this.value)"
            onfocus="this.parentElement.parentElement.classList.add('field--focused')"
            onblur="this.parentElement.parentElement.classList.remove('field--focused')"
          />
        </div>
      </div>
    `;
  }).join('');

  // Show plan field as auto-detected for MA
  const maPlanRow = (t === 'medicare-ma' && State.newCheck.plan)
    ? `
      <div class="field field--filled">
        <div class="field__control">
          <label class="field__label">Plan (auto-detected)</label>
          <input class="field__input" value="${esc(State.newCheck.plan)}" disabled />
        </div>
      </div>`
    : '';

  return `
    <div class="appbar">
      <button class="appbar__action" onclick="back()" aria-label="Back"><i data-lucide="arrow-left"></i></button>
      <div class="appbar__title">New Check</div>
      <button class="appbar__action" onclick="navigate('home')" aria-label="Close"><i data-lucide="x"></i></button>
    </div>

    <div class="scroll-area">
      <button class="photo-shortcut" onclick="simulatePhotoOCR()">
        <div class="photo-shortcut__icon"><i data-lucide="camera"></i></div>
        <div class="photo-shortcut__main">
          <div class="photo-shortcut__title">Attach face sheet or insurance card</div>
          <div class="photo-shortcut__sub">Or enter manually below</div>
        </div>
        <i data-lucide="chevron-right" style="color:var(--cool-300);width:18px;height:18px"></i>
      </button>

      <div class="field field--button field--filled" onclick="openModal('payer')">
        <div class="field__control">
          <label class="field__label">Payer</label>
          <input class="field__input" value="${esc(State.newCheck.payer)}" readonly />
        </div>
        <span class="field__chevron"><i data-lucide="chevron-down"></i></span>
      </div>

      ${fieldsHTML}
      ${maPlanRow}

      <div data-result-card style="margin-top:8px">
        ${renderResultCard()}
      </div>

      <div style="height:80px"></div>
    </div>

    <div class="action-bar">
      <button
        class="btn btn--primary btn--full ${minFieldsMet() ? '' : ''}"
        ${minFieldsMet() ? '' : 'disabled aria-disabled="true"'}
        onclick="onCheckEligibility()">
        Check Eligibility
      </button>
    </div>
  `;
};

window.onCheckEligibility = function () {
  if (!minFieldsMet()) return;
  if (State.result.state === 'pending') return;
  runCheck();
};

window.simulatePhotoOCR = function () {
  // Use Margaret as the demo "scanned" patient
  State.newCheck.payer = 'Traditional Medicare';
  State.newCheck.payerType = 'medicare-ffs';
  State.result = { state: 'pending', patientId: 'margaret-johnson' };
  showToast('Reading insurance card…', 1400);
  render();
  setTimeout(() => {
    const p = PATIENTS_BY_ID['margaret-johnson'];
    State.newCheck.memberId = p.memberId;
    State.newCheck.lastName = p.lastName;
    State.newCheck.dob = p.dob;
    runCheck({ patient: p });
  }, 1500);
};

function renderResultCard() {
  if (State.result.state === 'empty') {
    return `
      <div class="result-card result-card--empty">
        <div class="result-card__illustration"><i data-lucide="clipboard-list"></i></div>
        <div class="t-strong" style="margin-bottom:4px">Enter patient info to check eligibility</div>
        <div class="t-subtle">As you fill in fields, the result will appear here.</div>
      </div>
    `;
  }
  if (State.result.state === 'pending') {
    const p = State.result.patientId ? PATIENTS_BY_ID[State.result.patientId] : null;
    return `
      <div class="result-card result-card--pending">
        <div class="pending-spinner"></div>
        <div>
          <div class="t-strong">Checking eligibility…</div>
          <div class="t-subtle">${p ? esc(p.payer) : esc(State.newCheck.payer || 'payer')}</div>
        </div>
      </div>
    `;
  }
  // result
  const p = PATIENTS_BY_ID[State.result.patientId];
  if (!p) return '';
  return renderResultCardForPatient(p);
}

function renderResultCardForPatient(p) {
  const variant = {
    eligible:      'result-card--eligible',
    action:        'result-card--action',
    not:           'result-card--not',
    'system-error':'result-card--system',
    rejected:      'result-card--rejected'
  }[p.outcome] || 'result-card--eligible';

  const iconName = {
    eligible: 'check-circle',
    action: 'alert-triangle',
    not: 'x-circle',
    'system-error': 'wifi-off',
    rejected: 'alert-circle'
  }[p.outcome] || 'check-circle';

  const titleText = {
    eligible: 'Eligible',
    action: 'Action Needed',
    not: 'Not Eligible',
    'system-error': "We couldn't reach the payer.",
    rejected: "Payer couldn't find this member."
  }[p.outcome];

  // System error has its own buttons (Retry / Save and check later)
  if (p.outcome === 'system-error') {
    return `
      <div class="result-card ${variant}">
        <div class="result-card__header">
          <div class="result-card__icon"><i data-lucide="${iconName}"></i></div>
          <div>
            <div class="t-h2 result-card__title">${esc(titleText)}</div>
            <div class="result-card__summary">This is not a coverage decision. Please try again.</div>
          </div>
        </div>
        <button class="result-link" onclick="openPatientResult('${p.id}')">
          Review eligibility response <i data-lucide="arrow-right"></i>
        </button>
        <div class="result-card__buttons">
          <button class="btn btn--secondary" onclick="showToast('Saved for retry', 1500)">Save and check later</button>
          <button class="btn btn--primary" onclick="runCheckAgain('${p.id}')">Retry</button>
        </div>
      </div>
    `;
  }

  // Build facts grid (max 6 for compact layout)
  const facts = (p.facts || []).slice(0, 6).map(f => `
    <div class="fact">
      <div class="fact__label">${esc(f.label)}</div>
      <div class="fact__value">${esc(f.value)}</div>
    </div>
  `).join('');

  // Callout block (action / not eligible)
  const callout = p.callout
    ? `
      <div class="callout ${p.outcome === 'not' ? 'callout--error' : 'callout--secondary'}">
        <div class="callout__label">${esc(p.callout.label)}</div>
        <div class="callout__body">${esc(p.callout.body)}</div>
      </div>
    `
    : '';

  // Recommended actions (action only)
  const actions = (p.recommendedActions || []).length
    ? `
      <div class="t-caption" style="margin-top:8px;margin-bottom:6px">Recommended actions</div>
      <ul class="action-list">${p.recommendedActions.map(a => `<li>${esc(a)}</li>`).join('')}</ul>
    `
    : '';

  // Buttons by outcome
  const buttons = {
    eligible: `
      <button class="btn btn--secondary" onclick="openAddNote('${p.id}')">Add Note</button>
      <button class="btn btn--primary" onclick="showToast('Marked as Accepted', 1600)">Mark as Accepted</button>
    `,
    action: `
      <button class="btn btn--secondary" onclick="openAddNote('${p.id}')">Add Note</button>
      <button class="btn btn--primary" onclick="showToast('Reminder set for recheck', 1600)">Set Reminder for Recheck</button>
    `,
    not: `
      <button class="btn btn--secondary" onclick="openAddNote('${p.id}')">Add Note</button>
      <button class="btn btn--ghost-cool" onclick="showToast('Marked as Lost', 1600)">Mark as Lost</button>
    `
  }[p.outcome] || '';

  return `
    <div class="result-card ${variant}">
      <div class="result-card__header">
        <div class="result-card__icon"><i data-lucide="${iconName}"></i></div>
        <div>
          <div class="t-h2 result-card__title">${esc(titleText)}</div>
          <div class="result-card__summary">${esc(p.summary)}</div>
        </div>
      </div>

      ${callout}

      <div class="fact-grid">${facts}</div>

      ${actions}

      <button class="result-link" onclick="openPatientResult('${p.id}')">
        Review eligibility response <i data-lucide="arrow-right"></i>
      </button>

      <div class="result-card__buttons">${buttons}</div>
    </div>
  `;
}

window.runCheckAgain = function (id) {
  const p = PATIENTS_BY_ID[id];
  // For demo: re-running shows pending → eligible (simulates payer recovering)
  State.result.state = 'pending';
  render();
  setTimeout(() => {
    showToast('Connection restored — re-run anytime', 1800);
    State.result.state = 'result';
    render();
  }, 1500);
};

/* -------------------- Result detail (§6.8) -------------------- */

SCREENS.resultDetail = function (params) {
  const p = PATIENTS_BY_ID[params.patientId];
  if (!p) return SCREENS.home();

  return `
    <div class="detail-header">
      <div class="detail-header__bar">
        <button class="appbar__action" onclick="back()" aria-label="Back"><i data-lucide="arrow-left"></i></button>
        <div style="flex:1"></div>
        <button class="appbar__action" onclick="openShareSheet('${p.id}')" aria-label="Share">
          <i data-lucide="share"></i>
        </button>
      </div>
      <div class="detail-header__patient">${esc(p.firstName)} ${esc(p.lastName)}</div>
      <div class="detail-header__sub">
        <span>${esc(p.payer)}</span>
        <span>·</span>
        <span>${esc(p.timestampAbs)}</span>
        ${badge(p.badge)}
      </div>

      <div class="segmented" role="tablist">
        <button class="segmented__item ${State.detailMode === 'plain' ? 'is-active' : ''}"
                onclick="setDetailMode('plain')" role="tab">Plain English</button>
        <button class="segmented__item ${State.detailMode === 'detailed' ? 'is-active' : ''}"
                onclick="setDetailMode('detailed')" role="tab">Detailed</button>
      </div>
    </div>

    <div class="scroll-area" style="padding-top:14px">
      ${State.detailMode === 'plain' ? renderPlainEnglish(p) : renderDetailed(p)}
      <div style="height:24px"></div>
    </div>

    <div class="action-bar">
      <button class="btn btn--secondary" onclick="back()" style="flex:1">Back to result</button>
      <button class="btn btn--primary" onclick="openShareSheet('${p.id}')" style="flex:1">
        <i data-lucide="share"></i> Share
      </button>
    </div>
  `;
};

window.setDetailMode = function (mode) { setState({ detailMode: mode }); };

function renderPlainEnglish(p) {
  return (p.plainEnglish || []).map(sec => {
    const ruleClass = sec.rule === 'pass' ? 'is-pass' : sec.rule === 'warn' ? 'is-warn' : 'is-fail';
    return `
      <div class="evidence-section">
        <div class="evidence-section__head">
          <div class="evidence-section__title">${esc(sec.title)}</div>
          <div class="evidence-section__rule ${ruleClass}">${esc(sec.ruleLabel)}</div>
        </div>
        ${sec.rows.map(([k, v]) => `
          <div class="evidence-row">
            <span class="evidence-row__label">${esc(k)}</span>
            <span class="evidence-row__value">${esc(v)}</span>
          </div>
        `).join('')}
      </div>
    `;
  }).join('');
}

function renderDetailed(p) {
  return (p.detailed || []).map(seg => `
    <div class="detailed-segment">
      <div class="detailed-segment__name">${esc(seg.name)}</div>
      ${seg.rows.map(([k, v]) => `
        <div class="detailed-row">
          <div class="detailed-row__key">${esc(k)}</div>
          <div class="detailed-row__val">${esc(v)}</div>
        </div>
      `).join('')}
    </div>
  `).join('');
}

/* -------------------- History (§6.10) -------------------- */

SCREENS.history = function (params) {
  if (params && params.filter) {
    State.historyFilter = params.filter;
    delete State.params.filter;
  }
  const filter = State.historyFilter;
  const search = State.historySearch.toLowerCase();

  const matches = PATIENTS.filter(p => {
    if (search) {
      const hay = `${p.firstName} ${p.lastName} ${p.payer}`.toLowerCase();
      if (!hay.includes(search)) return false;
    }
    if (filter === 'all') return true;
    if (filter === 'eligible') return p.outcome === 'eligible';
    if (filter === 'action') return p.outcome === 'action';
    if (filter === 'not') return p.outcome === 'not' || p.outcome === 'system-error';
    return true;
  });

  return `
    <div class="appbar">
      <div style="width:36px"></div>
      <div class="appbar__title" style="text-align:left;padding-left:8px">History</div>
      <button class="appbar__action" aria-label="Filter"><i data-lucide="sliders-horizontal"></i></button>
    </div>

    <div class="history-toolbar">
      <div class="history-search">
        <i data-lucide="search"></i>
        <input
          type="text"
          placeholder="Search patient or payer"
          value="${esc(State.historySearch)}"
          oninput="State.historySearch = this.value; render();"
        />
      </div>

      <div class="chip-row">
        ${[
          ['all', 'All'],
          ['eligible', 'Eligible'],
          ['action', 'Action Needed'],
          ['not', 'Not Eligible'],
          ['week', 'This week'],
          ['month', 'This month']
        ].map(([k, l]) => `
          <button class="chip ${State.historyFilter === k ? 'is-active' : ''}"
                  onclick="State.historyFilter='${k}'; render();">${l}</button>
        `).join('')}
      </div>
    </div>

    <div class="scroll-area" style="padding-top:8px">
      ${matches.length === 0
        ? `<div class="card" style="text-align:center;color:var(--cool-400);padding:40px 20px">No checks match.</div>`
        : matches.map(p => `
          <button class="list-card" onclick="navigate('patientDetail',{patientId:'${p.id}'})">
            <div class="list-card__avatar">${esc(p.initials)}</div>
            <div class="list-card__main">
              <div class="list-card__title">
                ${esc(p.lastName)}, ${esc(p.firstName.charAt(0))}.
                ${badge(p.badge)}
              </div>
              <div class="list-card__sub">
                <span>${esc(p.payer)}</span>
                <span>·</span>
                <span>${esc(p.timestamp)}</span>
                <span>·</span>
                <span>1 check</span>
              </div>
            </div>
            <div class="list-card__chevron"><i data-lucide="chevron-right"></i></div>
          </button>
        `).join('')
      }
      <div style="height:24px"></div>
    </div>

    ${renderBottomNav()}
  `;
};

/* -------------------- Patient detail (§6.11) -------------------- */

SCREENS.patientDetail = function (params) {
  const p = PATIENTS_BY_ID[params.patientId];
  if (!p) return SCREENS.history();

  const userNotes = State.patientNotes[p.id] || [];
  const allNotes = [...(p.notes || []), ...userNotes];

  return `
    <div class="appbar">
      <button class="appbar__action" onclick="back()"><i data-lucide="arrow-left"></i></button>
      <div class="appbar__title"></div>
      <button class="appbar__action" aria-label="More"><i data-lucide="more-horizontal"></i></button>
    </div>

    <div class="patient-hero">
      <div class="patient-hero__avatar">${esc(p.initials)}</div>
      <div class="patient-hero__main">
        <div class="patient-hero__name">${esc(p.firstName)} ${esc(p.lastName)}</div>
        <div class="patient-hero__meta">
          <span>DOB ${esc(p.dob)}</span>
          <span>·</span>
          <span>${esc(p.payer)}</span>
        </div>
      </div>
      <button class="btn btn--secondary btn--sm" onclick="recheckPatient('${p.id}')">
        <i data-lucide="refresh-cw"></i> Recheck
      </button>
    </div>

    <div class="scroll-area" style="padding-top:16px">
      <div class="section-header" style="padding:0;margin-bottom:8px">
        <span class="section-header__title">Notes</span>
        <span class="t-subtle">Private to you</span>
      </div>

      ${allNotes.length === 0
        ? `<div class="t-subtle" style="padding:8px 0 12px">No notes yet.</div>`
        : allNotes.map(n => `
          <div class="note-card">
            <div class="note-card__time">${esc(n.time)}</div>
            <div class="note-card__body">${esc(n.body)}</div>
          </div>
        `).join('')}

      <div class="add-note-row">
        <input type="text" placeholder="+ Add note" id="noteInput" onkeydown="if(event.key==='Enter') addNoteFromInput('${p.id}')" />
        <button class="btn btn--secondary btn--sm" onclick="addNoteFromInput('${p.id}')">Save</button>
      </div>

      <div class="section-header" style="padding:0;margin:20px 0 8px">
        <span class="section-header__title">Check history</span>
      </div>

      <div class="history-row" role="button" tabindex="0" onclick="navigate('resultDetail',{patientId:'${p.id}'})">
        <div class="history-row__main">
          <div class="history-row__date">${esc(p.timestampAbs)}</div>
          <div class="history-row__sub">
            ${badge(p.badge)}
            <span>·</span>
            <span>${esc(p.payer)}</span>
          </div>
        </div>
        <span class="history-row__share" role="button" tabindex="0" onclick="event.stopPropagation(); openShareSheet('${p.id}')" aria-label="Share">
          <i data-lucide="share"></i>
        </span>
        <span class="history-row__chev"><i data-lucide="chevron-right"></i></span>
      </div>

      <div style="height:24px"></div>
    </div>
  `;
};

window.recheckPatient = function (id) {
  const p = PATIENTS_BY_ID[id];
  // Pre-fill form, run check
  State.newCheck.payer = p.payer;
  State.newCheck.payerType = payerForPatient(p.payer);
  State.newCheck.memberId = p.memberId;
  State.newCheck.firstName = p.firstName;
  State.newCheck.lastName = p.lastName;
  State.newCheck.dob = p.dob;
  State.newCheck.groupNumber = p.groupNumber || '';
  State.newCheck.plan = p.plan || '';
  State.result = { state: 'pending', patientId: p.id };
  navigate('newCheck');
  setTimeout(() => { State.result.state = 'result'; render(); }, 1500);
};

window.addNoteFromInput = function (id) {
  const input = document.getElementById('noteInput');
  if (!input) return;
  const v = input.value.trim();
  if (!v) return;
  const note = {
    time: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit' }).replace(',', ' ·'),
    body: v
  };
  State.patientNotes[id] = [...(State.patientNotes[id] || []), note];
  showToast('Note added', 1200);
  render();
};

window.openAddNote = function (id) {
  navigate('patientDetail', { patientId: id });
  setTimeout(() => {
    const el = document.getElementById('noteInput');
    if (el) el.focus();
  }, 50);
};

/* -------------------- Profile (§6.12) -------------------- */

SCREENS.profile = function () {
  return `
    <div class="appbar">
      <div style="width:36px"></div>
      <div class="appbar__title" style="text-align:left;padding-left:8px">Profile</div>
      <div style="width:36px"></div>
    </div>

    <div class="scroll-area" style="padding:0">
      <div class="profile-hero">
        <div class="profile-hero__avatar">${esc(AGENCY.user.split(' ').map(n => n[0]).join(''))}</div>
        <div class="profile-hero__name">${esc(AGENCY.user)}</div>
        <div class="profile-hero__role">${esc(AGENCY.role)} · ${esc(AGENCY.name)}</div>
      </div>

      <div class="settings-group">
        <div class="settings-group__label">Account</div>
        <div class="settings-list">
          <button class="settings-row">
            <span class="settings-row__label">Email</span>
            <span class="settings-row__value">${esc(AGENCY.email)}</span>
            <span class="settings-row__chev"><i data-lucide="chevron-right"></i></span>
          </button>
          <button class="settings-row">
            <span class="settings-row__label">Password</span>
            <span class="settings-row__value">Change</span>
            <span class="settings-row__chev"><i data-lucide="chevron-right"></i></span>
          </button>
          <div class="settings-row">
            <span class="settings-row__label">Use Face ID to unlock</span>
            <button class="toggle-track is-on" onclick="this.classList.toggle('is-on')"></button>
          </div>
        </div>
      </div>

      <div class="settings-group">
        <div class="settings-group__label">Agency</div>
        <div class="settings-list">
          <div class="settings-row"><span class="settings-row__label">Agency</span><span class="settings-row__value">${esc(AGENCY.name)}</span></div>
          <div class="settings-row"><span class="settings-row__label">Your role</span><span class="settings-row__value">${esc(AGENCY.role)}</span></div>
          <div class="settings-row"><span class="settings-row__label">Branch</span><span class="settings-row__value">${esc(AGENCY.branch)}</span></div>
        </div>
      </div>

      <div class="settings-group">
        <div class="settings-group__label">Notifications</div>
        <div class="settings-list">
          <div class="settings-row">
            <span class="settings-row__label">In-app alerts</span>
            <button class="toggle-track is-on" onclick="this.classList.toggle('is-on')"></button>
          </div>
          <div class="settings-row">
            <span class="settings-row__label">Email digest</span>
            <button class="toggle-track" onclick="this.classList.toggle('is-on')"></button>
          </div>
          <div class="settings-row">
            <span class="settings-row__label">Hide patient names</span>
            <button class="toggle-track" onclick="this.classList.toggle('is-on')"></button>
          </div>
        </div>
      </div>

      <div class="settings-group">
        <div class="settings-group__label">About</div>
        <div class="settings-list">
          <button class="settings-row"><span class="settings-row__label">Version</span><span class="settings-row__value">1.0.0 (build 142)</span></button>
          <button class="settings-row"><span class="settings-row__label">Terms of service</span><span class="settings-row__chev"><i data-lucide="chevron-right"></i></span></button>
          <button class="settings-row"><span class="settings-row__label">HIPAA notice</span><span class="settings-row__chev"><i data-lucide="chevron-right"></i></span></button>
          <button class="settings-row"><span class="settings-row__label">Support</span><span class="settings-row__value">support@verifyhh.com</span></button>
        </div>
      </div>

      <div style="padding: 16px 20px 24px">
        <button class="btn btn--secondary btn--full" onclick="navigate('signin')" style="color:var(--error-500)">Sign out</button>
      </div>
    </div>

    ${renderBottomNav()}
  `;
};

/* -------------------- Modals -------------------- */

function renderModal() {
  if (!State.modal) return '';
  switch (State.modal) {
    case 'payer':     return renderPayerPicker();
    case 'share':     return renderSharePreSheet();
    case 'ios-share': return renderIosShareSheet();
    case 'pdf':       return renderPdfModal();
  }
  return '';
}

/* Payer picker */

function renderPayerPicker() {
  const groups = PAYERS.groups.map(g => `
    <div class="picker-group">
      <div class="picker-group__label">${esc(g.label)}</div>
      ${g.items.map(it => `
        <button class="picker-item ${State.newCheck.payer === it.name ? 'is-active' : ''}"
                onclick="selectPayer('${esc(it.name)}')">
          <div>
            <div>${esc(it.name)}</div>
            <div style="font-size:12px;color:var(--cool-400);font-weight:400">${esc(it.subtitle)}</div>
          </div>
          <i class="picker-item__check" data-lucide="check"></i>
        </button>
      `).join('')}
    </div>
  `).join('');

  const recent = `
    <div class="picker-group">
      <div class="picker-group__label">Recent</div>
      ${PAYERS.recent.map(name => `
        <button class="picker-item ${State.newCheck.payer === name ? 'is-active' : ''}"
                onclick="selectPayer('${esc(name)}')">
          <div>${esc(name)}</div>
          <i class="picker-item__check" data-lucide="check"></i>
        </button>
      `).join('')}
    </div>
  `;

  return `
    <div class="scrim" onclick="closeModal()"></div>
    <div class="sheet" role="dialog" aria-label="Choose payer">
      <div class="sheet__handle"></div>
      <div class="sheet__title">Choose payer</div>
      <div class="picker-search">
        <i data-lucide="search"></i>
        <input type="text" placeholder="Search payers" />
      </div>
      <div class="picker-list">
        ${recent}
        ${groups}
        <button class="btn btn--ghost" style="margin: 12px auto 4px; display:block">Can't find your payer?</button>
        <div style="height:8px"></div>
      </div>
    </div>
  `;
}

window.selectPayer = function (name) {
  const t = PAYER_TYPE_BY_NAME[name] || 'commercial';
  State.newCheck.payer = name;
  State.newCheck.payerType = t;
  // Reset form (different fields)
  State.newCheck.memberId = '';
  State.newCheck.firstName = '';
  State.newCheck.lastName = '';
  State.newCheck.dob = '';
  State.newCheck.groupNumber = '';
  State.newCheck.plan = '';
  State.result = { state: 'empty', patientId: null };
  closeModal();
};

/* Share pre-sheet */

window.openShareSheet = function (id) { openModal('share', { patientId: id }); };

function renderSharePreSheet() {
  const p = PATIENTS_BY_ID[State.modalParams.patientId];
  if (!p) return '';

  return `
    <div class="scrim" onclick="closeModal()"></div>
    <div class="sheet share-sheet" role="dialog" aria-label="Share eligibility check">
      <div class="sheet__handle"></div>
      <div class="sheet__title">Share eligibility check</div>

      <div class="share-sheet__preview" onclick="openModal('pdf',{patientId:'${p.id}'})" aria-label="Open PDF preview">
        ${renderPdfThumbnail(p)}
      </div>

      <div class="share-sheet__summary">
        <span style="font-weight:600">${esc(p.firstName)} ${esc(p.lastName)}</span>
        <span>·</span>
        <span>${esc(p.payer)}</span>
        ${badge(p.badge)}
      </div>

      <div class="share-sheet__hipaa">This document contains PHI. Only share with authorized recipients.</div>

      <div class="share-sheet__buttons">
        <button class="btn btn--primary btn--full" onclick="openModal('ios-share',{patientId:'${p.id}'})">
          <i data-lucide="share"></i> Share via…
        </button>
        <button class="btn btn--ghost btn--full" onclick="closeModal()" style="text-align:center;justify-content:center">Cancel</button>
      </div>
    </div>
  `;
}

function renderPdfThumbnail(p) {
  const headerCls = p.outcome === 'system-error' ? 'pdf-thumb__band--cool'
                   : p.outcome === 'rejected'    ? 'pdf-thumb__band--secondary' : '';
  const badgeCls = {
    eligible: 'pdf-thumb__badge--eligible',
    action:   'pdf-thumb__badge--action',
    not:      'pdf-thumb__badge--not',
    'system-error': 'pdf-thumb__badge--system',
    rejected: 'pdf-thumb__badge--action'
  }[p.outcome] || 'pdf-thumb__badge--eligible';

  return `
    <div class="pdf-thumb">
      <div class="pdf-thumb__band ${headerCls}">
        <div style="display:flex;align-items:center;gap:3px">
          <span class="pdf-thumb__logo"></span>
          <span class="pdf-thumb__name">Coastal HH</span>
        </div>
        <span class="pdf-thumb__check">Check</span>
      </div>
      <div class="pdf-thumb__patient">${esc(p.firstName)} ${esc(p.lastName)}</div>
      <div class="pdf-thumb__meta">${esc(p.payer)}</div>
      <span class="pdf-thumb__badge ${badgeCls}">${esc(p.badge.text)}</span>

      <div class="pdf-thumb__section">Coverage</div>
      <div class="pdf-thumb__line"></div>
      <div class="pdf-thumb__line pdf-thumb__line--short"></div>
      <div class="pdf-thumb__section">Network</div>
      <div class="pdf-thumb__line"></div>
      <div class="pdf-thumb__section">Service area</div>
      <div class="pdf-thumb__line"></div>
      <div class="pdf-thumb__line pdf-thumb__line--short"></div>
    </div>
  `;
}

/* iOS share sheet (mock) */

function renderIosShareSheet() {
  const p = PATIENTS_BY_ID[State.modalParams.patientId];
  if (!p) return '';
  const filename = `Verify_${p.lastName}_${p.payer.replace(/\s+/g, '')}_2026-04-29.pdf`;

  return `
    <div class="scrim" onclick="closeModal()"></div>
    <div class="sheet ios-share" role="dialog" aria-label="Share via">
      <div class="ios-share__handle"></div>

      <div class="ios-share__doc">
        <div class="ios-share__doc-icon">PDF</div>
        <div style="flex:1;min-width:0">
          <div class="ios-share__doc-name">${esc(filename)}</div>
          <div class="ios-share__doc-meta">218 KB · 1 page</div>
        </div>
      </div>

      <div class="ios-share__row">
        <button class="ios-share__app ios-share__app--airdrop" onclick="completeShare('AirDrop')">
          <div class="ios-share__app-icon"><i data-lucide="radio"></i></div>
          AirDrop
        </button>
        <button class="ios-share__app ios-share__app--mail" onclick="completeShare('Mail')">
          <div class="ios-share__app-icon"><i data-lucide="mail"></i></div>
          Mail
        </button>
        <button class="ios-share__app ios-share__app--messages" onclick="completeShare('Messages')">
          <div class="ios-share__app-icon"><i data-lucide="message-square"></i></div>
          Messages
        </button>
        <button class="ios-share__app ios-share__app--files" onclick="completeShare('Files')">
          <div class="ios-share__app-icon"><i data-lucide="folder"></i></div>
          Files
        </button>
        <button class="ios-share__app ios-share__app--print" onclick="completeShare('Print')">
          <div class="ios-share__app-icon"><i data-lucide="printer"></i></div>
          Print
        </button>
      </div>

      <div class="ios-share__list">
        <button class="ios-share__list-row" onclick="completeShare('Copy')">
          <span class="leading"><i data-lucide="copy"></i></span>
          Copy
          <i data-lucide="copy"></i>
        </button>
        <button class="ios-share__list-row" onclick="completeShare('Save to Files')">
          <span class="leading"><i data-lucide="folder"></i></span>
          Save to Files
          <i data-lucide="folder"></i>
        </button>
        <button class="ios-share__list-row" onclick="completeShare('Print')">
          <span class="leading"><i data-lucide="printer"></i></span>
          Print
          <i data-lucide="printer"></i>
        </button>
      </div>

      <button class="ios-share__cancel" onclick="closeModal()">Cancel</button>
    </div>
  `;
}

window.completeShare = function (target) {
  closeModal();
  showToast(`Shared via ${target}`, 1800);
};

/* PDF preview modal (full overlay, escapes phone frame) */

function renderPdfModal() {
  const p = PATIENTS_BY_ID[State.modalParams.patientId];
  if (!p) return '';
  return `
    <div class="pdf-overlay" onclick="if(event.target===this) closeModal()">
      <div class="pdf-overlay__inner">
        <div class="pdf-overlay__topbar">
          <div class="t-strong">PDF Preview</div>
          <button class="pdf-overlay__close" onclick="closeModal()" aria-label="Close">
            <i data-lucide="x"></i>
          </button>
        </div>
        <div class="pdf-overlay__body">
          ${renderPdfPage(p)}
        </div>
      </div>
    </div>
  `;
}

function renderPdfPage(p) {
  const isSystemError = p.outcome === 'system-error';
  const isRejected = p.outcome === 'rejected';
  const headerMod = isSystemError ? 'pdf-page__header--cool'
                  : isRejected    ? 'pdf-page__header--secondary' : '';

  const headerBadge = isSystemError
    ? badge({ text: 'System Error', cls: 'badge--system-error', icon: 'wifi-off' })
    : isRejected
      ? badge({ text: 'Payer Could Not Verify', cls: 'badge--payer-unverified', icon: 'alert-circle' })
      : badge(p.badge);

  const failureCallout = isSystemError
    ? `<div class="pdf-failure-callout">We couldn't reach the payer at the time of this check. <strong>This is not a coverage decision.</strong> Please re-run the check.</div>`
    : isRejected
      ? `<div class="pdf-failure-callout pdf-failure-callout--secondary">The payer could not verify this member from the information submitted. <strong>This is not a coverage decision.</strong> Confirm the member ID, name, and DOB and try again.</div>`
      : '';

  const summary = isSystemError
    ? `Payer endpoint did not respond. No coverage decision was made.`
    : isRejected
      ? `Payer rejected the eligibility request — member not found.`
      : p.summary;

  const sections = (p.plainEnglish || []).map(sec => {
    const ruleClass = sec.rule === 'pass' ? 'is-pass' : sec.rule === 'warn' ? 'is-warn' : 'is-fail';
    return `
      <div class="pdf-section">
        <div class="pdf-section__head">
          <div class="pdf-section__title">${esc(sec.title)}</div>
          <div class="pdf-section__rule ${ruleClass}">${esc(sec.ruleLabel)}</div>
        </div>
        ${sec.rows.map(([k, v]) => `
          <div class="pdf-fact-row">
            <span class="pdf-fact-row__label">${esc(k)}</span>
            <span class="pdf-fact-row__value">${esc(v)}</span>
          </div>
        `).join('')}
      </div>
    `;
  }).join('');

  const masked = p.memberId ? '••••' + p.memberId.slice(-4) : '—';

  return `
    <div class="pdf-page">
      <div class="pdf-page__header ${headerMod}">
        <div class="pdf-logo">
          <span class="pdf-logo__mark"></span>
          <div>
            <div class="pdf-logo__name">${esc(AGENCY.name)}</div>
          </div>
        </div>
        <div class="pdf-meta">
          <div class="pdf-meta__eyebrow">Eligibility Verification</div>
          <div class="pdf-meta__date">${esc(p.timestampAbs)}</div>
        </div>
      </div>

      <div class="pdf-patient">
        <div style="flex:1">
          <div class="pdf-patient__name">${esc(p.firstName)} ${esc(p.lastName)}</div>
          <div class="pdf-patient__meta">
            DOB ${esc(p.dob)} &nbsp;·&nbsp; Member ID ${esc(masked)}<br/>
            Payer: ${esc(p.payer)}
          </div>
          <div class="pdf-patient__summary">${esc(summary)}</div>
        </div>
        <div class="pdf-patient__badge">${headerBadge}</div>
      </div>

      <div class="pdf-body">
        ${failureCallout}
        ${sections}
      </div>

      <div class="pdf-footer">
        <div>Checked by ${esc(AGENCY.user)}, ${esc(AGENCY.role)} · ${esc(AGENCY.name)}</div>
        <div class="pdf-footer__center">1 of 1</div>
        <div class="pdf-footer__right pdf-footer__hipaa">Confidential — Protected Health Information. Unauthorized disclosure prohibited.</div>
      </div>
    </div>
  `;
}

/* -------------------- Boot + drawer wiring -------------------- */

function jumpHero(target) {
  const map = {
    'hero-margaret': 'margaret-johnson',
    'hero-robert':   'robert-chen',
    'hero-patricia': 'patricia-williams',
    'hero-frank':    'frank-sullivan'
  };
  const id = map[target];
  if (!id) return;
  const p = PATIENTS_BY_ID[id];
  // Set up the new-check screen pre-filled with this patient and result already showing
  State.newCheck.payer = p.payer;
  State.newCheck.payerType = payerForPatient(p.payer);
  State.newCheck.memberId = p.memberId;
  State.newCheck.firstName = p.firstName;
  State.newCheck.lastName = p.lastName;
  State.newCheck.dob = p.dob;
  State.newCheck.groupNumber = p.groupNumber || '';
  State.newCheck.plan = p.plan || '';
  State.result = { state: 'result', patientId: p.id };
  navigate('newCheck');
}

function bindDrawer() {
  document.querySelectorAll('[data-jump]').forEach(b => {
    b.addEventListener('click', () => jumpHero(b.dataset.jump));
  });
  document.querySelectorAll('[data-screen]').forEach(b => {
    b.addEventListener('click', () => {
      const s = b.dataset.screen;
      if (s === 'newCheck') startNewCheck();
      else navigate(s);
    });
  });
  const offlineBtn = document.getElementById('toggleOffline');
  offlineBtn && offlineBtn.addEventListener('click', () => setState({ offline: !State.offline }));
  const resetBtn = document.getElementById('resetDemo');
  resetBtn && resetBtn.addEventListener('click', () => {
    State.history = [];
    State.patientNotes = {};
    State.result = { state: 'empty', patientId: null };
    State.newCheck = {
      payer: 'Traditional Medicare', payerType: 'medicare-ffs',
      memberId: '', firstName: '', lastName: '', dob: '', groupNumber: '', plan: ''
    };
    State.detailMode = 'plain';
    State.historyFilter = 'all';
    State.historySearch = '';
    State.offline = false;
    navigate('signin');
  });

  const drawerToggle = document.getElementById('drawerToggle');
  drawerToggle && drawerToggle.addEventListener('click', () => {
    document.querySelector('.stage').classList.toggle('drawer-open');
  });

  // Wire the feedback link(s) to the configured URL.
  document.querySelectorAll('[data-feedback-link]').forEach(el => {
    el.setAttribute('href', FEEDBACK_URL);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  bindDrawer();
  render();
});
