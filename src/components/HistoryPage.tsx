import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  X,
  XCircle,
} from 'lucide-react';
import { formatAmount, formatDateFr } from '../data/operators';
import { TranslationStrings } from '../data/translations';
import { Transaction, TransactionStatus } from '../types';
import { OperatorLogo } from './BrandLogos';
import { ReceiptCard } from './ReceiptView';

interface HistoryPageProps {
  transactions: Transaction[];
  t: TranslationStrings;
  onGoHome: () => void;
}

type StatusFilter = 'Tous' | TransactionStatus;

const FILTERS: StatusFilter[] = ['Tous', 'En attente', 'Validé', 'Rejeté'];

const StatusLabel: React.FC<{ status: TransactionStatus; t: TranslationStrings }> = ({
  status,
  t,
}) => {
  if (status === 'Validé') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>{t.statutValide}</span>
      </span>
    );
  }
  if (status === 'Rejeté') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600">
        <XCircle className="w-4 h-4 shrink-0" />
        <span>{t.statutRejete}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600">
      <Clock className="w-4 h-4 shrink-0" />
      <span>{t.statutEnAttente}</span>
    </span>
  );
};

export const HistoryPage: React.FC<HistoryPageProps> = ({
  transactions,
  t,
  onGoHome,
}) => {
  const [filter, setFilter] = useState<StatusFilter>('Tous');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filtered =
    filter === 'Tous'
      ? transactions
      : transactions.filter((tx) => tx.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
            {t.navHistorique}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Vos achats, montants envoyés, crédités et reçus
          </p>
        </div>

        <div
          className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200/70 overflow-x-auto"
          role="tablist"
          aria-label="Filtrer par statut"
        >
          {FILTERS.map((item) => {
            const active = filter === item;
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(item)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  active
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <section className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Clock className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="font-display font-bold text-lg text-slate-900">
              Aucune transaction
            </h2>
            <p className="text-sm text-slate-500">
              Aucun élément pour le filtre « {filter} ».
            </p>
          </div>
          <button
            type="button"
            onClick={onGoHome}
            className="min-h-[48px] px-6 py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-display font-bold text-sm transition-colors cursor-pointer"
          >
            {t.navAccueil}
          </button>
        </section>
      ) : (
        <section className="rounded-3xl bg-white border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {filtered.map((tx) => {
            const currency =
              tx.currency ?? (tx.country === 'NG' ? 'NGN' : 'FCFA');
            return (
              <button
                key={tx.id}
                type="button"
                onClick={() => setSelectedTx(tx)}
                className="w-full p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <OperatorLogo operatorId={tx.operatorId} size="sm" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="font-display font-bold text-sm sm:text-base text-slate-900">
                        {tx.operatorName}
                      </span>
                      <span className="text-slate-300" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-slate-600">
                        {tx.isGift ? (
                          <>
                            <span className="font-bold text-orange-600">
                              Cadeau envoyé
                            </span>
                            {tx.bundleLabel ? ` · ${tx.bundleLabel}` : ''}
                          </>
                        ) : tx.bundleLabel ? (
                          tx.bundleLabel
                        ) : tx.kind === 'recharge' ? (
                          'Recharge Solde'
                        ) : tx.kind === 'airtime' ? (
                          'Airtime Nigeria'
                        ) : tx.kind === 'data' ? (
                          'Data Nigeria'
                        ) : tx.kind === 'pin' ? (
                          'Carte Recharge PIN'
                        ) : (
                          t.creditChapChap
                        )}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                      <span className="font-mono font-medium text-slate-700 tabular-nums">
                        {tx.phoneNumber}
                      </span>
                      {tx.rechargePin && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono font-bold text-blue-700 tabular-nums">
                            PIN: {tx.rechargePin}
                          </span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span>{formatDateFr(tx.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                  <div className="grid grid-cols-3 gap-3 text-left sm:text-right text-xs">
                    <div>
                      <span className="block text-[11px] text-slate-400">
                        {t.montantEnvoye}
                      </span>
                      <span className="font-display font-bold text-slate-900 tabular-nums">
                        {formatAmount(tx.amountSent, currency)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-400">
                        {t.montantCredite}
                      </span>
                      <span className="font-display font-bold text-green-600 tabular-nums">
                        {formatAmount(tx.amountCredited, currency)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-400">
                        {t.profit}
                      </span>
                      <span className="font-display font-bold text-blue-700 tabular-nums">
                        {formatAmount(tx.profitFee, currency)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusLabel status={tx.status} t={t} />
                    <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                  </div>
                </div>
              </button>
            );
          })}
        </section>
      )}

      {/* Detail + Reçu par image Modal */}
      {selectedTx && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedTx(null)}
        >
          <div
            className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-slate-50 p-5 sm:p-6 space-y-4 shadow-xl max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-extrabold text-lg text-slate-900">
                {t.recuTitre}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="min-w-[44px] min-h-[44px] rounded-xl text-slate-500 hover:bg-white flex items-center justify-center cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ReceiptCard transaction={selectedTx} t={t} />
          </div>
        </div>
      )}
    </div>
  );
};
