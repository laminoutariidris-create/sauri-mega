import React, { useState } from 'react';
import { Check, Copy, Eye, EyeOff, Gift, Share2, Smartphone, Users, Wifi, Zap } from 'lucide-react';
import { OPERATOR_CATALOGS, REFERRAL_BONUS_AMOUNT, buildReferralCode, formatFCFA } from '../data/operators';
import { TranslationStrings } from '../data/translations';
import { OperatorId, PendingCheckout, UserAccount } from '../types';
import { OperatorLogo } from './BrandLogos';

interface HomePageProps {
  user: UserAccount;
  t: TranslationStrings;
  onSelectOperator: (operatorId: OperatorId) => void;
  onOpenCreditPage: () => void;
  onOpenMegaPage: () => void;
  onOpenGiftMega: () => void;
  onOpenProfile: () => void;
  onQuickRecharge5000: (checkout: PendingCheckout) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  user,
  t,
  onSelectOperator,
  onOpenCreditPage,
  onOpenMegaPage,
  onOpenGiftMega,
  onOpenProfile,
  onQuickRecharge5000,
}) => {
  const [showBalance, setShowBalance] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const referralCode = user.referralCode || buildReferralCode(user.name, user.id);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
    } catch {
      // Clipboard fallback
    }
    setCopiedCode(true);
    window.setTimeout(() => setCopiedCode(false), 2000);
  };

  const inviteText = `Rejoins Sauri Mega avec mon code parrainage ${referralCode} et recevons tous les deux ${REFERRAL_BONUS_AMOUNT} F dans notre Wallet !`;
  const whatsappInviteUrl = `https://wa.me/?text=${encodeURIComponent(inviteText)}`;

  const formattedBalance = `${new Intl.NumberFormat('fr-FR').format(user.solde)} FCFA`;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Blue Balance Card with Eye Toggle + Yellow +5000 FCFA & +Mega */}
      <section
        aria-label={t.soldeDisponible}
        className="rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white p-5 sm:p-7 shadow-sm space-y-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs sm:text-sm font-medium text-blue-100">
              {t.bonjour} {user.name}
            </p>
            <p className="mt-2 text-sm font-semibold text-blue-100 flex items-center gap-2">
              <span>{t.soldeDisponible}</span>
            </p>
            <div className="mt-1 flex items-center gap-3">
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight tabular-nums">
                {showBalance ? formattedBalance : '••••• FCFA'}
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

          <span className="text-xs font-semibold text-blue-200 hidden sm:inline">
            {formatFCFA(user.solde)}
          </span>
        </div>

        {/* Bottom Yellow Quick Buttons: +5000 FCFA & +Mega */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() =>
              onQuickRecharge5000({
                kind: 'recharge',
                operatorName: 'Solde Sauri Mega',
                phoneNumber: user.phone,
                amountSent: 5000,
              })
            }
            className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-slate-950 font-display font-extrabold text-sm sm:text-base shadow-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Zap className="w-4 h-4 stroke-[2.5]" />
            <span>+5000 FCFA</span>
          </button>

          <button
            type="button"
            onClick={onOpenMegaPage}
            className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-slate-950 font-display font-extrabold text-sm sm:text-base shadow-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Wifi className="w-4 h-4 stroke-[2.5]" />
            <span>+Mega</span>
          </button>
        </div>
      </section>

      {/* Two Main Cards: Orange Acheter Crédit + White Forfait Internet */}
      <section aria-label="Services principaux" className="grid grid-cols-2 gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onOpenCreditPage}
          className="rounded-3xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white p-4 sm:p-6 shadow-xs transition-all text-left flex flex-col justify-between gap-4 min-h-[132px] cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="block font-display font-extrabold text-base sm:text-xl leading-tight">
              {t.acheterCredit}
            </span>
            <span className="block text-xs sm:text-sm text-orange-50 mt-1 font-medium">
              {t.creditRange}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={onOpenMegaPage}
          className="rounded-3xl bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-900 border border-slate-200 p-4 sm:p-6 shadow-xs transition-all text-left flex flex-col justify-between gap-4 min-h-[132px] cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Wifi className="w-6 h-6" />
          </div>
          <div>
            <span className="block font-display font-extrabold text-base sm:text-xl leading-tight text-slate-900">
              {t.forfaitInternet}
            </span>
            <span className="block text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              {t.megaRange}
            </span>
          </div>
        </button>
      </section>

      {/* Cadeau Mega: Offrir du Mega */}
      <button
        type="button"
        onClick={onOpenGiftMega}
        className="w-full rounded-2xl bg-white hover:bg-orange-50/70 active:scale-[0.99] border border-orange-200 px-4 py-3.5 shadow-xs transition-all flex items-center justify-between gap-3 cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div className="text-left min-w-0">
            <span className="block font-display font-extrabold text-sm sm:text-base text-slate-900">
              {t.offrirMega}
            </span>
            <span className="block text-xs text-slate-500 truncate">
              Acheter du Mega pour un autre numéro différent du vôtre
            </span>
          </div>
        </div>
        <span className="px-3 py-1.5 rounded-xl bg-orange-500 text-white font-display font-bold text-xs shrink-0">
          Cadeau
        </span>
      </button>

      {/* Single Row Operators: A Z M NT (Airtel, Zamani, Moov, Niger) */}
      <section aria-labelledby="operators-strip-title" className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2
            id="operators-strip-title"
            className="font-display font-extrabold text-base sm:text-lg text-slate-900"
          >
            {t.operateurs}
          </h2>
          <span className="text-xs text-slate-500">
            {t.choisissezOperateur}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {OPERATOR_CATALOGS.map((op) => (
            <button
              key={op.id}
              type="button"
              onClick={() => onSelectOperator(op.id)}
              className="rounded-2xl bg-white border border-slate-200 hover:border-blue-500 active:scale-[0.97] p-2.5 sm:p-4 shadow-xs transition-all flex flex-col items-center text-center gap-2 min-h-[106px] justify-center cursor-pointer"
            >
              <OperatorLogo operatorId={op.id} size="sm" />
              <div>
                <span className="block font-display font-extrabold text-xs sm:text-sm text-slate-900">
                  {op.shortCode}
                </span>
                <span className="block text-[11px] sm:text-xs font-semibold text-slate-600 truncate">
                  {op.shortLabel}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Parrainage Card */}
      <section
        aria-label={t.parrainage}
        className="rounded-3xl bg-white border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-extrabold text-sm sm:text-base text-slate-900">
                {t.parrainage} · +200F
              </h2>
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-lg">
                {referralCode}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Invitez un ami : vous recevez tous les deux 200F dans votre Wallet.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyCode}
            className="min-h-[40px] px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-display font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copié' : 'Copier'}</span>
          </button>
          <a
            href={whatsappInviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-display font-bold text-xs flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Inviter</span>
          </a>
          <button
            type="button"
            onClick={onOpenProfile}
            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-display font-bold text-xs cursor-pointer"
          >
            Code ami
          </button>
        </div>
      </section>
    </div>
  );
};
