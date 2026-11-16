import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { OPERATOR_CATALOGS } from '../data/operators';
import { TranslationStrings } from '../data/translations';
import { OperatorId, PendingCheckout, UserAccount } from '../types';
import { OperatorLogo } from './BrandLogos';
import { OperatorPage } from './OperatorPage';

interface MegaHubPageProps {
  user: UserAccount;
  t: TranslationStrings;
  initialOperatorId?: OperatorId;
  onBackHome: () => void;
  onOpenGiftMega?: (operatorId: OperatorId) => void;
  onProceedToPayment: (checkout: PendingCheckout) => void;
}

export const MegaHubPage: React.FC<MegaHubPageProps> = ({
  user,
  t,
  initialOperatorId = 'airtel',
  onBackHome,
  onOpenGiftMega,
  onProceedToPayment,
}) => {
  const [operatorId, setOperatorId] = useState<OperatorId>(initialOperatorId);

  return (
    <div className="space-y-5">
      {/* Quick Operator Selector Strip */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBackHome}
          className="min-w-[44px] min-h-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer shrink-0"
          aria-label={t.retour}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="grid grid-cols-4 gap-2 flex-1">
          {OPERATOR_CATALOGS.map((op) => {
            const active = op.id === operatorId;
            return (
              <button
                key={op.id}
                type="button"
                onClick={() => setOperatorId(op.id)}
                className={`min-h-[48px] rounded-2xl border-2 px-2 py-1.5 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  active
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <OperatorLogo operatorId={op.id} size="sm" />
                <span className="font-display font-bold text-xs hidden sm:inline truncate">
                  {op.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render exact OperatorPage for the selected operator */}
      <OperatorPage
        key={operatorId}
        operatorId={operatorId}
        userPhone={user.phone}
        hideBackButton
        onBack={onBackHome}
        onOpenGiftMega={onOpenGiftMega}
        onProceedToPayment={onProceedToPayment}
      />
    </div>
  );
};
