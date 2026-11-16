export type CountryMode = 'NE' | 'NG';

export type CurrencyCode = 'FCFA' | 'NGN';

export type OperatorId =
  | 'airtel'
  | 'zamani'
  | 'moov'
  | 'niger_telecom'
  | 'mtn_ng'
  | 'glo_ng'
  | 'airtel_ng'
  | '9mobile_ng';

export type BundlePeriod = 'Jour' | 'Semaine' | 'Mois';

export type PurchaseKind =
  | 'forfait'
  | 'credit'
  | 'recharge'
  | 'airtime'
  | 'data'
  | 'pin';

export type TransactionStatus = 'En attente' | 'Validé' | 'Rejeté';

export type NavTab =
  | 'accueil'
  | 'credit'
  | 'mega'
  | 'recu'
  | 'historique'
  | 'profil'
  | 'admin';

export type LanguageCode = 'fr' | 'en' | 'ar' | 'dje' | 'taq' | 'ff' | 'ha';

export interface DataBundle {
  id: string;
  period: BundlePeriod;
  volume: string;
  price: number;
  validityLabel: string;
  label: string;
}

export interface OperatorCatalog {
  id: OperatorId;
  name: string;
  shortCode: 'A' | 'Z' | 'M' | 'NT';
  shortLabel: string;
  tagline: string;
  accentHex: string;
  bundles: {
    Jour: DataBundle[];
    Semaine: DataBundle[];
    Mois: DataBundle[];
  };
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  solde: number;
  soldeNGN?: number;
  avatarUrl: string;
  referralCode?: string;
  referredBy?: string;
  referralCount?: number;
}

export interface Transaction {
  id: string;
  date: string;
  userId: string;
  userName: string;
  userEmail: string;
  kind: PurchaseKind;
  country?: CountryMode;
  currency?: CurrencyCode;
  operatorId?: OperatorId;
  operatorName: string;
  phoneNumber: string;
  bundleLabel?: string;
  rechargePin?: string;
  isGift?: boolean;
  amountSent: number;
  amountCredited: number;
  profitFee: number;
  status: TransactionStatus;
  screenshotUrl?: string;
  screenshotName?: string;
}

export interface PendingCheckout {
  kind: PurchaseKind;
  country?: CountryMode;
  currency?: CurrencyCode;
  operatorId?: OperatorId;
  operatorName: string;
  phoneNumber: string;
  bundleLabel?: string;
  rechargePin?: string;
  isGift?: boolean;
  amountSent: number;
}
