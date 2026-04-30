/* ============================================================
   Verify · sample data for the prototype.
   Aligned with §7 (sample patients) of the merged spec.
   ============================================================ */

const AGENCY = {
  name: 'Coastal Home Health',
  user: 'Sarah Martinez',
  role: 'Liaison',
  branch: 'Ocean County, NJ',
  email: 'sarah.martinez@coastalhh.com'
};

/* ---------- Payers ---------- */

const PAYERS = {
  recent: ['Traditional Medicare', 'NJ FamilyCare', 'Aetna Medicare Advantage'],
  groups: [
    {
      label: 'Medicare',
      items: [
        { name: 'Traditional Medicare', subtitle: 'Original / FFS', type: 'medicare-ffs' },
        { name: 'Aetna Medicare Advantage', subtitle: 'Medicare Advantage', type: 'medicare-ma' },
        { name: 'BCBS NJ Medicare Advantage', subtitle: 'Medicare Advantage', type: 'medicare-ma' },
        { name: 'UHC Medicare Advantage', subtitle: 'Medicare Advantage', type: 'medicare-ma' },
        { name: 'Humana Gold Plus', subtitle: 'Medicare Advantage', type: 'medicare-ma' },
        { name: 'Cigna Medicare Advantage', subtitle: 'Medicare Advantage', type: 'medicare-ma' }
      ]
    },
    {
      label: 'Medicaid',
      items: [
        { name: 'NJ FamilyCare', subtitle: 'NJ Medicaid', type: 'medicaid' }
      ]
    },
    {
      label: 'Commercial',
      items: [
        { name: 'Aetna', subtitle: 'Commercial', type: 'commercial' },
        { name: 'BCBS NJ', subtitle: 'Commercial', type: 'commercial' },
        { name: 'UnitedHealthcare', subtitle: 'Commercial', type: 'commercial' },
        { name: 'Humana', subtitle: 'Commercial', type: 'commercial' },
        { name: 'Cigna', subtitle: 'Commercial', type: 'commercial' }
      ]
    }
  ]
};

/* Maps a payer name → its type. */
const PAYER_TYPE_BY_NAME = {};
PAYERS.groups.forEach(g => g.items.forEach(p => { PAYER_TYPE_BY_NAME[p.name] = p.type; }));

/* Required form fields by payer type. (See §3.C) */
const FIELDS_BY_TYPE = {
  'medicare-ffs': ['memberId', 'lastName', 'dob'],          // memberId labeled MBI
  'medicaid':     ['memberId', 'lastName', 'dob'],
  'medicare-ma':  ['memberId', 'lastName', 'dob'],          // plan auto-detected
  'commercial':   ['memberId', 'firstName', 'lastName', 'dob', 'groupNumber']
};

const FIELD_LABELS = {
  memberId_mbi: 'MBI',
  memberId: 'Member ID',
  firstName: 'First Name',
  lastName: 'Last Name',
  dob: 'Date of Birth',
  groupNumber: 'Group # (optional)'
};

const FIELD_PLACEHOLDERS = {
  memberId_mbi: '1EG4-TE5-MK73',
  memberId: 'Enter member ID',
  firstName: 'First name',
  lastName: 'Last name',
  dob: 'MM/DD/YYYY',
  groupNumber: 'Optional'
};

/* ---------- Patients (sample dataset, §7) ---------- */

