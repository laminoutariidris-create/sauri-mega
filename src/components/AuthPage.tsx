import React, { useState } from 'react';
import { Gift, Globe, Lock, Mail, Phone, User } from 'lucide-react';
import { formatNigerDigits } from '../data/operators';
import { LANGUAGES, TranslationStrings } from '../data/translations';
import { LanguageCode } from '../types';
import { SauriMegaLogo } from './BrandLogos';

interface AuthPageProps {
  language: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  t: TranslationStrings;
  onLogin: (email: string, password: string) => string | null;
  onRegister: (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    referralCode?: string;
  }) => string | null;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  language,
  onChangeLanguage,
  t,
  onLogin,
  onRegister,
}) => {
  const [tab, setTab] = useState<'connexion' | 'inscription'>('connexion');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhoneDigits, setRegPhoneDigits] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regReferralCode, setRegReferralCode] = useState('');

  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginEmail.trim() || !loginPassword) {
      setError('Veuillez renseigner votre email et votre mot de passe.');
      return;
    }
    const err = onLogin(loginEmail.trim(), loginPassword);
    if (err) setError(err);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const digits = regPhoneDigits.replace(/\D/g, '');

    if (regName.trim().length < 2) {
      setError('Veuillez entrer votre nom complet.');
      return;
    }
    if (!regEmail.includes('@')) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }
    if (digits.length !== 8) {
      setError('Veuillez entrer un numéro nigérien valide à 8 chiffres après +227.');
      return;
    }
    if (regPassword.length < 4) {
      setError('Le mot de passe doit contenir au moins 4 caractères.');
      return;
    }

    const err = onRegister({
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      phone: `+227 ${formatNigerDigits(digits)}`,
      password: regPassword,
      referralCode: regReferralCode.trim() || undefined,
    });
    if (err) setError(err);
  };

  const fillDemoAccount = () => {
    setTab('connexion');
    setLoginEmail('ibrahim@niger.ne');
    setLoginPassword('123456');
    setError('');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Blue Header */}
      <header className="bg-blue-700 text-white py-5 px-4 shadow-xs">
        <div className="max-w-md mx-auto flex flex-col items-center text-center gap-2.5 relative">
          <div className="self-end">
            <label className="relative flex items-center">
              <Globe className="w-3.5 h-3.5 text-blue-100 absolute left-2 pointer-events-none" />
              <select
                value={language}
                onChange={(e) => onChangeLanguage(e.target.value as LanguageCode)}
                aria-label="Langue"
                className="pl-7 pr-2 py-1 rounded-xl bg-blue-800 border border-blue-500 text-xs font-bold text-white focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <SauriMegaLogo className="w-14 h-14 shadow-sm" />
          <div>
            <h1 className="font-display font-extrabold text-2xl tracking-tight">
              Sauri <span className="text-amber-300">Mega</span>
            </h1>
            <p className="text-sm text-blue-100 mt-0.5 font-medium">
              {t.slogan}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-8 bg-slate-50/70">
        <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
          <div
            className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/70"
            role="tablist"
          >
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'connexion'}
              onClick={() => {
                setTab('connexion');
                setError('');
              }}
              className={`min-h-[44px] rounded-xl text-sm font-bold transition-all cursor-pointer ${
                tab === 'connexion'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.connexion}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'inscription'}
              onClick={() => {
                setTab('inscription');
                setError('');
              }}
              className={`min-h-[44px] rounded-xl text-sm font-bold transition-all cursor-pointer ${
                tab === 'inscription'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.inscription}
            </button>
          </div>

          {tab === 'connexion' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  {t.email}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="exemple@email.com"
                    className="w-full rounded-2xl border border-slate-300 pl-10 pr-4 py-3 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  {t.motDePasse}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-300 pl-10 pr-4 py-3 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
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

              <button
                type="submit"
                className="w-full min-h-[50px] rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-display font-bold text-base transition-colors cursor-pointer"
              >
                {t.seConnecter}
              </button>

              <div className="pt-2 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={fillDemoAccount}
                  className="text-xs font-semibold text-blue-700 hover:underline py-1 cursor-pointer"
                >
                  Remplir le compte démo (ibrahim@niger.ne)
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="reg-name"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  {t.nomComplet}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-name"
                    type="text"
                    value={regName}
                    onChange={(e) => {
                      setRegName(e.target.value);
                      setError('');
                    }}
                    placeholder="Ibrahim Moussa"
                    className="w-full rounded-2xl border border-slate-300 pl-10 pr-4 py-3 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="reg-email"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  {t.email}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => {
                      setRegEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="nom@email.com"
                    className="w-full rounded-2xl border border-slate-300 pl-10 pr-4 py-3 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="reg-phone"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  {t.telephone}
                </label>
                <div className="flex items-stretch rounded-2xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20 overflow-hidden">
                  <span className="px-3.5 bg-slate-50 border-r border-slate-200 flex items-center gap-1.5 font-mono font-semibold text-sm text-slate-900">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    +227
                  </span>
                  <input
                    id="reg-phone"
                    type="tel"
                    inputMode="numeric"
                    value={regPhoneDigits}
                    onChange={(e) => {
                      setRegPhoneDigits(formatNigerDigits(e.target.value));
                      setError('');
                    }}
                    placeholder="96 00 00 00"
                    className="w-full px-3.5 py-3 font-mono font-semibold text-base text-slate-900 focus:outline-none tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="reg-password"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  {t.motDePasse}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-password"
                    type="password"
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Minimum 4 caractères"
                    className="w-full rounded-2xl border border-slate-300 pl-10 pr-4 py-3 text-base text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="reg-referral"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  Code parrainage (optionnel · +200F chacun)
                </label>
                <div className="relative">
                  <Gift className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reg-referral"
                    type="text"
                    value={regReferralCode}
                    onChange={(e) => {
                      setRegReferralCode(e.target.value.toUpperCase());
                      setError('');
                    }}
                    placeholder="Ex: SAURI-IBR227"
                    className="w-full rounded-2xl border border-slate-300 pl-10 pr-4 py-3 font-mono text-sm uppercase text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
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

              <button
                type="submit"
                className="w-full min-h-[50px] rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-display font-bold text-base transition-colors cursor-pointer"
              >
                {t.creerMonCompte}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};
