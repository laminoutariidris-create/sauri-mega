import React, { useState } from 'react';
import { ArrowLeft, Gift, Phone, Smartphone, Wifi } from 'lucide-react';
import {
  MIN_CREDIT_AMOUNT,
  formatFCFA,
  formatNigerDigits,
  getOperatorCatalog,
} from '../data/operators';
import { BundlePeriod, DataBundle, OperatorId, PendingCheckout } from '../types';
import { OperatorLogo } from './BrandLogos';

interface OperatorPageProps {
  operatorId: OperatorId;
  userPhone: string;
  hideBackButton?: boolean;
  onBack: () => void;
  onOpenGiftMega?: (operatorId: OperatorId) => void;
  onProceedToPayment: (checkout: PendingCheckout) => void;
}

const PERIODS: BundlePeriod[] = ['Jour', 'Semaine', 'Mois'];

export const OperatorPage: React.FC<OperatorPageProps> = ({
  operatorId,
  userPhone,
  hideBackButton = false,
  onBack,
  onOpenGiftMega,
  onProceedToPayment,
}) => {
  const catalog = getOperatorCatalog(operatorId);

  const firstBundle = catalog.bundles.Jour[0] ?? catalog.bundles.Semaine[0];
  const [selectedBundleId, setSelectedBundleId] = useState<string>(firstBundle.id);
  const [bundlePhoneDigits, setBundlePhoneDigits] = useState<string>(() =>
    formatNigerDigits(userPhone.replace('+227', ''))
  );
  const [bundleError, setBundleError] = useState<string>('');

  // Credit Chap Chap state
  const [creditPhoneDigits, setCreditPhoneDigits] = useState<string>(() =>
    formatNigerDigits(userPhone.replace('+227', ''))
  );
  const [creditAmount, setCreditAmount] = useState<string>('500');
  const [creditError, setCreditError] = useState<string>('');

  const allBundles: DataBundle[] = [
    ...catalog.bundles.Jour,
    ...catalog.bundles.Semaine,
    ...catalog.bundles.Mois,
  ];
  const selectedBundle =
    allBundles.find((b) => b.id === selectedBundleId) ?? firstBundle;

  const handleBuyBundle = (e: React.FormEvent) => {
    e.preventDefault();
    setBundleError('');

    const rawDigits = bundlePhoneDigits.replace(/\D/g, '');
    if (rawDigits.length !== 8) {
      setBundleError('Veuillez saisir un numéro nigérien valide à 8 chiffres après +227.');
      return;
    }

    onProceedToPayment({
      kind: 'forfait',
      operatorId: catalog.id,
      operatorName: catalog.name,
      phoneNumber: `+227 ${formatNigerDigits(rawDigits)}`,
      bundleLabel: selectedBundle.label,
      amountSent: selectedBundle.price,
    });
  };

  const handleBuyCredit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreditError('');

    const rawDigits = creditPhoneDigits.replace(/\D/g, '');
    const numericAmount = Number(creditAmount.replace(/\D/g, '')) || 0;

    if (rawDigits.length !== 8) {
      setCreditError('Veuillez saisir un numéro nigérien valide à 8 chiffres après +227.');
      return;
    }

    if (numericAmount < MIN_CREDIT_AMOUNT) {
      setCreditError(`Le montant minimum est de ${MIN_CREDIT_AMOUNT} F.`);
      return;
    }

    onProceedToPayment({
      kind: 'credit',
      operatorId: catalog.id,
      operatorName: catalog.name,
      phoneNumber: `+227 ${formatNigerDigits(rawDigits)}`,
      amountSent: numericAmount,
    });
  };

  return (
    <div className="space-y-6">
      {/* Operator Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3.5">
          {!hideBackButton && (
            <button
              type="button"
              onClick={onBack}
              className="min-w-[44px] min-h-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer"
              aria-label="Retour à l'accueil"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <OperatorLogo operatorId={catalog.id} size="md" />
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
              {catalog.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {catalog.tagline}
            </p>
          </div>
        </div>

        {onOpenGiftMega && (
          <button
            type="button"
            onClick={() => onOpenGiftMega(catalog.id)}
            className="min-h-[44px] px-4 py-2 rounded-2xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 font-display font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Gift className="w-4 h-4" />
            <span>Offrir du Mega</span>
          </button>
        )}
      </div>

      {/* Forfaits Section (3 Sections with Radio Buttons) + Checkout Summary */}
      <form
        onSubmit={handleBuyBundle}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
      >
        <div className="lg:col-span-7 space-y-5">
          {PERIODS.map((period) => {
            const list = catalog.bundles[period];
            return (
              <section
                key={period}
                className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-display font-extrabold text-lg text-slate-900 flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-blue-700" />
                    <span>{period}</span>
                  </h2>
                  <span className="text-xs font-medium text-slate-500">
                    {list.length} {list.length > 1 ? 'offres' : 'offre'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {list.map((bundle) => {
                    const checked = selectedBundleId === bundle.id;
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
                          name="operator-bundle"
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
                            {bundle.price}F
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Sticky Bundle Order Panel */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24 rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <OperatorLogo operatorId={catalog.id} size="sm" />
            <div>
              <h2 className="font-display font-extrabold text-lg text-slate-900">
                Forfait sélectionné
              </h2>
              <p className="text-xs text-slate-500">
                Opérateur {catalog.name}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-blue-50/70 border border-blue-200/80 p-4 flex items-center justify-between gap-3">
            <div>
              <span className="block text-xs font-semibold text-blue-700">
                {selectedBundle.period}
              </span>
              <span className="font-display font-extrabold text-base text-slate-900">
                {selectedBundle.label}
              </span>
            </div>
            <span className="font-display font-extrabold text-xl text-blue-700 tabular-nums">
              {formatFCFA(selectedBundle.price)}
            </span>
          </div>

          <div>
            <label
              htmlFor="operator-bundle-phone"
              className="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Numéro à recharger (+227)
            </label>
            <div className="flex items-stretch rounded-2xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20 overflow-hidden bg-white">
              <span className="px-3.5 bg-slate-50 border-r border-slate-200 flex items-center gap-1.5 font-mono font-semibold text-sm text-slate-900">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                +227
              </span>
              <input
                id="operator-bundle-phone"
                type="tel"
                inputMode="numeric"
                value={bundlePhoneDigits}
                onChange={(e) => {
                  setBundlePhoneDigits(formatNigerDigits(e.target.value));
                  setBundleError('');
                }}
                placeholder="96 00 00 00"
                className="w-full px-3.5 py-3 font-mono font-semibold text-base text-slate-900 focus:outline-none tabular-nums"
              />
            </div>
          </div>

          {bundleError && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm font-medium text-red-700"
            >
              {bundleError}
            </div>
          )}

          <button
            type="submit"
            className="w-full min-h-[52px] rounded-2xl bg-blue-700 hover:bg-blue-800 active:scale-[0.99] text-white font-display font-extrabold text-base transition-all cursor-pointer"
          >
            Payer maintenant · {formatFCFA(selectedBundle.price)}
          </button>
        </aside>
      </form>

      {/* Credit Chap Chap Section on Operator Page */}
      <section
        aria-labelledby="op-credit-title"
        className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5"
      >
        <div className="flex items-center gap-3">
          <OperatorLogo operatorId={catalog.id} size="sm" />
          <div>
            <h2
              id="op-credit-title"
              className="font-display font-extrabold text-lg sm:text-xl text-slate-900 flex items-center gap-2"
            >
              <span>Credit Chap Chap · {catalog.name}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Saisissez n'importe quel montant (minimum 100 F)
            </p>
          </div>
        </div>

        <form onSubmit={handleBuyCredit} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-5">
            <label
              htmlFor="op-credit-phone"
              className="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Numéro +227
            </label>
            <div className="flex items-stretch rounded-2xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20 overflow-hidden bg-white">
              <span className="px-3.5 bg-slate-50 border-r border-slate-200 flex items-center font-mono font-semibold text-sm text-slate-900">
                +227
              </span>
              <input
                id="op-credit-phone"
                type="tel"
                inputMode="numeric"
                value={creditPhoneDigits}
                onChange={(e) => {
                  setCreditPhoneDigits(formatNigerDigits(e.target.value));
                  setCreditError('');
                }}
                placeholder="96 00 00 00"
                className="w-full px-3.5 py-3 font-mono font-semibold text-base text-slate-900 focus:outline-none tabular-nums"
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label
              htmlFor="op-credit-amount"
              className="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Montant (min 100F)
            </label>
            <div className="relative">
              <input
                id="op-credit-amount"
                type="number"
                min={MIN_CREDIT_AMOUNT}
                inputMode="numeric"
                value={creditAmount}
                onChange={(e) => {
                  setCreditAmount(e.target.value);
                  setCreditError('');
                }}
                placeholder="100, 500, 1000..."
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 pr-14 font-mono font-semibold text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 tabular-nums"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                FCFA
              </span>
            </div>
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full min-h-[50px] rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-display font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Acheter Crédit</span>
            </button>
          </div>
        </form>

        {creditError && (
          <div
            role="alert"
            className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm font-medium text-red-700"
          >
            {creditError}
          </div>
        )}
      </section>
    </div>
  );
};
