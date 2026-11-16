import React, { useState } from 'react';
import { Globe, Plus, Shield, User, Wallet } from 'lucide-react';
import { formatNaira } from '../data/nigeria';
import { LANGUAGES, TranslationStrings } from '../data/translations';
import { CountryMode, LanguageCode, NavTab, UserAccount } from '../types';
import { SauriMegaLogo } from './BrandLogos';

interface HeaderProps {
  activeTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  onRechargeSolde: () => void;
  user: UserAccount;
  language: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  countryMode: CountryMode;
  onChangeCountryMode: (mode: CountryMode) => void;
  t: TranslationStrings;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onNavigate,
  onRechargeSolde,
  user,
  language,
  onChangeLanguage,
  countryMode,
  onChangeCountryMode,
  t,
}) => {
  const [imgError, setImgError] = useState(false);

  const desktopNav: { id: NavTab; label: string }[] =
    countryMode === 'NG'
      ? [
          { id: 'accueil', label: t.navAccueil },
          { id: 'credit', label: 'Airtime' },
          { id: 'mega', label: 'Data' },
          { id: 'recu', label: t.navRecu },
          { id: 'historique', label: t.navHistorique },
        ]
      : [
          { id: 'accueil', label: t.navAccueil },
          { id: 'credit', label: t.navCredit },
          { id: 'mega', label: t.navMega },
          { id: 'recu', label: t.navRecu },
          { id: 'historique', label: t.navHistorique },
        ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      {/* Top Country Selector Strip: Niger / Nigeria + Naira Balance */}
      <div className="bg-slate-50 border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-1.5 flex items-center justify-between gap-2">
          <div
            className="inline-flex items-center p-0.5 rounded-xl bg-slate-200/70 border border-slate-200"
            role="group"
            aria-label="Sélecteur de pays"
          >
            <button
              type="button"
              onClick={() => onChangeCountryMode('NE')}
              aria-pressed={countryMode === 'NE'}
              className={`min-h-[30px] px-2.5 sm:px-3 py-1 rounded-lg text-xs font-display font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                countryMode === 'NE'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span aria-hidden="true">🇳🇪</span>
              <span>Niger</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeCountryMode('NG')}
              aria-pressed={countryMode === 'NG'}
              className={`min-h-[30px] px-2.5 sm:px-3 py-1 rounded-lg text-xs font-display font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                countryMode === 'NG'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span aria-hidden="true">🇳🇬</span>
              <span>Nigeria</span>
            </button>
          </div>

          {countryMode === 'NG' && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-800">
              <Wallet className="w-3.5 h-3.5 text-blue-700 shrink-0" />
              <span className="hidden sm:inline text-blue-700">Naira :</span>
              <span className="font-mono font-extrabold tabular-nums">
                {formatNaira(user.soldeNGN ?? 0)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 md:h-16 flex items-center justify-between gap-3">
        {/* Left: Sauri Mega Logo */}
        <button
          type="button"
          onClick={() => onNavigate('accueil')}
          className="flex items-center gap-2 whitespace-nowrap shrink-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 cursor-pointer"
          aria-label="Accueil Sauri Mega"
        >
          <SauriMegaLogo className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
          <span className="font-display font-extrabold text-base sm:text-xl tracking-tight text-slate-900">
            Sauri <span className="text-orange-500">Mega</span>
          </span>
        </button>

        {/* Center: Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-5" aria-label="Navigation principale">
          {desktopNav.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`relative py-2 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'text-blue-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-blue-700" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Language Switcher + Black Recharger + Profile + Admin */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* 7-Language Selector */}
          <label className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-2 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => onChangeLanguage(e.target.value as LanguageCode)}
              aria-label="Langue"
              className="min-h-[36px] pl-6 pr-2 py-1 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </label>

          {/* Black Recharger Button */}
          <button
            type="button"
            onClick={onRechargeSolde}
            className="min-h-[38px] px-3 sm:px-4 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 active:scale-[0.98] text-white font-display font-bold text-xs sm:text-sm flex items-center gap-1 whitespace-nowrap shrink-0 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{t.recharger}</span>
          </button>

          {/* Admin Shortcut */}
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className={`min-w-[38px] min-h-[38px] rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            aria-label={t.navAdmin}
            title={t.navAdmin}
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Profile Avatar */}
          <button
            type="button"
            onClick={() => onNavigate('profil')}
            className={`min-w-[38px] min-h-[38px] flex items-center justify-center shrink-0 rounded-full cursor-pointer ${
              activeTab === 'profil' ? 'ring-2 ring-blue-600 ring-offset-1' : ''
            }`}
            aria-label={t.navProfil}
            title={t.navProfil}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-300 bg-blue-50 flex items-center justify-center">
              {!imgError && user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-blue-700" />
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
