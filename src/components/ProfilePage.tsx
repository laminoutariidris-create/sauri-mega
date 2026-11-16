import React, { useState } from 'react';
import {
  Check,
  Copy,
  Edit3,
  Gift,
  Globe,
  LogOut,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Share2,
  Shield,
  User,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { AfricanCountry } from '../data/countries';
import {
  PAYMENT_MERCHANT_NUMBER,
  REFERRAL_BONUS_AMOUNT,
  WHATSAPP_URL,
  buildReferralCode,
  formatFCFA,
  formatNigerDigits,
} from '../data/operators';
import { LANGUAGES, TranslationStrings } from '../data/translations';
import { LanguageCode, UserAccount } from '../types';

interface ProfilePageProps {
  user: UserAccount;
  language: LanguageCode;
  selectedCountry?: AfricanCountry | null;
  t: TranslationStrings;
  onChangeLanguage: (lang: LanguageCode) => void;
  onChangeCountry: () => void;
  onUpdateProfile: (updates: Partial<UserAccount>) => void;
  onApplyReferralCode: (code: string) => { ok: boolean; message: string };
  onRechargeSolde: () => void;
  onOpenAdmin: () => void;
  onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  language,
  selectedCountry,
  t,
  onChangeLanguage,
  onChangeCountry,
  onUpdateProfile,
  onApplyReferralCode,
  onRechargeSolde,
  onOpenAdmin,
  onLogout,
}) => {
  const [imgError, setImgError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const [copiedReferral, setCopiedReferral] = useState(false);
  const [friendCodeInput, setFriendCodeInput] = useState('');
  const [referralFeedback, setReferralFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const referralCode = user.referralCode || buildReferralCode(user.name, user.id);
  const referralCount = user.referralCount ?? 0;
  const referralBonusTotal = referralCount * REFERRAL_BONUS_AMOUNT;
  const inviteMessage = `Rejoins Sauri Mega avec mon code parrainage ${referralCode} et recevons tous les deux ${REFERRAL_BONUS_AMOUNT} F dans notre Wallet !`;
  const whatsappInviteHref = `https://wa.me/?text=${encodeURIComponent(inviteMessage)}`;

  const handleCopyReferral = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
    } catch {
      // Clipboard fallback
    }
    setCopiedReferral(true);
    window.setTimeout(() => setCopiedReferral(false), 2000);
  };

  const handleSubmitFriendCode = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onApplyReferralCode(friendCodeInput);
    setReferralFeedback(res);
    if (res.ok) {
      setFriendCodeInput('');
    }
  };

  const [nameInput, setNameInput] = useState(user.name);
  const [emailInput, setEmailInput] = useState(user.email);
  const [phoneDigits, setPhoneDigits] = useState(() =>
    formatNigerDigits(user.phone.replace('+227', ''))
  );
  const [formError, setFormError] = useState('');

  const openEditor = () => {
    setNameInput(user.name);
    setEmailInput(user.email);
    setPhoneDigits(formatNigerDigits(user.phone.replace('+227', '')));
    setFormError('');
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = nameInput.trim();
    const trimmedEmail = emailInput.trim().toLowerCase();
    const digits = phoneDigits.replace(/\D/g, '');

    if (trimmedName.length < 2) {
      setFormError('Veuillez entrer votre nom complet.');
      return;
    }
    if (!trimmedEmail.includes('@')) {
      setFormError('Veuillez entrer un email valide.');
      return;
    }
    if (digits.length !== 8) {
      setFormError('Le numéro doit contenir 8 chiffres après +227.');
      return;
    }

    onUpdateProfile({
      name: trimmedName,
      email: trimmedEmail,
      phone: `+227 ${formatNigerDigits(digits)}`,
    });
    setIsEditing(false);
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
            {t.navProfil}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Informations du compte, langue et assistance client
          </p>
        </div>
        {savedNotice && (
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-green-600">
            <Check className="w-4 h-4" />
            <span>Profil mis à jour</span>
          </span>
        )}
      </div>

      {/* User Info + Solde */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        <section className="md:col-span-7 rounded-3xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-blue-600/80 bg-blue-50 flex items-center justify-center shrink-0">
              {!imgError && user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-blue-700" />
              )}
            </div>
            <div className="min-w-0 space-y-1">
              <h2 className="font-display font-extrabold text-xl text-slate-900 truncate">
                {user.name}
              </h2>
              <p className="text-sm text-slate-600 flex items-center gap-1.5 truncate">
                <Mail className="w-4 h-4 text-blue-700 shrink-0" />
                <span className="truncate">{user.email}</span>
              </p>
              <p className="font-mono text-sm font-semibold text-slate-700 flex items-center gap-1.5 tabular-nums">
                <Phone className="w-4 h-4 text-blue-700 shrink-0" />
                <span>{user.phone}</span>
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={openEditor}
              className="flex-1 min-w-[150px] min-h-[48px] px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-display font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>{t.modifierProfil}</span>
            </button>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="min-h-[48px] px-4 py-2.5 rounded-2xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 font-display font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>{t.navAdmin}</span>
            </button>
          </div>
        </section>

        {/* Wallet Solde Card */}
        <section className="md:col-span-5 rounded-3xl bg-blue-700 text-white p-6 shadow-xs flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-blue-100 text-sm font-medium">
              <Wallet className="w-4 h-4" />
              <span>{t.soldeDisponible}</span>
            </div>
            <p className="mt-2 font-display font-extrabold text-3xl tracking-tight tabular-nums">
              {formatFCFA(user.solde)}
            </p>
          </div>

          <button
            type="button"
            onClick={onRechargeSolde}
            className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-display font-extrabold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t.recharger}</span>
          </button>
        </section>
      </div>

      {/* Parrainage Card */}
      <section className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-base sm:text-lg text-slate-900">
                {t.parrainage} · +200 F chacun
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Invitez un ami : vous recevez tous les deux 200 F dans votre Wallet.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              {referralCount} {referralCount > 1 ? 'amis' : 'ami'}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-green-50 border border-green-200 text-green-700 tabular-nums">
              +{formatFCFA(referralBonusTotal)}
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="block text-xs font-semibold text-slate-500">
              Votre code parrainage
            </span>
            <span className="font-mono font-extrabold text-xl text-blue-700 tracking-wide">
              {referralCode}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyReferral}
              className="min-h-[42px] px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-display font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              {copiedReferral ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Copié</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copier</span>
                </>
              )}
            </button>

            <a
              href={whatsappInviteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[42px] px-3.5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-display font-bold text-xs flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>Inviter sur WhatsApp</span>
            </a>
          </div>
        </div>

        {!user.referredBy ? (
          <form onSubmit={handleSubmitFriendCode} className="space-y-2.5 pt-1">
            <label
              htmlFor="profile-friend-code"
              className="block text-xs sm:text-sm font-semibold text-slate-700"
            >
              Vous avez reçu un code parrainage d'un ami ? (+200 F dans votre Wallet)
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Gift className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="profile-friend-code"
                  type="text"
                  value={friendCodeInput}
                  onChange={(e) => {
                    setFriendCodeInput(e.target.value.toUpperCase());
                    setReferralFeedback(null);
                  }}
                  placeholder="Ex: SAURI-AMI315"
                  className="w-full rounded-2xl border border-slate-300 pl-10 pr-4 py-2.5 font-mono text-sm uppercase text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-display font-bold text-sm shrink-0 transition-colors cursor-pointer"
              >
                Valider +200F
              </button>
            </div>
            {referralFeedback && (
              <p
                role="status"
                className={`text-xs sm:text-sm font-semibold ${
                  referralFeedback.ok ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {referralFeedback.message}
              </p>
            )}
          </form>
        ) : (
          <p className="text-xs font-semibold text-green-700 flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>Bonus parrainage de 200 F déjà activé sur votre compte.</span>
          </p>
        )}
      </section>

      {/* 7-Language Picker Section */}
      <section className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-blue-700" />
          <h2 className="font-display font-bold text-base text-slate-900">
            Langue de l'application (7 langues)
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {LANGUAGES.map((lang) => {
            const active = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => onChangeLanguage(lang.code)}
                className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  active
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Country Settings Card */}
      <section className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-2xl shrink-0">
            {selectedCountry?.flag ?? '🇳🇪'}
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-slate-900">
              Pays / Kasa
            </h2>
            <p className="text-sm font-semibold text-slate-600 mt-0.5">
              {selectedCountry
                ? `${selectedCountry.name} (${selectedCountry.dialCode})`
                : 'Niger (+227)'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onChangeCountry}
          className="min-h-[46px] px-5 py-2.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-display font-bold text-sm transition-colors shrink-0 cursor-pointer"
        >
          Changer de pays
        </button>
      </section>

      {/* Edit Profile Form */}
      {isEditing && (
        <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-extrabold text-lg text-slate-900">
              {t.modifierProfil}
            </h2>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="min-w-[44px] min-h-[44px] rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              aria-label="Annuler"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label
                htmlFor="edit-name"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                {t.nomComplet}
              </label>
              <input
                id="edit-name"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label
                htmlFor="edit-email"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                {t.email}
              </label>
              <input
                id="edit-email"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label
                htmlFor="edit-phone"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                {t.telephone}
              </label>
              <div className="flex items-stretch rounded-2xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20 overflow-hidden">
                <span className="px-4 bg-slate-50 border-r border-slate-200 flex items-center font-mono font-semibold text-slate-900">
                  +227
                </span>
                <input
                  id="edit-phone"
                  type="tel"
                  inputMode="numeric"
                  value={phoneDigits}
                  onChange={(e) => setPhoneDigits(formatNigerDigits(e.target.value))}
                  className="w-full px-4 py-3 font-mono font-semibold text-base text-slate-900 focus:outline-none tabular-nums"
                />
              </div>
            </div>

            {formError && (
              <p role="alert" className="text-sm font-medium text-red-600">
                {formError}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="min-h-[48px] px-6 py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-display font-bold text-sm transition-colors cursor-pointer"
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="min-h-[48px] px-6 py-3 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-display font-bold text-sm transition-colors cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Assistance WhatsApp */}
      <section className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-200 text-green-600 flex items-center justify-center shrink-0">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base text-slate-900">
              {t.assistanceWhatsapp}
            </h2>
            <p className="font-mono text-sm font-semibold text-slate-600 mt-0.5 tabular-nums">
              {PAYMENT_MERCHANT_NUMBER}
            </p>
          </div>
        </div>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-display font-bold text-sm flex items-center justify-center gap-2 transition-colors shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>
      </section>

      {/* Déconnexion */}
      <section className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-base text-slate-900">
            {t.deconnexion}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Fermer votre session actuelle sur Sauri Mega
          </p>
        </div>

        <button
          type="button"
          onClick={() => setConfirmLogout(true)}
          className="min-h-[48px] px-5 py-2.5 rounded-2xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-display font-bold text-sm flex items-center justify-center gap-2 transition-colors shrink-0 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.deconnexion}</span>
        </button>
      </section>

      {/* Logout Confirmation */}
      {confirmLogout && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirmLogout(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 space-y-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1.5">
              <h2 className="font-display font-extrabold text-xl text-slate-900">
                {t.deconnexion} ?
              </h2>
              <p className="text-sm text-slate-600">
                Vous reviendrez sur l'écran de connexion Sauri Mega.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConfirmLogout(false)}
                className="min-h-[48px] rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-display font-bold text-sm cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmLogout(false);
                  onLogout();
                }}
                className="min-h-[48px] rounded-2xl bg-red-600 hover:bg-red-700 text-white font-display font-bold text-sm cursor-pointer"
              >
                {t.deconnexion}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
