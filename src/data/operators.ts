import { OperatorCatalog, OperatorId, Transaction, UserAccount } from '../types';

export const PAYMENT_MERCHANT_NUMBER = '+227 96 35 05 59';
export const WHATSAPP_URL = 'https://wa.me/22796350559';
export const RIBA_FEE_RATE = 0.04;
export const MIN_CREDIT_AMOUNT = 100;
export const REFERRAL_BONUS_AMOUNT = 200;

export const ADMIN_EMAIL = 'admin@saurimega.com';
export const ADMIN_PASSWORD = 'admin123';

export function buildReferralCode(name: string, seed: string): string {
  const letters = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .slice(0, 3)
    .padEnd(3, 'X');
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 900;
  }
  const num = 100 + hash;
  return `SAURI-${letters}${num}`;
}

export function calculateRiba(amountSent: number): {
  amountSent: number;
  profitFee: number;
  amountCredited: number;
} {
  const clean = Math.max(0, Math.round(amountSent));
  const profitFee = Math.round(clean * RIBA_FEE_RATE);
  const amountCredited = clean - profitFee;
  return {
    amountSent: clean,
    profitFee,
    amountCredited,
  };
}

export const OPERATOR_CATALOGS: OperatorCatalog[] = [
  {
    id: 'airtel',
    name: 'Airtel',
    shortCode: 'A',
    shortLabel: 'Airtel',
    tagline: 'Forfaits Jour, Semaine, Mois & Crédit Chap Chap',
    accentHex: '#E40000',
    bundles: {
      Jour: [
        { id: 'airtel-j-25', period: 'Jour', volume: '25Mo', price: 100, validityLabel: '1jr', label: '25Mo - 100F (1jr)' },
        { id: 'airtel-j-40', period: 'Jour', volume: '40Mo', price: 150, validityLabel: '1jr', label: '40Mo - 150F (1jr)' },
        { id: 'airtel-j-75', period: 'Jour', volume: '75Mo', price: 200, validityLabel: '1jr', label: '75Mo - 200F (1jr)' },
        { id: 'airtel-j-125', period: 'Jour', volume: '125Mo', price: 300, validityLabel: '1jr', label: '125Mo - 300F (1jr)' },
        { id: 'airtel-j-600', period: 'Jour', volume: '600Mo', price: 500, validityLabel: '1jr', label: '600Mo - 500F (1jr)' },
      ],
      Semaine: [
        { id: 'airtel-s-500', period: 'Semaine', volume: '500Mo', price: 500, validityLabel: '7jrs', label: '500Mo - 500F (7jrs)' },
        { id: 'airtel-s-1g', period: 'Semaine', volume: '1Go', price: 1000, validityLabel: '7jrs', label: '1Go - 1000F (7jrs)' },
        { id: 'airtel-s-3g', period: 'Semaine', volume: '3Go', price: 2000, validityLabel: '7jrs', label: '3Go - 2000F (7jrs)' },
        { id: 'airtel-s-5g', period: 'Semaine', volume: '5Go', price: 3000, validityLabel: '7jrs', label: '5Go - 3000F (7jrs)' },
      ],
      Mois: [
        { id: 'airtel-m-2g', period: 'Mois', volume: '2Go', price: 2000, validityLabel: '30jrs', label: '2Go - 2000F (30jrs)' },
        { id: 'airtel-m-6g', period: 'Mois', volume: '6Go', price: 5000, validityLabel: '30jrs', label: '6Go - 5000F (30jrs)' },
        { id: 'airtel-m-16g', period: 'Mois', volume: '16Go', price: 10000, validityLabel: '30jrs', label: '16Go - 10000F (30jrs)' },
        { id: 'airtel-m-40g', period: 'Mois', volume: '40Go', price: 20000, validityLabel: '30jrs', label: '40Go - 20000F (30jrs)' },
      ],
    },
  },
  {
    id: 'zamani',
    name: 'Zamani Telecom',
    shortCode: 'Z',
    shortLabel: 'Zamani',
    tagline: 'Forfaits Jour, Semaine, Mois & Crédit Chap Chap',
    accentHex: '#DB2777',
    bundles: {
      Jour: [
        { id: 'zamani-j-600', period: 'Jour', volume: '600Mo', price: 500, validityLabel: '1jr', label: '600Mo - 500F (1jr)' },
      ],
      Semaine: [
        { id: 'zamani-s-500', period: 'Semaine', volume: '500Mo', price: 500, validityLabel: '7jrs', label: '500Mo - 500F (7jrs)' },
        { id: 'zamani-s-1g', period: 'Semaine', volume: '1Go', price: 1000, validityLabel: '7jrs', label: '1Go - 1000F (7jrs)' },
        { id: 'zamani-s-3g', period: 'Semaine', volume: '3Go', price: 2000, validityLabel: '7jrs', label: '3Go - 2000F (7jrs)' },
        { id: 'zamani-s-5g', period: 'Semaine', volume: '5Go', price: 3000, validityLabel: '7jrs', label: '5Go - 3000F (7jrs)' },
      ],
      Mois: [
        { id: 'zamani-m-2g', period: 'Mois', volume: '2Go', price: 2000, validityLabel: '30jrs', label: '2Go - 2000F (30jrs)' },
        { id: 'zamani-m-6g', period: 'Mois', volume: '6Go', price: 5000, validityLabel: '30jrs', label: '6Go - 5000F (30jrs)' },
        { id: 'zamani-m-16g', period: 'Mois', volume: '16Go', price: 10000, validityLabel: '30jrs', label: '16Go - 10000F (30jrs)' },
        { id: 'zamani-m-40g', period: 'Mois', volume: '40Go', price: 20000, validityLabel: '30jrs', label: '40Go - 20000F (30jrs)' },
        { id: 'zamani-m-60g', period: 'Mois', volume: '60Go', price: 50000, validityLabel: '30jrs', label: '60Go - 50000F (30jrs)' },
      ],
    },
  },
  {
    id: 'moov',
    name: 'Moov Africa',
    shortCode: 'M',
    shortLabel: 'Moov',
    tagline: 'Forfaits Jour, Semaine, Mois & Crédit Chap Chap',
    accentHex: '#005BAC',
    bundles: {
      Jour: [
        { id: 'moov-j-35', period: 'Jour', volume: '35Mo', price: 100, validityLabel: '1jr', label: '35Mo - 100F (1jr)' },
        { id: 'moov-j-55', period: 'Jour', volume: '55Mo', price: 150, validityLabel: '1jr', label: '55Mo - 150F (1jr)' },
        { id: 'moov-j-110', period: 'Jour', volume: '110Mo', price: 200, validityLabel: '1jr', label: '110Mo - 200F (1jr)' },
        { id: 'moov-j-180', period: 'Jour', volume: '180Mo', price: 300, validityLabel: '1jr', label: '180Mo - 300F (1jr)' },
        { id: 'moov-j-950', period: 'Jour', volume: '950Mo', price: 500, validityLabel: '1jr', label: '950Mo - 500F (1jr)' },
      ],
      Semaine: [
        { id: 'moov-s-700', period: 'Semaine', volume: '700Mo', price: 500, validityLabel: '7jrs', label: '700Mo - 500F (7jrs)' },
        { id: 'moov-s-15g', period: 'Semaine', volume: '1,5Go', price: 1000, validityLabel: '7jrs', label: '1,5Go - 1000F (7jrs)' },
        { id: 'moov-s-4g', period: 'Semaine', volume: '4Go', price: 2000, validityLabel: '7jrs', label: '4Go - 2000F (7jrs)' },
        { id: 'moov-s-7g', period: 'Semaine', volume: '7Go', price: 3000, validityLabel: '7jrs', label: '7Go - 3000F (7jrs)' },
      ],
      Mois: [
        { id: 'moov-m-3g', period: 'Mois', volume: '3Go', price: 2000, validityLabel: '30jrs', label: '3Go - 2000F (30jrs)' },
        { id: 'moov-m-8g', period: 'Mois', volume: '8Go', price: 5000, validityLabel: '30jrs', label: '8Go - 5000F (30jrs)' },
        { id: 'moov-m-22g', period: 'Mois', volume: '22Go', price: 10000, validityLabel: '30jrs', label: '22Go - 10000F (30jrs)' },
        { id: 'moov-m-55g', period: 'Mois', volume: '55Go', price: 20000, validityLabel: '30jrs', label: '55Go - 20000F (30jrs)' },
      ],
    },
  },
  {
    id: 'niger_telecom',
    name: 'Niger Telecom',
    shortCode: 'NT',
    shortLabel: 'Niger',
    tagline: 'Forfaits Jour, Semaine, Mois & Crédit Chap Chap',
    accentHex: '#16A34A',
    bundles: {
      Jour: [
        { id: 'nt-j-40', period: 'Jour', volume: '40Mo', price: 100, validityLabel: '1jr', label: '40Mo - 100F (1jr)' },
        { id: 'nt-j-100', period: 'Jour', volume: '100Mo', price: 200, validityLabel: '1jr', label: '100Mo - 200F (1jr)' },
        { id: 'nt-j-500', period: 'Jour', volume: '500Mo', price: 500, validityLabel: '1jr', label: '500Mo - 500F (1jr)' },
      ],
      Semaine: [
        { id: 'nt-s-300', period: 'Semaine', volume: '300Mo', price: 500, validityLabel: '7jrs', label: '300Mo - 500F (7jrs)' },
        { id: 'nt-s-1g', period: 'Semaine', volume: '1Go', price: 1000, validityLabel: '7jrs', label: '1Go - 1000F (7jrs)' },
        { id: 'nt-s-25g', period: 'Semaine', volume: '2,5Go', price: 2000, validityLabel: '7jrs', label: '2,5Go - 2000F (7jrs)' },
      ],
      Mois: [
        { id: 'nt-m-2g', period: 'Mois', volume: '2Go', price: 2000, validityLabel: '30jrs', label: '2Go - 2000F (30jrs)' },
        { id: 'nt-m-5g', period: 'Mois', volume: '5Go', price: 5000, validityLabel: '30jrs', label: '5Go - 5000F (30jrs)' },
        { id: 'nt-m-10g', period: 'Mois', volume: '10Go', price: 10000, validityLabel: '30jrs', label: '10Go - 10000F (30jrs)' },
        { id: 'nt-m-20g', period: 'Mois', volume: '20Go', price: 20000, validityLabel: '30jrs', label: '20Go - 20000F (30jrs)' },
      ],
    },
  },
];

