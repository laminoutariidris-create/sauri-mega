import React, { useState } from 'react';
import { ArrowLeft, Smartphone } from 'lucide-react';
import {
  MIN_CREDIT_AMOUNT,
  OPERATOR_CATALOGS,
  formatNigerDigits,
  getOperatorCatalog,
} from '../data/operators';
import { TranslationStrings } from '../data/translations';
import { OperatorId, PendingCheckout, UserAccount } from '../types';
import { OperatorLogo } from './BrandLogos';

interface CreditHubPageProps {
  user: UserAccount;
  t: TranslationStrings;
  onBackHome: () => void;
  onProceedToPayment: (checkout: PendingCheckout) => void;
}

export const CreditHubPage: React.FC<CreditHubPageProps> = ({
  user,
  t,
  onBackHome,
  onProceedToPayment,
}) => {
  const [operatorId, setOperatorId] = useState<OperatorId>('airtel');
  const [phoneDigits, setPhoneDigits] = useState(() =>
    formatNigerDigits(user.phone.replace('+227', ''))
  );
  const [amountInput, setAmountInput] = useState('500');
  const [error, setError] = useState('');

  const selectedOp = getOperatorCatalog(operatorId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const digits = phoneDigits.replace(/\D/g, '');
    const numericAmount = Number(amountInput.replace(/\D/g, '')) || 0;

    if (digits.length !== 8) {
      setError('Veuillez saisir un numéro nigérien valide à 8 chiffres après +227.');
      return;
    }
    if (numericAmount < MIN_CREDIT_AMOUNT) {
      setError(`Le montant minimum est de ${MIN_CREDIT_AMOUNT} F.`);
      return;
    }

    onProceedToPayment({
      kind: 'credit',
      operatorId: selectedOp.id,
      operatorName: selectedOp.name,
      phoneNumber: `+227 ${formatNigerDigits(digits)}`,
      amountSent: numericAmount,
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBackHome}
          className="min-w-[44px] min-h-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer"
          aria-label={t.retour}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900">
            {t.creditChapChap}
          </h1>
          <p className="text-sm text-slate-500">{t.creditRange}</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5"
      >
        {/* Operators Single Row */}
        <div>
          <span className="block text-sm font-semibold text-slate-700 mb-2">
            {t.operateur}
          </span>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {OPERATOR_CATALOGS.map((op) => {
              const checked = op.id === operatorId;
              return (
                <label
                  key={op.id}
                  className={`rounded-2xl border-2 p-2.5 sm:p-3 flex flex-col items-center text-center gap-1.5 cursor-pointer transition-all ${
                    checked
                      ? 'border-orange-500 bg-orange-50/50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="credit-hub-operator"
                    value={op.id}
                    checked={checked}
                    onChange={() => setOperatorId(op.id)}
                    className="sr-only"
                  />
                  <OperatorLogo operatorId={op.id} size="sm" />
                  <span className="font-display font-bold text-xs text-slate-900 truncate w-full">
                    {op.shortLabel}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Phone Number +227 */}
        <div>
          <label
            htmlFor="credit-hub-phone"
            className="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            {t.telephone}
          </label>
          <div className="flex items-stretch rounded-2xl border border-slate-300 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20 overflow-hidden bg-white">
            <span className="px-3.5 bg-slate-50 border-r border-slate-200 flex items-center font-mono font-semibold text-sm text-slate-900">
              +227
            </span>
            <input
              id="credit-hub-phone"
              type="tel"
              inputMode="numeric"
              value={phoneDigits}
              onChange={(e) => {
                setPhoneDigits(formatNigerDigits(e.target.value));
                setError('');
              }}
              placeholder="96 00 00 00"
              className="w-full px-3.5 py-3 font-mono font-semibold text-base text-slate-900 focus:outline-none tabular-nums"
            />
          </div>
        </div>

        {/* Any Amount min 100F */}
        <div>
          <label
            htmlFor="credit-hub-amount"
            className="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            {t.montant} (minimum 100F)
          </label>
          <div className="relative">
            <input
              id="credit-hub-amount"
              type="number"
              min={MIN_CREDIT_AMOUNT}
              inputMode="numeric"
              value={amountInput}
              onChange={(e) => {
                setAmountInput(e.target.value);
                setError('');
              }}
              placeholder="100, 500, 1000, 5000..."
              className="w-full rounded-2xl border border-slate-300 px-4 py-3.5 pr-16 font-mono font-semibold text-lg text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 tabular-nums"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
              FCFA
            </span>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full min-h-[52px] rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-display font-extrabold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Smartphone className="w-5 h-5" />
          <span>{t.acheterCreditBtn}</span>
        </button>
      </form>
    </div>
  );
};
