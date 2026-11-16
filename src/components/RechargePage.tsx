import React, { useState } from 'react';
import { ArrowLeft, Info, Wallet } from 'lucide-react';
import {
  MIN_CREDIT_AMOUNT,
  calculateRiba,
  formatAmount,
} from '../data/operators';
import { CountryMode, PendingCheckout, UserAccount } from '../types';

interface RechargePageProps {
  user: UserAccount;
  countryMode?: CountryMode;
  onBack: () => void;
  onProceedToPayment: (checkout: PendingCheckout) => void;
}

const SUGGESTIONS = [1000, 5000, 10000];

export const RechargePage: React.FC<RechargePageProps> = ({
  user,
  countryMode = 'NE',
  onBack,
  onProceedToPayment,
}) => {
  const currency = countryMode === 'NG' ? 'NGN' : 'FCFA';
  const currentBalance = countryMode === 'NG' ? (user.soldeNGN ?? 0) : user.solde;
  const [amountInput, setAmountInput] = useState<string>('5000');
  const [error, setError] = useState<string>('');

  const numericAmount = Number(amountInput.replace(/\D/g, '')) || 0;
  const riba = calculateRiba(numericAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (numericAmount < MIN_CREDIT_AMOUNT) {
      setError(
        `Le montant minimum pour recharger votre solde est de ${formatAmount(
          MIN_CREDIT_AMOUNT,
          currency
        )}.`
      );
      return;
    }

    onProceedToPayment({
      kind: 'recharge',
      country: countryMode,
      currency,
      operatorName: countryMode === 'NG' ? 'Wallet Nigeria (₦)' : 'Solde Sauri Mega',
      phoneNumber: user.phone,
      amountSent: numericAmount,
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-w-[44px] min-h-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer"
          aria-label="Retour"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900">
            Recharger mon solde
          </h1>
          <p className="text-sm text-slate-500">
            Solde actuel :{' '}
            <span className="font-bold text-slate-800 tabular-nums">
              {formatAmount(currentBalance, currency)}
            </span>
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs space-y-5"
      >
        <div>
          <span className="block text-sm font-semibold text-slate-700 mb-2">
            Exemples rapides
          </span>
          <div className="grid grid-cols-3 gap-2.5">
            {SUGGESTIONS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  setAmountInput(String(amt));
                  setError('');
                }}
                className={`min-h-[46px] rounded-xl border-2 font-display font-bold text-sm tabular-nums transition-all cursor-pointer ${
                  numericAmount === amt
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-blue-300'
                }`}
              >
                {formatAmount(amt, currency)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="recharge-amount"
            className="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Montant à envoyer en {currency === 'NGN' ? 'Naira (₦)' : 'FCFA'} (minimum{' '}
            {formatAmount(MIN_CREDIT_AMOUNT, currency)})
          </label>
          <div className="relative">
            <input
              id="recharge-amount"
              type="number"
              min={MIN_CREDIT_AMOUNT}
              inputMode="numeric"
              value={amountInput}
              onChange={(e) => {
                setAmountInput(e.target.value);
                setError('');
              }}
              placeholder="5000"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3.5 pr-16 font-mono font-semibold text-lg text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 tabular-nums"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
              {currency === 'NGN' ? 'NGN' : 'FCFA'}
            </span>
          </div>
        </div>

        {/* RIBA Rule Preview */}
        <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4 space-y-2">
          <div className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-blue-900">
            <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <span>
              Règle RIBA : Vous envoyez {formatAmount(riba.amountSent, currency)}, vous recevrez{' '}
              {formatAmount(riba.amountCredited, currency)} dans votre solde (frais 4% :{' '}
              {formatAmount(riba.profitFee, currency)}).
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-blue-200/70 text-center">
            <div>
              <span className="block text-[11px] text-blue-700">Envoyé</span>
              <span className="font-display font-bold text-sm text-slate-900 tabular-nums">
                {formatAmount(riba.amountSent, currency)}
              </span>
            </div>
            <div>
              <span className="block text-[11px] text-blue-700">Frais 4%</span>
              <span className="font-display font-bold text-sm text-slate-900 tabular-nums">
                {formatAmount(riba.profitFee, currency)}
              </span>
            </div>
            <div>
              <span className="block text-[11px] text-blue-700">Crédité</span>
              <span className="font-display font-extrabold text-sm text-emerald-700 tabular-nums">
                {formatAmount(riba.amountCredited, currency)}
              </span>
            </div>
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
          className="w-full min-h-[52px] rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-display font-extrabold text-base flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Wallet className="w-5 h-5" />
          <span>Continuer vers le paiement</span>
        </button>
      </form>
    </div>
  );
};
