import { OperatorId } from '../types';

export interface NigeriaDataBundle {
  id: string;
  volume: '500MB' | '1GB' | '2GB' | '5GB' | '10GB';
  price: number;
  validityLabel: string;
  label: string;
}

export interface NigeriaOperatorCatalog {
  id: Extract<OperatorId, 'mtn_ng' | 'glo_ng' | 'airtel_ng' | '9mobile_ng'>;
  name: string;
  shortLabel: string;
  shortCode: string;
  accentHex: string;
  bundles: NigeriaDataBundle[];
}

export const NIGERIA_PIN_DENOMINATIONS = [100, 200, 500, 1000] as const;
export const MIN_NAIRA_AIRTIME = 100;

export const NIGERIA_OPERATORS: NigeriaOperatorCatalog[] = [
  {
    id: 'mtn_ng',
    name: 'MTN Nigeria',
    shortLabel: 'MTN',
    shortCode: 'MTN',
    accentHex: '#FACC15',
    bundles: [
      { id: 'mtn-500mb', volume: '500MB', price: 300, validityLabel: '7 days', label: '500MB - ₦300 (7 days)' },
      { id: 'mtn-1gb', volume: '1GB', price: 500, validityLabel: '30 days', label: '1GB - ₦500 (30 days)' },
      { id: 'mtn-2gb', volume: '2GB', price: 1000, validityLabel: '30 days', label: '2GB - ₦1,000 (30 days)' },
      { id: 'mtn-5gb', volume: '5GB', price: 2200, validityLabel: '30 days', label: '5GB - ₦2,200 (30 days)' },
      { id: 'mtn-10gb', volume: '10GB', price: 4000, validityLabel: '30 days', label: '10GB - ₦4,000 (30 days)' },
    ],
  },
  {
    id: 'glo_ng',
    name: 'Glo Nigeria',
    shortLabel: 'Glo',
    shortCode: 'Glo',
    accentHex: '#16A34A',
    bundles: [
      { id: 'glo-500mb', volume: '500MB', price: 250, validityLabel: '7 days', label: '500MB - ₦250 (7 days)' },
      { id: 'glo-1gb', volume: '1GB', price: 450, validityLabel: '30 days', label: '1GB - ₦450 (30 days)' },
      { id: 'glo-2gb', volume: '2GB', price: 900, validityLabel: '30 days', label: '2GB - ₦900 (30 days)' },
      { id: 'glo-5gb', volume: '5GB', price: 2000, validityLabel: '30 days', label: '5GB - ₦2,000 (30 days)' },
      { id: 'glo-10gb', volume: '10GB', price: 3600, validityLabel: '30 days', label: '10GB - ₦3,600 (30 days)' },
    ],
  },
  {
    id: 'airtel_ng',
    name: 'Airtel Nigeria',
    shortLabel: 'Airtel',
    shortCode: 'Airtel',
    accentHex: '#E40000',
    bundles: [
      { id: 'airtelng-500mb', volume: '500MB', price: 300, validityLabel: '7 days', label: '500MB - ₦300 (7 days)' },
      { id: 'airtelng-1gb', volume: '1GB', price: 500, validityLabel: '30 days', label: '1GB - ₦500 (30 days)' },
      { id: 'airtelng-2gb', volume: '2GB', price: 1000, validityLabel: '30 days', label: '2GB - ₦1,000 (30 days)' },
      { id: 'airtelng-5gb', volume: '5GB', price: 2300, validityLabel: '30 days', label: '5GB - ₦2,300 (30 days)' },
      { id: 'airtelng-10gb', volume: '10GB', price: 4200, validityLabel: '30 days', label: '10GB - ₦4,200 (30 days)' },
    ],
  },
  {
    id: '9mobile_ng',
    name: '9mobile',
    shortLabel: '9mobile',
    shortCode: '9mob',
    accentHex: '#15803D',
    bundles: [
      { id: '9mob-500mb', volume: '500MB', price: 250, validityLabel: '7 days', label: '500MB - ₦250 (7 days)' },
      { id: '9mob-1gb', volume: '1GB', price: 480, validityLabel: '30 days', label: '1GB - ₦480 (30 days)' },
      { id: '9mob-2gb', volume: '2GB', price: 950, validityLabel: '30 days', label: '2GB - ₦950 (30 days)' },
      { id: '9mob-5gb', volume: '5GB', price: 2100, validityLabel: '30 days', label: '5GB - ₦2,100 (30 days)' },
      { id: '9mob-10gb', volume: '10GB', price: 3800, validityLabel: '30 days', label: '10GB - ₦3,800 (30 days)' },
    ],
  },
];

export function getNigeriaOperator(id?: OperatorId): NigeriaOperatorCatalog {
  return NIGERIA_OPERATORS.find((op) => op.id === id) ?? NIGERIA_OPERATORS[0];
}

export function formatNaira(amount: number): string {
  return `₦${new Intl.NumberFormat('en-NG').format(amount)}`;
}

export function formatNigeriaDigits(raw: string): string {
  const digits = raw.replace(/\D/g, '').replace(/^0+/, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

export function generateRechargePin(): string {
  const part = () => String(Math.floor(1000 + Math.random() * 9000));
  return `${part()}-${part()}-${part()}-${part()}`;
}
