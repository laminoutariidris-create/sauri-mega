import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Eye,
  Lock,
  LogOut,
  Mail,
  Shield,
  TrendingUp,
  X,
  XCircle,
} from 'lucide-react';
import { formatNaira } from '../data/nigeria';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  formatAmount,
  formatDateFr,
  formatFCFA,
} from '../data/operators';
import { Transaction } from '../types';
import { OperatorLogo } from './BrandLogos';

interface AdminPageProps {
  isAdminLoggedIn: boolean;
  transactions: Transaction[];
  onAdminLogin: () => void;
  onAdminLogout: () => void;
  onValidateTransaction: (txId: string) => void;
  onRejectTransaction: (txId: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  isAdminLoggedIn,
  transactions,
  onAdminLogin,
  onAdminLogout,
  onValidateTransaction,
  onRejectTransaction,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [zoomImageTx, setZoomImageTx] = useState<Transaction | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      onAdminLogin();
      return;
    }
    setLoginError('Identifiants administrateur incorrects.');
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-4">
        <section className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-xl text-slate-900">
                Connexion Admin
              </h1>
              <p className="text-xs text-slate-500">
                Validation des captures Recup par Image
              </p>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Email Admin
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setLoginError('');
                  }}
                  placeholder="admin@saurimega.com"
                  className="w-full rounded-2xl border border-slate-300 pl-10 pr-4 py-3 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError('');
                  }}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-300 pl-10 pr-4 py-3 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>

            {loginError && (
              <div
                role="alert"
                className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm font-medium text-red-700"
              >
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full min-h-[50px] rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-display font-bold text-base transition-colors cursor-pointer"
            >
              Se connecter en Admin
            </button>
          </form>
        </section>
      </div>
    );
  }

  const validatedTxs = transactions.filter((t) => t.status === 'Validé');
  const pendingTxs = transactions.filter((t) => t.status === 'En attente');
  const validatedFCFA = validatedTxs.filter(
    (t) => t.currency !== 'NGN' && t.country !== 'NG'
  );
  const validatedNGN = validatedTxs.filter(
    (t) => t.currency === 'NGN' || t.country === 'NG'
  );
  const totalProfit = validatedFCFA.reduce((sum, t) => sum + t.profitFee, 0);
  const totalProfitNGN = validatedNGN.reduce((sum, t) => sum + t.profitFee, 0);
  const totalValidatedCredited = validatedFCFA.reduce(
    (sum, t) => sum + t.amountCredited,
    0
  );
  const totalValidatedCreditedNGN = validatedNGN.reduce(
    (sum, t) => sum + t.amountCredited,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
            Panneau Administrateur
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Gestion des captures Recup par Image et profits RIBA 4%
          </p>
        </div>

        <button
          type="button"
          onClick={onAdminLogout}
          className="min-h-[44px] px-4 py-2 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-display font-bold text-sm flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion Admin</span>
        </button>
      </div>

      {/* Profit & Stats KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <section className="rounded-3xl bg-blue-700 text-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-100">Total Profit (4%)</span>
            <TrendingUp className="w-5 h-5 text-blue-200" />
          </div>
          <p className="mt-2 font-display font-extrabold text-3xl tabular-nums">
            {formatFCFA(totalProfit)}
          </p>
          {totalProfitNGN > 0 && (
            <p className="mt-0.5 font-display font-bold text-sm text-amber-300 tabular-nums">
              + {formatNaira(totalProfitNGN)}
            </p>
          )}
          <p className="mt-1 text-xs text-blue-100">
            Sur {validatedTxs.length} {validatedTxs.length > 1 ? 'validations' : 'validation'}
          </p>
        </section>

        <section className="rounded-3xl bg-white border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">En attente</span>
          <p className="mt-2 font-display font-extrabold text-3xl text-orange-600 tabular-nums">
            {pendingTxs.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Captures à vérifier
          </p>
        </section>

        <section className="rounded-3xl bg-white border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Crédité</span>
          <p className="mt-2 font-display font-extrabold text-3xl text-green-600 tabular-nums">
            {formatFCFA(totalValidatedCredited)}
          </p>
          {totalValidatedCreditedNGN > 0 && (
            <p className="mt-0.5 font-display font-bold text-sm text-green-700 tabular-nums">
              + {formatNaira(totalValidatedCreditedNGN)}
            </p>
          )}
          <p className="mt-1 text-xs text-slate-500">
            Ajouté aux soldes clients
          </p>
        </section>
      </div>

      {/* All Recup par Image Uploads */}
      <section className="space-y-3.5">
        <h2 className="font-display font-extrabold text-lg text-slate-900">
          Captures reçues ({transactions.length})
        </h2>

        {transactions.length === 0 ? (
          <div className="rounded-3xl bg-white border border-slate-200 p-8 text-center text-sm text-slate-500">
            Aucune capture reçue pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {transactions.map((tx) => {
              const currency =
                tx.currency ?? (tx.country === 'NG' ? 'NGN' : 'FCFA');
              return (
                <article
                  key={tx.id}
                  className="rounded-3xl bg-white border border-slate-200 p-5 shadow-xs flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <OperatorLogo operatorId={tx.operatorId} size="sm" />
                      <div className="min-w-0">
                        <p className="font-display font-extrabold text-base text-slate-900 truncate">
                          {tx.userName}
                        </p>
                        <p className="font-mono text-xs font-semibold text-slate-600 tabular-nums">
                          {tx.phoneNumber}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {tx.operatorName}
                          {tx.bundleLabel
                            ? ` · ${tx.isGift ? 'Cadeau Mega · ' : ''}${tx.bundleLabel}`
                            : ''}{' '}
                          · {formatDateFr(tx.date)}
                        </p>
                      </div>
                    </div>

                    {/* Status label */}
                    <div className="shrink-0">
                      {tx.status === 'Validé' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Validé</span>
                        </span>
                      )}
                      {tx.status === 'Rejeté' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600">
                          <XCircle className="w-4 h-4" />
                          <span>Rejeté</span>
                        </span>
                      )}
                      {tx.status === 'En attente' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600">
                          <Clock className="w-4 h-4" />
                          <span>En attente</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Image + Amounts */}
                  <div className="grid grid-cols-12 gap-3 items-center bg-slate-50 rounded-2xl p-3 border border-slate-200/70">
                    <div className="col-span-5">
                      {tx.screenshotUrl ? (
                        <button
                          type="button"
                          onClick={() => setZoomImageTx(tx)}
                          className="relative group w-full h-24 rounded-xl overflow-hidden border border-slate-200 bg-white block cursor-pointer"
                          aria-label="Agrandir la capture"
                        >
                          <img
                            src={tx.screenshotUrl}
                            alt={`Capture de ${tx.userName}`}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Eye className="w-5 h-5" />
                          </span>
                        </button>
                      ) : (
                        <div className="w-full h-24 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400">
                          Sans image
                        </div>
                      )}
                    </div>

                    <div className="col-span-7 space-y-1.5 text-xs sm:text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500">Montant envoyé</span>
                        <span className="font-display font-bold text-slate-900 tabular-nums">
                          {formatAmount(tx.amountSent, currency)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500">Montant crédité</span>
                        <span className="font-display font-extrabold text-emerald-700 tabular-nums">
                          {formatAmount(tx.amountCredited, currency)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-500">Profit 4%</span>
                        <span className="font-display font-extrabold text-blue-700 tabular-nums">
                          {formatAmount(tx.profitFee, currency)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {tx.status === 'En attente' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => onValidateTransaction(tx.id)}
                        className="min-h-[46px] rounded-2xl bg-green-600 hover:bg-green-700 text-white font-display font-bold text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Valider</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onRejectTransaction(tx.id)}
                        className="min-h-[46px] rounded-2xl bg-red-600 hover:bg-red-700 text-white font-display font-bold text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Rejeter</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 font-medium pt-1">
                      {tx.status === 'Validé'
                        ? `Validé · ${formatAmount(
                            tx.amountCredited,
                            currency
                          )} ajoutés au solde de ${tx.userName}`
                        : 'Transaction rejetée par l’administrateur'}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Zoom Image Modal */}
      {zoomImageTx && zoomImageTx.screenshotUrl && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setZoomImageTx(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white p-5 space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Capture · {zoomImageTx.userName}
                </h3>
                <p className="text-xs text-slate-500">
                  {formatAmount(
                    zoomImageTx.amountSent,
                    zoomImageTx.currency ??
                      (zoomImageTx.country === 'NG' ? 'NGN' : 'FCFA')
                  )}{' '}
                  envoyés · {zoomImageTx.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setZoomImageTx(null)}
                className="min-w-[44px] min-h-[44px] rounded-xl text-slate-500 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                aria-label="Fermer l'image"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={zoomImageTx.screenshotUrl}
              alt={`Preuve de paiement ${zoomImageTx.id}`}
              className="w-full max-h-[65vh] object-contain rounded-2xl bg-slate-50 border border-slate-200"
            />
          </div>
        </div>
      )}
    </div>
  );
};