export function getOperatorCatalog(id?: OperatorId): OperatorCatalog {
  return OPERATOR_CATALOGS.find((op) => op.id === id) ?? OPERATOR_CATALOGS[0];
}

// Inline SVG receipt preview so seeded sample transactions render clean proof thumbnails
function makeSampleReceiptSvg(refCode: string, amount: string, phone: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="220" viewBox="0 0 360 220">
    <rect width="360" height="220" rx="16" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>
    <rect x="0" y="0" width="360" height="48" rx="16" fill="#1D4ED8"/>
    <text x="20" y="30" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="bold">Confirmation Transfert Mobile Money</text>
    <text x="20" y="82" fill="#334155" font-family="sans-serif" font-size="13">Réf : ${refCode}</text>
    <text x="20" y="108" fill="#0F172A" font-family="sans-serif" font-size="20" font-weight="bold">Montant : ${amount}</text>
    <text x="20" y="138" fill="#334155" font-family="sans-serif" font-size="13">Vers : +227 96 35 05 59</text>
    <text x="20" y="164" fill="#334155" font-family="sans-serif" font-size="13">Bénéficiaire : ${phone}</text>
    <text x="20" y="194" fill="#16A34A" font-family="sans-serif" font-size="12" font-weight="bold">Transfert effectué avec succès</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-demo-1',
    name: 'Ibrahim Moussa',
    email: 'ibrahim@niger.ne',
    phone: '+227 96 42 18 75',
    password: '123456',
    solde: 0,
    avatarUrl: '/src/assets/images/user_avatar_1794508186869.jpg',
    referralCode: 'SAURI-IBR227',
    referralCount: 0,
  },
  {
    id: 'user-demo-2',
    name: 'Aminata Diallo',
    email: 'aminata@niger.ne',
    phone: '+227 90 15 44 21',
    password: '123456',
    solde: 0,
    avatarUrl: '/src/assets/images/user_avatar_1794508186869.jpg',
    referralCode: 'SAURI-AMI315',
    referralCount: 0,
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TX-2026-9104',
    date: '2026-11-12T12:10:00',
    userId: 'user-demo-1',
    userName: 'Ibrahim Moussa',
    userEmail: 'ibrahim@niger.ne',
    kind: 'forfait',
    operatorId: 'airtel',
    operatorName: 'Airtel',
    phoneNumber: '+227 96 42 18 75',
    bundleLabel: '3Go - 2000F (7jrs)',
    amountSent: 2000,
    amountCredited: 1920,
    profitFee: 80,
    status: 'En attente',
    screenshotUrl: makeSampleReceiptSvg('MM-847291', '2 000 F', '+227 96 42 18 75'),
    screenshotName: 'capture_airtel_money.png',
  },
  {
    id: 'TX-2026-9088',
    date: '2026-11-11T17:25:00',
    userId: 'user-demo-1',
    userName: 'Ibrahim Moussa',
    userEmail: 'ibrahim@niger.ne',
    kind: 'credit',
    operatorId: 'moov',
    operatorName: 'Moov Africa',
    phoneNumber: '+227 94 18 55 02',
    amountSent: 5000,
    amountCredited: 4800,
    profitFee: 200,
    status: 'Validé',
    screenshotUrl: makeSampleReceiptSvg('FL-731902', '5 000 F', '+227 94 18 55 02'),
    screenshotName: 'recu_moov_flooz.jpg',
  },
  {
    id: 'TX-2026-9041',
    date: '2026-11-10T10:15:00',
    userId: 'user-demo-1',
    userName: 'Ibrahim Moussa',
    userEmail: 'ibrahim@niger.ne',
    kind: 'forfait',
    operatorId: 'zamani',
    operatorName: 'Zamani Telecom',
    phoneNumber: '+227 90 77 31 49',
    bundleLabel: '600Mo - 500F (1jr)',
    amountSent: 500,
    amountCredited: 480,
    profitFee: 20,
    status: 'Rejeté',
    screenshotUrl: makeSampleReceiptSvg('ZM-502819', '500 F', '+227 90 77 31 49'),
    screenshotName: 'sms_capture.jpg',
  },
];

export function formatFCFA(amount: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(amount)} F`;
}

export function formatAmount(amount: number, currency: 'FCFA' | 'NGN' = 'FCFA'): string {
  if (currency === 'NGN') {
    return `₦${new Intl.NumberFormat('en-NG').format(amount)}`;
  }
  return formatFCFA(amount);
}

export function formatNigerDigits(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  return digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
}

export function formatDateFr(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  const datePart = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
  const timePart = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
  return `${datePart} · ${timePart}`;
}
