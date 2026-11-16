import React, { useState } from 'react';
import {
  CreditCard,
  Eye,
  EyeOff,
  Phone,
  Smartphone,
  Wifi,
  Zap,
} from 'lucide-react';
import {
  MIN_NAIRA_AIRTIME,
  NIGERIA_OPERATORS,
  NIGERIA_PIN_DENOMINATIONS,
  formatNaira,
  formatNigeriaDigits,
  generateRechargePin,
  getNigeriaOperator,
} from '../data/nigeria';
import { TranslationStrings } from '../data/translations';
import { OperatorId, PendingCheckout, UserAccount } from '../types';
import { OperatorLogo } from './BrandLogos';

export type NigeriaServiceTab = 'airtime' | 'data' | 'pin';

interface NigeriaPageProps {
  user: UserAccount;
  t: TranslationStrings;
  activeService: NigeriaServiceTab;
  onChangeService: (service: NigeriaServiceTab) => void;
  onProceedToPayment: (checkout: PendingCheckout) => void;
}

export const NigeriaPage: React.FC<NigeriaPageProps> = ({
  user,
  t,
  activeService,
  onChangeService,
  onProceedToPayment,
}) => {
  const [showBalance, setShowBalance] = useState(false);
  const [operatorId, setOperatorId] = useState<
    Extract<OperatorId, 'mtn_ng' | 'glo_ng' | 'airtel_ng' | '9mobile_ng'>
  >('mtn_ng');

  const selectedOp = getNigeriaOperator(operatorId);

  // Airtime state
  const [airtimePhoneDigits, setAirtimePhoneDigits] = useState(() =>
    user.phone.startsWith('+234')
      ? formatNigeriaDigits(user.phone.replace('+234', ''))
      : ''
  );
  const [airtimeAmount, setAirtimeAmount] = useState('500');
  const [airtimeError, setAirtimeError] = useState('');

  // Data state
  const [selectedBundleId, setSelectedBundleId] = useState<string>(
    () => selectedOp.bundles[1]?.id ?? selectedOp.bundles[0].id
  );
  const [dataPhoneDigits, setDataPhoneDigits] = useState(() =>
    user.phone.startsWith('+234')
      ? formatNigeriaDigits(user.phone.replace('+234', ''))
      : ''
  );
  const [dataError, setDataError] = useState('');

  // Carte Recharge PIN state
  const [pinAmount, setPinAmount] = useState<number>(100);
  const [pinPhoneDigits, setPinPhoneDigits] = useState(() =>
    user.phone.startsWith('+234')
      ? formatNigeriaDigits(user.phone.replace('+234', ''))
      : ''
  );
  const [pinError, setPinError] = useState('');

  const nairaBalance = user.soldeNGN ?? 0;
  const formattedBalance = formatNaira(nairaBalance);

  const activeBundle =
    selectedOp.bundles.find((b) => b.id === selectedBundleId) ??
    selectedOp.bundles[0];

  const handleSelectOperator = (
    nextId: Extract<OperatorId, 'mtn_ng' | 'glo_ng' | 'airtel_ng' | '9mobile_ng'>
  ) => {
    setOperatorId(nextId);
    const nextOp = getNigeriaOperator(nextId);
    setSelectedBundleId(nextOp.bundles[1]?.id ?? nextOp.bundles[0].id);
    setAirtimeError('');
    setDataError('');
    setPinError('');
  };

  const handleBuyAirtime = (e: React.FormEvent) => {
    e.preventDefault();
    setAirtimeError('');
    const digits = airtimePhoneDigits.replace(/\D/g, '');
    const numericAmount = Number(airtimeAmount.replace(/\D/g, '')) || 0;

    if (digits.length !== 10) {
      setAirtimeError(
        'Veuillez saisir un numéro nigérian valide à 10 chiffres après +234.'
      );
      return;
    }
    if (numericAmount < MIN_NAIRA_AIRTIME) {
      setAirtimeError(`Le montant minimum est de ${formatNaira(MIN_NAIRA_AIRTIME)}.`);
      return;
    }

    onProceedToPayment({
      kind: 'airtime',
      country: 'NG',
      currency: 'NGN',
      operatorId: selectedOp.id,
      operatorName: selectedOp.name,
      phoneNumber: `+234 ${formatNigeriaDigits(digits)}`,
      bundleLabel: `Airtime ${formatNaira(numericAmount)}`,
      amountSent: numericAmount,
    });
  };

  const handleBuyData = (e: React.FormEvent) => {
    e.preventDefault();
    setDataError('');
    const digits = dataPhoneDigits.replace(/\D/g, '');

    if (digits.length !== 10) {
      setDataError(
        'Veuillez saisir un numéro nigérian valide à 10 chiffres après +234.'
      );
      return;
    }

    onProceedToPayment({
      kind: 'data',
      country: 'NG',
      currency: 'NGN',
      operatorId: selectedOp.id,
      operatorName: selectedOp.name,
      phoneNumber: `+234 ${formatNigeriaDigits(digits)}`,
      bundleLabel: activeBundle.label,
      amountSent: activeBundle.price,
    });
  };

  const handleBuyPin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    const digits = pinPhoneDigits.replace(/\D/g, '');
    if (digits.length !== 10) {
      setPinError(
        'Veuillez saisir un numéro nigérian valide à 10 chiffres après +234.'
      );
      return;
    }

    const generatedPin = generateRechargePin();

    onProceedToPayment({
      kind: 'pin',
      country: 'NG',
      currency: 'NGN',
      operatorId: selectedOp.id,
      operatorName: selectedOp.name,
      phoneNumber: `+234 ${formatNigeriaDigits(digits)}`,
      bundleLabel: `Carte Recharge ${formatNaira(pinAmount)}`,
      rechargePin: generatedPin,
      amountSent: pinAmount,
    });
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Blue Balance Card (Niger exact colors & design) */}
      <section
        aria-label="Naira Balance"
        className="rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white p-5 sm:p-7 shadow-sm space-y-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs sm:text-sm font-medium text-blue-100">
              {t.bonjour} {user.name} · 🇳🇬 Nigeria
            </p>
            <p className="mt-2 text-sm font-semibold text-blue-100 flex items-center gap-2">
              <span>{t.soldeDisponible} (Naira)</span>
            </p>
            <div className="mt-1 flex items-center gap-3">
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight tabular-nums">
                {showBalance ? formattedBalance : '₦•••••'}
              </h1>
              <button
                type="button"
                onClick={() => setShowBalance((prev) => !prev)}
                className="min-w-[44px] min-h-[44px] rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label={showBalance ? 'Masquer le solde' : 'Afficher le solde'}
              >
                {showBalance ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <span className="text-xs font-semibold text-blue-200 hidden sm:inline tabular-nums">
            {formattedBalance}
          </span>
        </div>

        {/* Bottom Yellow Quick Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() =>
              onProceedToPayment({
                kind: 'recharge',
                country: 'NG',
                currency: 'NGN',
                operatorName: 'Wallet Nigeria (₦)',
                phoneNumber: user.phone,
                amountSent: 5000,
              })
            }
            className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-slate-950 font-display font-extrabold text-sm sm:text-base shadow-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Zap className="w-4 h-4 stroke-[2.5]" />
            <span>+₦5,000</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeService('data')}
            className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-slate-950 font-display font-extrabold text-sm sm:text-base shadow-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Wifi className="w-4 h-4 stroke-[2.5]" />
            <span>+Data</span>
          </button>
        </div>
      </section>

      {/* 3 Nigeria Services: Acheter Airtime, Acheter Data, Carte Recharge */}
      <section aria-label="Services Nigeria" className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => onChangeService('airtime')}
          className={`rounded-3xl p-4 sm:p-5 shadow-xs transition-all text-left flex flex-row sm:flex-col items-center sm:items-start justify-between gap-3.5 min-h-[92px] sm:min-h-[126px] cursor-pointer ${
            activeService === 'airtime'
              ? 'bg-orange-500 text-white ring-2 ring-orange-600 ring-offset-1'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 sm:flex-none">
            <span className="block font-display font-extrabold text-base sm:text-lg leading-tight">
              Acheter Airtime
            </span>
            <span className="block text-xs text-orange-50 mt-0.5 font-medium">
              +234 · ₦100 à ₦50,000
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChangeService('data')}
          className={`rounded-3xl p-4 sm:p-5 shadow-xs transition-all text-left flex flex-row sm:flex-col items-center sm:items-start justify-between gap-3.5 min-h-[92px] sm:min-h-[126px] border cursor-pointer ${
            activeService === 'data'
              ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20'
              : 'bg-white hover:bg-slate-50 border-slate-200'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
            <Wifi className="w-6 h-6" />
          </div>
          <div className="flex-1 sm:flex-none">
            <span className="block font-display font-extrabold text-base sm:text-lg leading-tight text-slate-900">
              Acheter Data
            </span>
            <span className="block text-xs text-slate-500 mt-0.5 font-medium">
              500MB à 10GB · Naira
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChangeService('pin')}
          className={`rounded-3xl p-4 sm:p-5 shadow-xs transition-all text-left flex flex-row sm:flex-col items-center sm:items-start justify-between gap-3.5 min-h-[92px] sm:min-h-[126px] border cursor-pointer ${
            activeService === 'pin'
              ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20'
              : 'bg-white hover:bg-slate-50 border-slate-200'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
            <CreditCard className="w-6 h-6" />
          </div>
          <div className="flex-1 sm:flex-none">
            <span className="block font-display font-extrabold text-base sm:text-lg leading-tight text-slate-900">
              Carte Recharge
            </span>
            <span className="block text-xs text-slate-500 mt-0.5 font-medium">
              PIN ₦100, ₦200, ₦500, ₦1,000
            </span>
          </div>
        </button>
      </section>

      {/* Single Row Operators: MTN, Glo, Airtel, 9mobile */}
      <section aria-labelledby="ng-operators-title" className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2
            id="ng-operators-title"
            className="font-display font-extrabold text-base sm:text-lg text-slate-900"
          >
            {t.operateurs} Nigeria
          </h2>
          <span className="text-xs text-slate-500">
            MTN · Glo · Airtel · 9mobile
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {NIGERIA_OPERATORS.map((op) => {
            const active = op.id === operatorId;
            return (
              <button
                key={op.id}
                type="button"
                onClick={() => handleSelectOperator(op.id)}
                className={`rounded-2xl border-2 p-2.5 sm:p-4 shadow-xs transition-all flex flex-col items-center text-center gap-2 min-h-[100px] justify-center cursor-pointer ${
                  active
                    ? 'border-blue-600 bg-blue-50/70'
                    : 'border-slate-200 bg-white hover:border-blue-400'
                }`}
              >
                <OperatorLogo operatorId={op.id} size="sm" />
                <span className="block font-display font-extrabold text-xs sm:text-sm text-slate-900 truncate w-full">
                  {op.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Service Form */}
      {activeService === 'airtime' && (
        <form
          onSubmit={handleBuyAirtime}
          className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5"
        >
          <div className="flex items-center gap-3">
            <OperatorLogo operatorId={selectedOp.id} size="sm" />
            <div>
              <h2 className="font-display font-extrabold text-lg sm:text-xl text-slate-900">
                Acheter Airtime · {selectedOp.shortLabel}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Numéro +234 et montant en Naira (₦)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="ng-airtime-phone"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Numéro de téléphone (+234)
              </label>
              <div className="flex items-stretch rounded-2xl border border-slate-300 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 overflow-hidden bg-white">
                <span className="px-3.5 bg-slate-50 border-r border-slate-200 flex items-center gap-1.5 font-mono font-semibold text-sm text-slate-900">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  +234
                </span>
                <input
                  id="ng-airtime-phone"
                  type="tel"
                  inputMode="numeric"
                  value={airtimePhoneDigits}
                  onChange={(e) => {
                    setAirtimePhoneDigits(formatNigeriaDigits(e.target.value));
                    setAirtimeError('');
                  }}
                  placeholder="803 123 4567"
                  className="w-full px-3.5 py-3 font-mono font-semibold text-base text-slate-900 focus:outline-none tabular-nums"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="ng-airtime-amount"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Montant en Naira (₦)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-bold text-base text-slate-600">
                  ₦
                </span>
                <input
                  id="ng-airtime-amount"
                  type="number"
                  min={MIN_NAIRA_AIRTIME}
                  inputMode="numeric"
                  value={airtimeAmount}
                  onChange={(e) => {
                    setAirtimeAmount(e.target.value);
                    setAirtimeError('');
                  }}
                  placeholder="500"
                  className="w-full rounded-2xl border border-slate-300 pl-9 pr-14 py-3 font-mono font-semibold text-base text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 tabular-nums"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  NGN
                </span>
              </div>
            </div>
          </div>

          {airtimeError && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm font-medium text-red-700"
            >
              {airtimeError}
            </div>
          )}

          <button
            type="submit"
            className="w-full min-h-[52px] rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-display font-extrabold text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Smartphone className="w-5 h-5" />
            <span>Acheter Airtime</span>
          </button>
        </form>
      )}

      {activeService === 'data' && (
        <form
          onSubmit={handleBuyData}
          className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <OperatorLogo operatorId={selectedOp.id} size="sm" />
              <div>
                <h2 className="font-display font-extrabold text-lg sm:text-xl text-slate-900">
                  Acheter Data · {selectedOp.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Forfaits 500MB, 1GB, 2GB, 5GB, 10GB en Naira
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {selectedOp.bundles.map((bundle) => {
              const checked = activeBundle.id === bundle.id;
              return (
                <label
                  key={bundle.id}
                  className={`rounded-2xl border-2 p-3.5 flex items-center gap-3 cursor-pointer transition-all min-h-[60px] ${
                    checked
                      ? 'border-blue-600 bg-blue-50/50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="ng-data-bundle"
                    value={bundle.id}
                    checked={checked}
                    onChange={() => setSelectedBundleId(bundle.id)}
                    className="w-4 h-4 accent-blue-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                    <span className="font-display font-bold text-sm text-slate-900">
                      {bundle.volume}{' '}
                      <span className="text-xs font-medium text-slate-500">
                        ({bundle.validityLabel})
                      </span>
                    </span>
                    <span className="font-display font-extrabold text-sm text-blue-700 tabular-nums shrink-0">
                      {formatNaira(bundle.price)}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>

          <div>
            <label
              htmlFor="ng-data-phone"
              className="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Numéro du bénéficiaire (+234)
            </label>
            <div className="flex items-stretch rounded-2xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20 overflow-hidden bg-white">
              <span className="px-3.5 bg-slate-50 border-r border-slate-200 flex items-center gap-1.5 font-mono font-semibold text-sm text-slate-900">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                +234
              </span>
              <input
                id="ng-data-phone"
                type="tel"
                inputMode="numeric"
                value={dataPhoneDigits}
                onChange={(e) => {
                  setDataPhoneDigits(formatNigeriaDigits(e.target.value));
                  setDataError('');
                }}
                placeholder="803 123 4567"
                className="w-full px-3.5 py-3 font-mono font-semibold text-base text-slate-900 focus:outline-none tabular-nums"
              />
            </div>
          </div>

          {dataError && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm font-medium text-red-700"
            >
              {dataError}
            </div>
          )}

          <button
            type="submit"
            className="w-full min-h-[52px] rounded-2xl bg-blue-700 hover:bg-blue-800 active:scale-[0.99] text-white font-display font-extrabold text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Wifi className="w-5 h-5" />
            <span>Acheter Data · {formatNaira(activeBundle.price)}</span>
          </button>
        </form>
      )}

      {activeService === 'pin' && (
        <form
          onSubmit={handleBuyPin}
          className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5"
        >
          <div className="flex items-center gap-3">
            <OperatorLogo operatorId={selectedOp.id} size="sm" />
            <div>
              <h2 className="font-display font-extrabold text-lg sm:text-xl text-slate-900">
                Carte Recharge PIN · {selectedOp.shortLabel}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Cartes PIN 100, 200, 500, 1000 Naira
              </p>
            </div>
          </div>

          <div>
            <span className="block text-sm font-semibold text-slate-700 mb-2">
              Choisissez le montant de la carte PIN
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {NIGERIA_PIN_DENOMINATIONS.map((denom) => {
                const active = pinAmount === denom;
                return (
                  <button
                    key={denom}
                    type="button"
                    onClick={() => setPinAmount(denom)}
                    className={`min-h-[58px] rounded-2xl border-2 px-4 py-3 font-display font-extrabold text-base transition-all cursor-pointer tabular-nums ${
                      active
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    {formatNaira(denom)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="ng-pin-phone"
              className="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Numéro de réception du PIN (+234)
            </label>
            <div className="flex items-stretch rounded-2xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20 overflow-hidden bg-white">
              <span className="px-3.5 bg-slate-50 border-r border-slate-200 flex items-center gap-1.5 font-mono font-semibold text-sm text-slate-900">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                +234
              </span>
              <input
                id="ng-pin-phone"
                type="tel"
                inputMode="numeric"
                value={pinPhoneDigits}
                onChange={(e) => {
                  setPinPhoneDigits(formatNigeriaDigits(e.target.value));
                  setPinError('');
                }}
                placeholder="803 123 4567"
                className="w-full px-3.5 py-3 font-mono font-semibold text-base text-slate-900 focus:outline-none tabular-nums"
              />
            </div>
          </div>

          {pinError && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm font-medium text-red-700"
            >
              {pinError}
            </div>
          )}

          <button
            type="submit"
            className="w-full min-h-[52px] rounded-2xl bg-blue-700 hover:bg-blue-800 active:scale-[0.99] text-white font-display font-extrabold text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <CreditCard className="w-5 h-5" />
            <span>Acheter Carte Recharge · {formatNaira(pinAmount)}</span>
          </button>
        </form>
      )}
    </div>
  );
};
