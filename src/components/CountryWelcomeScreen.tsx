import React, { useMemo, useState } from 'react';
import { ArrowLeft, Check, Search } from 'lucide-react';
import { AFRICAN_COUNTRIES, AfricanCountry } from '../data/countries';
import { SauriMegaLogo } from './BrandLogos';

interface CountryWelcomeScreenProps {
  initialCountry?: AfricanCountry | null;
  onComplete: (country: AfricanCountry, localPhoneNumber: string) => void;
}

export const CountryWelcomeScreen: React.FC<CountryWelcomeScreenProps> = ({
  initialCountry,
  onComplete,
}) => {
  const [step, setStep] = useState<'country' | 'phone'>('country');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<AfricanCountry | null>(
    initialCountry ?? null
  );
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const filteredCountries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return AFRICAN_COUNTRIES;
    return AFRICAN_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleContinue = () => {
    if (!selectedCountry) return;
    setPhoneError('');
    setStep('phone');
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCountry) return;
    const digitsOnly = phoneInput.replace(/\D/g, '');
    if (digitsOnly.length < 6) {
      setPhoneError('Veuillez saisir un numéro de téléphone valide.');
      return;
    }
    const formattedDigits = digitsOnly.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
    onComplete(selectedCountry, `${selectedCountry.dialCode} ${formattedDigits}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Blue Header matching Sauri Mega style */}
      <header className="bg-blue-700 text-white py-5 px-4 shadow-xs">
        <div className="max-w-lg mx-auto flex flex-col items-center text-center gap-2.5">
          <SauriMegaLogo className="w-12 h-12 shadow-sm" />
          <div>
            <h1 className="font-display font-extrabold text-2xl tracking-tight">
              Bienvenue sur Sauri <span className="text-amber-300">Mega</span>
            </h1>
            <p className="text-sm text-blue-100 mt-0.5 font-medium">
              Choisissez votre pays / Ka zabi kasar da kake
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-slate-50/70 px-4 py-6 flex justify-center items-start">
        {step === 'country' ? (
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col gap-4">
            {/* Search bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un pays..."
                aria-label="Rechercher un pays..."
                className="w-full rounded-2xl border border-slate-300 pl-10 pr-4 py-3 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            {/* Scrollable Country List */}
            <div
              className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white"
              role="listbox"
              aria-label="Liste des pays africains"
            >
              {filteredCountries.length === 0 ? (
                <div className="py-10 px-4 text-center text-sm text-slate-500">
                  Aucun pays trouvé pour « {searchQuery} ».
                </div>
              ) : (
                filteredCountries.map((country) => {
                  const isSelected = selectedCountry?.code === country.code;
                  return (
                    <button
                      key={country.code}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => setSelectedCountry(country)}
                      className={`w-full min-h-[54px] px-4 py-3 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/80'
                          : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl leading-none shrink-0" aria-hidden="true">
                          {country.flag}
                        </span>
                        <span className="font-display font-bold text-sm sm:text-base text-slate-900 truncate">
                          {country.name}
                        </span>
                        <span className="font-mono text-xs sm:text-sm font-semibold text-slate-500 tabular-nums shrink-0">
                          {country.dialCode}
                        </span>
                      </div>

                      {isSelected && (
                        <span
                          className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0"
                          aria-label="Sélectionné"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Continuer / Ci gaba button */}
            {selectedCountry && (
              <button
                type="button"
                onClick={handleContinue}
                className="w-full min-h-[52px] rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-display font-extrabold text-base shadow-xs transition-all cursor-pointer"
              >
                Continuer / Ci gaba
              </button>
            )}
          </div>
        ) : (
          /* Step 2: Phone Number with fixed country code */
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep('country');
                  setPhoneError('');
                }}
                className="min-w-[44px] min-h-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer"
                aria-label="Changer de pays"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="font-display font-extrabold text-lg sm:text-xl text-slate-900">
                  {selectedCountry?.flag} {selectedCountry?.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Entrez votre numéro de téléphone
                </p>
              </div>
            </div>

            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="flex items-stretch rounded-2xl border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20 overflow-hidden bg-white">
                <div className="px-4 bg-slate-50 border-r border-slate-200 flex items-center gap-2 font-mono font-bold text-base text-slate-900 shrink-0 select-none">
                  <span aria-hidden="true">{selectedCountry?.flag}</span>
                  <span>{selectedCountry?.dialCode}</span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoFocus
                  value={phoneInput}
                  onChange={(e) => {
                    setPhoneInput(e.target.value.replace(/[^\d\s]/g, ''));
                    setPhoneError('');
                  }}
                  placeholder="96 00 00 00"
                  aria-label="Numéro de téléphone"
                  className="w-full px-4 py-3.5 font-mono font-semibold text-lg text-slate-900 placeholder:text-slate-400 focus:outline-none tabular-nums"
                />
              </div>

              {phoneError && (
                <div
                  role="alert"
                  className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm font-medium text-red-700"
                >
                  {phoneError}
                </div>
              )}

              <button
                type="submit"
                className="w-full min-h-[52px] rounded-2xl bg-blue-700 hover:bg-blue-800 active:scale-[0.99] text-white font-display font-extrabold text-base shadow-xs transition-all cursor-pointer"
              >
                Entrer / Shiga
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
