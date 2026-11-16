import React, { useState } from 'react';
import { Gift, Phone, Wifi, X } from 'lucide-react';
import {
  OPERATOR_CATALOGS,
  formatFCFA,
  formatNigerDigits,
  getOperatorCatalog,
} from '../data/operators';
import { BundlePeriod, DataBundle, OperatorId, PendingCheckout } from '../types';
import { OperatorLogo } from './BrandLogos';

interface GiftMegaModalProps {
  userPhone: string;
  initialOperatorId?: OperatorId;
  onClose: () => void;
  onProceedToPayment: (checkout: PendingCheckout) => void;
}

const PERIODS: BundlePeriod[] = ['Jour', 'Semaine', 'Mois'];

export const GiftMegaModal: React.FC<GiftMegaModalProps> = ({
  userPhone,
  initialOperatorId = 'airtel',
  onClose,
  onProceedToPayment,
}) => {
  const [operatorId, setOperatorId] = useState<OperatorId>(initialOperatorId);
  const catalog = getOperatorCatalog(operatorId);

  const [selectedBundleId, setSelectedBundleId] = useState<string>(
    () => catalog.bundles.Jour[0]?.id ?? catalog.bundles.Semaine[0]?.id ?? ''
  );
  const [recipientDigits, setRecipientDigits] = useState<string>('');
  const [error, setError] = useState<string>('');

  const ownRawDigits = userPhone.replace('+227', '').replace(/\D/g, '');

  const allBundles: DataBundle[] = [
    ...catalog.bundles.Jour,
    ...catalog.bundles.Semaine,
    ...catalog.bundles.Mois,
  ];
  const selectedBundle =
    allBundles.find((b) => b.id === selectedBundleId) ?? allBundles[0];

  const handleOperatorChange = (nextOpId: OperatorId) => {
    setOperatorId(nextOpId);
    const nextCatalog = getOperatorCatalog(nextOpId);
    const first = nextCatalog.bundles.Jour[0] ?? nextCatalog.bundles.Semaine[0];
    if (first) setSelectedBundleId(first.id);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const rawDigits = recipientDigits.replace(/\D/g, '');
    if (rawDigits.length !== 8) {
      setError('Veuillez saisir un numéro du bénéficiaire valide à 8 chiffres après +227.');
      return;
    }

    if (rawDigits === ownRawDigits) {
      setError('Pour offrir du Mega, le numéro du bénéficiaire doit être différent du vôtre.');
      return;
    }

    onProceedToPayment({
      kind: 'forfait',
      operatorId: catalog.id,
      operatorName: catalog.name,
      phoneNumber: `+227 ${formatNigerDigits(rawDigits)}`,
      bundleLabel: selectedBundle.label,
      isGift: true,
      amountSent: selectedBundle.price,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gift-mega-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-white p-5 sm:p-6 space-y-5 shadow-xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="gift-mega-title"
                className="font-display font-extrabold text-xl text-slate-900"
              >
                Offrir du Mega
              </h2>
              <p className="text-xs text-slate-500">
                Envoyez un forfait internet à un proche
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Numéro du bénéficiaire +227 */}
          <div>
            <label
              htmlFor="gift-recipient-phone"
              className="block text-sm font-semibold text-slate-700 mb-1.5"
            >
              Numéro du bénéficiaire +227
            </label>
            <div className="flex items-stretch rounded-2xl border border-slate-300 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 overflow-hidden bg-white">
              <span className="px-3.5 bg-slate-50 border-r border-slate-200 flex items-center gap-1.5 font-mono font-semibold text-sm text-slate-900">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                +227
              </span>
              <input
                id="gift-recipient-phone"
                type="tel"
                inputMode="numeric"
                autoFocus
                value={recipientDigits}
                onChange={(e) => {
                  setRecipientDigits(formatNigerDigits(e.target.value));
                  setError('');
                }}
                placeholder="90 12 34 56"
                className="w-full px-3.5 py-3 font-mono font-semibold text-base text-slate-900 focus:outline-none tabular-nums"
              />
            </div>
          </div>

          {/* Opérateur */}
          <div>
            <span className="block text-sm font-semibold text-slate-700 mb-2">
              Opérateur
            </span>
            <div className="grid grid-cols-4 gap-2">
              {OPERATOR_CATALOGS.map((op) => {
                const active = op.id === operatorId;
                return (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => handleOperatorChange(op.id)}
                    className={`min-h-[48px] rounded-2xl border-2 px-2 py-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      active
                        ? 'border-orange-500 bg-orange-50/70 text-orange-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <OperatorLogo operatorId={op.id} size="sm" />
                    <span className="font-display font-bold text-[11px] truncate w-full text-center">
                      {op.shortLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Choisir le forfait */}
          <div className="space-y-2.5">
            <span className="block text-sm font-semibold text-slate-700">
              Choisir le forfait
            </span>
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {PERIODS.map((period) => {
                const list = catalog.bundles[period];
                return (
                  <div key={period} className="space-y-1.5">
                    <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5 text-blue-700" />
                      <span>{period}</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {list.map((bundle) => {
                        const checked = selectedBundle.id === bundle.id;
                        return (
                          <label
                            key={bundle.id}
                            className={`rounded-xl border-2 px-3 py-2.5 flex items-center gap-2.5 cursor-pointer transition-all ${
                              checked
                                ? 'border-orange-500 bg-orange-50/60'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="gift-mega-bundle"
                              value={bundle.id}
                              checked={checked}
                              onChange={() => setSelectedBundleId(bundle.id)}
                              className="w-4 h-4 accent-orange-500 shrink-0"
                            />
                            <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                              <span className="font-display font-bold text-xs sm:text-sm text-slate-900 truncate">
                                {bundle.volume}{' '}
                                <span className="text-[11px] font-medium text-slate-500">
                                  ({bundle.validityLabel})
                                </span>
                              </span>
                              <span className="font-display font-extrabold text-xs sm:text-sm text-orange-600 tabular-nums shrink-0">
                                {bundle.price}F
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm font-medium text-red-700"
            >
              {error}
            </div>
          )}

          {/* Bouton Offrir maintenant */}
          <button
            type="submit"
            className="w-full min-h-[52px] rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-display font-extrabold text-base flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Gift className="w-5 h-5" />
            <span>Offrir maintenant · {formatFCFA(selectedBundle.price)}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
