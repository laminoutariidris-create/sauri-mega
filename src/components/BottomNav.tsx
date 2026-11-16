import React from 'react';
import { Clock, Receipt, Smartphone, Wifi } from 'lucide-react';
import { TranslationStrings } from '../data/translations';
import { CountryMode, NavTab } from '../types';

interface BottomNavProps {
  activeTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  countryMode?: CountryMode;
  t: TranslationStrings;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onNavigate,
  countryMode = 'NE',
  t,
}) => {
  const tabs: { id: NavTab; label: string; Icon: React.FC<{ className?: string }> }[] =
    countryMode === 'NG'
      ? [
          { id: 'credit', label: 'Airtime', Icon: Smartphone },
          { id: 'mega', label: 'Data', Icon: Wifi },
          { id: 'recu', label: t.navRecu, Icon: Receipt },
          { id: 'historique', label: t.navHistorique, Icon: Clock },
        ]
      : [
          { id: 'credit', label: t.navCredit, Icon: Smartphone },
          { id: 'mega', label: t.navMega, Icon: Wifi },
          { id: 'recu', label: t.navRecu, Icon: Receipt },
          { id: 'historique', label: t.navHistorique, Icon: Clock },
        ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe"
      aria-label="Navigation mobile"
    >
      <div className="grid grid-cols-4 items-center h-[60px] max-w-lg mx-auto px-2">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = activeTab === id || (activeTab === 'accueil' && id === 'credit');
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className={`min-h-[44px] flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer ${
                isActive
                  ? 'text-blue-700'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`w-[21px] h-[21px] transition-transform duration-150 ${
                  isActive ? 'scale-105 stroke-[2.4]' : 'stroke-[1.9]'
                }`}
              />
              <span
                className={`text-[11px] mt-0.5 tracking-tight whitespace-nowrap ${
                  isActive ? 'font-bold text-blue-700' : 'font-medium'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