const PATIENTS = [
  {
    id: 'margaret-johnson',
    firstName: 'Margaret',
    lastName: 'Johnson',
    initials: 'MJ',
    dob: '03/15/1942',
    payer: 'Traditional Medicare',
    memberId: '1EG4-TE5-MK73',
    address: '142 Beach Ave, Toms River, NJ 08755',
    outcome: 'eligible',
    badge: { text: 'Eligible', cls: 'badge--eligible', icon: 'check-circle' },
    summary: 'Margaret Johnson is eligible for home health services.',
    facts: [
      { label: 'Coverage', value: 'Active' },
      { label: 'Plan', value: 'Medicare Part A & B' },
      { label: 'Effective', value: '03/01/2007' },
      { label: 'Service area', value: 'Within Ocean County' },
      { label: 'Open episodes', value: 'None' },
      { label: 'Network status', value: 'In-network' }
    ],
    timestamp: '12 min ago',
    timestampAbs: 'Apr 29, 2026 · 2:14 PM',
    notes: [
      { time: 'Apr 28, 2026 · 4:30 PM', body: 'Spoke with discharge planner at Ocean Medical — Margaret is ready for SOC Monday. Family aware.' }
    ],
    plainEnglish: [
      {
        title: 'Coverage',
        rule: 'pass',
        ruleLabel: '✓ Active',
        rows: [
          ['Status', 'Active'],
          ['Effective date', '03/01/2007'],
          ['Termination date', '—']
        ]
      },
      {
        title: 'Plan Details',
        rule: 'pass',
        ruleLabel: '✓ Part A & B',
        rows: [
          ['Plan', 'Medicare Part A & B'],
          ['Plan type', 'Original Medicare (FFS)'],
          ['HIC / MBI', '••••-•••-MK73']
        ]
      },
      {
        title: 'Network Status',
        rule: 'pass',
        ruleLabel: '✓ In-network',
        rows: [
          ['Provider', 'Coastal Home Health'],
          ['Network status', 'In-network']
        ]
      },
      {
        title: 'Service Area Check',
        rule: 'pass',
        ruleLabel: '✓ In service area',
        rows: [
          ['Patient ZIP', '08755'],
          ['County', 'Ocean'],
          ['Result', 'Within service area']
        ]
      },
      {
        title: 'Open Episode Check',
        rule: 'pass',
        ruleLabel: '✓ No open episode',
        rows: [
          ['HHA episodes', 'None active'],
          ['Last episode', 'Discharged 11/02/2024']
        ]
      },
      {
        title: 'MSP Check',
        rule: 'pass',
        ruleLabel: '✓ Medicare primary',
        rows: [
          ['Primary payer', 'Medicare'],
          ['Secondary payer', 'None on file']
        ]
      },
      {
        title: 'Hospice Check',
        rule: 'pass',
        ruleLabel: '✓ Not on hospice',
        rows: [
          ['Hospice election', 'None']
        ]
      }
    ],
    detailed: [
      {
        name: 'EB · Eligibility / Benefit',
        rows: [
          ['EB01', '1 — Active Coverage'],
          ['EB02', 'IND — Individual'],
          ['EB03', '30 — Health Benefit Plan Coverage'],
          ['EB04', 'MA — Medicare Part A'],
          ['EB05', 'Medicare Part A']
        ]
      },
      {
        name: 'EB · Part B',
        rows: [
          ['EB01', '1 — Active Coverage'],
          ['EB04', 'MB — Medicare Part B'],
          ['EB05', 'Medicare Part B']
        ]
      },
      {
        name: 'DTP · Plan Begin',
        rows: [
          ['DTP01', '356 — Eligibility Begin'],
          ['DTP02', 'D8 — Date'],
          ['DTP03', '20070301']
        ]
      },
      {
        name: 'REF · Member ID',
        rows: [
          ['REF01', 'HJ — Identity Card Number'],
          ['REF02', '••••••MK73']
        ]
      },
      {
        name: 'III · Episode',
        rows: [
          ['III01', 'No HHA episode on file'],
          ['III02', 'Last discharge 20241102']
        ]
      }
    ]
  },

  {
    id: 'robert-chen',
    firstName: 'Robert',
    lastName: 'Chen',
    initials: 'RC',
    dob: '07/22/1938',
    payer: 'Traditional Medicare',
    memberId: '2EW7-PR4-FN21',
    address: '88 Pine Hollow Rd, Lakewood, NJ 08701',
    outcome: 'action',
    badge: { text: 'Action Needed', cls: 'badge--action', icon: 'alert-triangle' },
    summary: 'Robert Chen has an open home health episode with another provider.',
    callout: {
      label: 'Open episode',
      body: 'Compassionate Care HHA, through 04/30/2026 (5 days remaining).'
    },
    facts: [
      { label: 'Coverage', value: 'Active' },
      { label: 'Plan', value: 'Medicare Part A & B' },
      { label: 'Effective', value: '08/01/2003' },
      { label: 'Service area', value: 'Within Ocean County' },
      { label: 'Network status', value: 'In-network' },
      { label: 'MSP', value: 'Medicare primary' }
    ],
    recommendedActions: [
      'Contact current provider to confirm discharge date.',
      'Schedule recheck after 04/30/2026.'
    ],
    timestamp: '1 hr ago',
    timestampAbs: 'Apr 29, 2026 · 1:02 PM',
    notes: [
      { time: 'Apr 29, 2026 · 1:05 PM', body: 'Left voicemail for Compassionate Care intake — confirming actual discharge date.' }
    ],
    plainEnglish: [
      {
        title: 'Coverage',
        rule: 'pass',
        ruleLabel: '✓ Active',
        rows: [['Status', 'Active'], ['Effective date', '08/01/2003']]
      },
      {
        title: 'Plan Details',
        rule: 'pass',
        ruleLabel: '✓ Part A & B',
        rows: [['Plan', 'Medicare Part A & B'], ['Plan type', 'Original Medicare (FFS)']]
      },
      {
        title: 'Network Status',
        rule: 'pass',
        ruleLabel: '✓ In-network',
        rows: [['Provider', 'Coastal Home Health']]
      },
      {
        title: 'Service Area Check',
        rule: 'pass',
        ruleLabel: '✓ In service area',
        rows: [['ZIP', '08701'], ['County', 'Ocean']]
      },
      {
        title: 'Open Episode Check',
        rule: 'warn',
        ruleLabel: '⚠ Open episode found',
        rows: [
          ['Provider', 'Compassionate Care HHA'],
          ['Episode start', '02/29/2026'],
          ['Episode end', '04/30/2026'],
          ['Days remaining', '5']
        ]
      },
      {
        title: 'MSP Check',
        rule: 'pass',
        ruleLabel: '✓ Medicare primary',
        rows: [['Primary payer', 'Medicare']]
      },
      {
        title: 'Hospice Check',
        rule: 'pass',
        ruleLabel: '✓ Not on hospice',
        rows: [['Hospice election', 'None']]
      }
    ],
    detailed: [
      {
        name: 'EB · Eligibility',
        rows: [['EB01', '1 — Active Coverage'], ['EB04', 'MA — Medicare Part A']]
      },
      {
        name: 'III · HHA Episode',
        rows: [
          ['III01', 'Active'],
          ['III02', 'NPI 1740291847'],
          ['III03', 'Compassionate Care HHA'],
          ['DTP01', '472 — Service'],
          ['DTP03', '20260229-20260430']
        ]
      },
      {
        name: 'DTP · Coverage',
        rows: [['DTP01', '356 — Eligibility Begin'], ['DTP03', '20030801']]
      }
    ]
  },

  {
    id: 'patricia-williams',
    firstName: 'Patricia',
    lastName: 'Williams',
    initials: 'PW',
    dob: '11/08/1955',
    payer: 'NJ FamilyCare',
    memberId: 'NJM-08753-441',
    address: '1247 Ridge Rd, Toms River, NJ 08753',
    outcome: 'not',
    badge: { text: 'Not Eligible', cls: 'badge--not-eligible', icon: 'x-circle' },
    summary: 'Patricia Williams is outside our service area.',
    callout: {
      label: 'Address',
      body: '1247 Ridge Rd, Toms River, NJ 08753 — within Ocean County, but ZIP 08753 is excluded from coverage.'
    },
    facts: [
      { label: 'Coverage', value: 'Active (Medicaid)' },
      { label: 'Plan', value: 'NJ FamilyCare A' },
      { label: 'Effective', value: '01/01/2018' },
      { label: 'Service area', value: 'ZIP 08753 excluded' },
      { label: 'Network status', value: 'In-network' },
      { label: 'MSP', value: 'Medicaid primary' }
    ],
    timestamp: '3 hr ago',
    timestampAbs: 'Apr 29, 2026 · 11:18 AM',
    notes: [],
    plainEnglish: [
      {
        title: 'Coverage',
        rule: 'pass',
        ruleLabel: '✓ Active',
        rows: [['Status', 'Active'], ['Effective date', '01/01/2018']]
      },
      {
        title: 'Plan Details',
        rule: 'pass',
        ruleLabel: '✓ Plan A',
        rows: [['Plan', 'NJ FamilyCare A'], ['Managed by', 'Horizon NJ Health']]
      },
      {
        title: 'Network Status',
        rule: 'pass',
        ruleLabel: '✓ In-network',
        rows: [['Provider', 'Coastal Home Health']]
      },
      {
        title: 'Service Area Check',
        rule: 'fail',
        ruleLabel: '✗ ZIP excluded',
        rows: [
          ['Patient ZIP', '08753'],
          ['County', 'Ocean'],
          ['Result', 'ZIP 08753 is excluded from coverage area']
        ]
      },
      {
        title: 'Open Episode Check',
        rule: 'pass',
        ruleLabel: '✓ No open episode',
        rows: [['HHA episodes', 'None']]
      }
    ],
    detailed: [
      {
        name: 'EB · Eligibility',
        rows: [['EB01', '1 — Active Coverage'], ['EB04', 'OT — Other'], ['EB05', 'NJ FamilyCare A']]
      },
      {
        name: 'NM1 · Subscriber',
        rows: [['NM103', 'WILLIAMS'], ['NM104', 'PATRICIA'], ['NM109', 'NJM••••••441']]
      },
      {
        name: 'N3 · Address',
        rows: [['N301', '1247 RIDGE RD'], ['N401', 'TOMS RIVER'], ['N402', 'NJ'], ['N403', '08753']]
      }
    ]
  },

  {
    id: 'james-rodriguez',
    firstName: 'James',
    lastName: 'Rodriguez',
    initials: 'JR',
    dob: '01/30/1948',
    payer: 'Aetna Medicare Advantage',
    memberId: 'W849221007',
    plan: 'Aetna Medicare Premier (HMO)',
    address: '215 Oak Ridge Dr, Brick, NJ 08723',
    outcome: 'not',
    badge: { text: 'Not Eligible', cls: 'badge--not-eligible', icon: 'x-circle' },
    summary: 'Aetna Medicare Advantage is not contracted with Coastal Home Health.',
    callout: {
      label: 'Network',
      body: 'Coastal Home Health is out-of-network for Aetna MA. Patient may have OON benefits but they are not covered for HHA services.'
    },
    facts: [
      { label: 'Coverage', value: 'Active' },
      { label: 'Plan', value: 'Aetna MA Premier (HMO)' },
      { label: 'Effective', value: '01/01/2024' },
      { label: 'Service area', value: 'Within Ocean County' },
      { label: 'Network status', value: 'Out-of-network' },
      { label: 'MSP', value: 'Aetna MA primary' }
    ],
    timestamp: '5 hr ago',
    timestampAbs: 'Apr 29, 2026 · 9:42 AM',
    notes: [],
    plainEnglish: [
      {
        title: 'Coverage',
        rule: 'pass',
        ruleLabel: '✓ Active',
        rows: [['Status', 'Active'], ['Effective date', '01/01/2024']]
      },
      {
        title: 'Plan Details',
        rule: 'pass',
        ruleLabel: '✓ HMO',
        rows: [['Plan', 'Aetna Medicare Premier (HMO)'], ['Plan type', 'Medicare Advantage']]
      },
      {
        title: 'Network Status',
        rule: 'fail',
        ruleLabel: '✗ Out-of-network',
        rows: [['Agency', 'Coastal Home Health'], ['Contract status', 'Not contracted']]
      }
    ],
    detailed: [
      {
        name: 'EB · Eligibility',
        rows: [['EB01', '1 — Active Coverage'], ['EB04', 'MC — Medicare Advantage']]
      },
      {
        name: 'REF · Plan',
        rows: [['REF01', 'IL — Group/Plan'], ['REF02', 'AETNA-MA-PREMIER-HMO']]
      }
    ]
  },

  {
    id: 'linda-brown',
    firstName: 'Linda',
    lastName: 'Brown',
    initials: 'LB',
    dob: '09/12/1944',
    payer: 'Humana',
    memberId: 'H7829441-02',
    groupNumber: '60284',
    address: '402 Bayview Ave, Point Pleasant, NJ 08742',
    outcome: 'eligible',
    badge: { text: 'Eligible', cls: 'badge--eligible', icon: 'check-circle' },
    summary: 'Linda Brown is eligible for home health services.',
    facts: [
      { label: 'Coverage', value: 'Active' },
      { label: 'Plan', value: 'Humana ChoiceCare' },
      { label: 'Effective', value: '07/01/2019' },
      { label: 'Service area', value: 'Within Ocean County' },
      { label: 'Network status', value: 'In-network' },
      { label: 'MSP', value: 'Humana primary' }
    ],
    timestamp: 'Yesterday',
    timestampAbs: 'Apr 28, 2026 · 3:48 PM',
    notes: [],
    plainEnglish: [
      { title: 'Coverage', rule: 'pass', ruleLabel: '✓ Active', rows: [['Status', 'Active'], ['Effective date', '07/01/2019']] },
      { title: 'Plan Details', rule: 'pass', ruleLabel: '✓ Commercial', rows: [['Plan', 'Humana ChoiceCare'], ['Group', '60284']] },
      { title: 'Network Status', rule: 'pass', ruleLabel: '✓ In-network', rows: [['Provider', 'Coastal Home Health']] }
    ],
    detailed: [
      { name: 'EB · Eligibility', rows: [['EB01', '1 — Active Coverage']] },
      { name: 'REF · Group', rows: [['REF02', '60284']] }
    ]
  },

  {
    id: 'frank-sullivan',
    firstName: 'Frank',
    lastName: 'Sullivan',
    initials: 'FS',
    dob: '02/18/1939',
    payer: 'Traditional Medicare',
    memberId: '4ER9-MN5-LK02',
    address: '17 Harbor View Ln, Toms River, NJ 08755',
    outcome: 'system-error',
    badge: { text: 'System Error', cls: 'badge--system-error', icon: 'wifi-off' },
    summary: "We couldn't reach the payer. This is not a coverage decision.",
    timestamp: '20 min ago',
    timestampAbs: 'Apr 29, 2026 · 2:06 PM',
    notes: [
      { time: 'Apr 29, 2026 · 2:08 PM', body: 'Payer endpoint timed out. Will retry after lunch.' }
    ],
    plainEnglish: [
      { title: 'Connection', rule: 'fail', ruleLabel: '✗ Timeout',
        rows: [['Endpoint', 'CMS HETS 270/271'], ['Last attempt', '2:06 PM'], ['Status', 'No response (30s timeout)']] }
    ],
    detailed: [
      { name: 'AAA · Reject Reason (system)', rows: [['AAA01', 'N — No'], ['AAA03', '79 — Invalid Participant ID'], ['AAA04', 'N — Resubmission Not Allowed'] ] }
    ]
  },

  {
    id: 'dorothy-mitchell',
    firstName: 'Dorothy',
    lastName: 'Mitchell',
    initials: 'DM',
    dob: '06/05/1947',
    payer: 'UnitedHealthcare',
    memberId: 'UHC-849221',
    groupNumber: '00114',
    address: '52 Cranberry Hill, Manchester, NJ 08759',
    outcome: 'action',
    badge: { text: 'Action Needed', cls: 'badge--msp', icon: 'alert-triangle' },
    summary: 'UnitedHealthcare is secondary to Medicare on file.',
    callout: {
      label: 'Medicare Secondary Payer',
      body: 'Medicare must be billed primary before UHC. Confirm patient has active Medicare Parts A & B before SOC.'
    },
    facts: [
      { label: 'Coverage', value: 'Active' },
      { label: 'Plan', value: 'UHC Choice Plus' },
      { label: 'Effective', value: '04/01/2017' },
      { label: 'Service area', value: 'Within Ocean County' },
      { label: 'Network status', value: 'In-network' },
      { label: 'MSP', value: 'Secondary to Medicare' }
    ],
    recommendedActions: [
      'Verify Medicare Parts A & B are active separately.',
      'Bill Medicare first, UHC secondary.'
    ],
    timestamp: '2 days ago',
    timestampAbs: 'Apr 27, 2026 · 11:30 AM',
    notes: [],
    plainEnglish: [
      { title: 'Coverage', rule: 'pass', ruleLabel: '✓ Active', rows: [['Status', 'Active']] },
      { title: 'Plan Details', rule: 'pass', ruleLabel: '✓ Commercial', rows: [['Plan', 'UHC Choice Plus']] },
      { title: 'Network Status', rule: 'pass', ruleLabel: '✓ In-network', rows: [['Provider', 'Coastal Home Health']] },
      { title: 'MSP Check', rule: 'warn', ruleLabel: '⚠ MSP — Secondary',
        rows: [['Primary payer', 'Medicare'], ['Secondary payer', 'UHC Choice Plus']] }
    ],
    detailed: [
      { name: 'EB · COB', rows: [['EB01', 'R — Other or Additional Payer'], ['EB04', 'OT — Other']] }
    ]
  }
];

const PATIENTS_BY_ID = Object.fromEntries(PATIENTS.map(p => [p.id, p]));

/* ---------- Recent checks list (Home + History feed) ---------- */
const RECENT = [
  'frank-sullivan',
  'margaret-johnson',
  'robert-chen',
  'james-rodriguez'
];

/* ---------- Stats (Home) ---------- */
const STATS = {
  today: 4,
  week: 23,
  actionNeeded: 2
};
