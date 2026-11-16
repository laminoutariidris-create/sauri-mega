import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Clock,
  Copy,
  FileImage,
  Info,
  Upload,
  X,
} from 'lucide-react';
import {
  PAYMENT_MERCHANT_NUMBER,
  calculateRiba,
  formatAmount,
} from '../data/operators';
import { TranslationStrings } from '../data/translations';
import { PendingCheckout, Transaction } from '../types';
import { OperatorLogo } from './BrandLogos';
import { ReceiptCard } from './ReceiptView';

interface PaymentSheetProps {
  checkout: PendingCheckout;
  t: TranslationStrings;
  onCancel: () => void;
  onUploadComplete: (
    checkout: PendingCheckout,
    screenshotUrl: string,
    screenshotName: string
  ) => Transaction;
  onViewHistory: () => void;
  onBackHome: () => void;
}

export const PaymentSheet: React.FC<PaymentSheetProps> = ({
  checkout,
  t,
  onCancel,
  onUploadComplete,
  onViewHistory,
  onBackHome,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [uploadedTx, setUploadedTx] = useState<Transaction | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const [isReading, setIsReading] = useState(false);

  const riba = calculateRiba(checkout.amountSent);
  const currency =
    checkout.currency ?? (checkout.country === 'NG' ? 'NGN' : 'FCFA');

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_MERCHANT_NUMBER);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Veuillez sélectionner une image (PNG, JPG, WEBP).');
      return;
    }

    setUploadError('');
    setIsReading(true);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      setPreviewUrl(dataUrl);
      const created = onUploadComplete(checkout, dataUrl, file.name);
      setUploadedTx(created);
      setIsReading(false);
    };
    reader.onerror = () => {
      setUploadError('Impossible de lire le fichier. Veuillez réessayer.');
      setIsReading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {!uploadedTx && (
            <button
              type="button"
              onClick={onCancel}
              className="min-w-[44px] min-h-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 cursor-pointer"
              aria-label={t.retour}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="font-display font-extrabold text-2xl text-slate-900">
              {uploadedTx ? t.enAttenteValidation : 'Paiement & RIBA'}
            </h1>
            <p className="text-sm text-slate-500">
              {uploadedTx ? `${t.reference} ${uploadedTx.id}` : 'Recup par Image'}
            </p>
          </div>
        </div>

        {!uploadedTx && (
          <button
            type="button"
            onClick={onCancel}
            className="min-w-[44px] min-h-[44px] rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {uploadedTx ? (
        <div className="space-y-6">
          {/* Status Banner */}
          <section className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center mx-auto">
              <Clock className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h2 className="font-display font-extrabold text-2xl text-orange-600">
                {t.enAttenteValidation}
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Votre capture d'écran a été transmise. Montant crédité après validation :{' '}
                <strong className="text-slate-900 tabular-nums">
                  {formatAmount(uploadedTx.amountCredited, currency)}
                </strong>{' '}
                (frais 4% : {formatAmount(uploadedTx.profitFee, currency)}).
              </p>
              {uploadedTx.rechargePin && (
                <div className="mt-2 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-mono font-bold text-slate-900">
                  <span>PIN Carte Recharge :</span>
                  <span className="text-blue-700">{uploadedTx.rechargePin}</span>
                </div>
              )}
            </div>

            {previewUrl && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 max-w-xs mx-auto">
                <img
                  src={previewUrl}
                  alt="Capture d'écran envoyée"
                  className="w-full max-h-40 object-contain rounded-xl"
                />
                <p className="mt-1.5 text-xs text-slate-500 truncate flex items-center justify-center gap-1.5">
                  <FileImage className="w-3.5 h-3.5 shrink-0" />
                  <span>{uploadedTx.screenshotName || 'Capture envoyée'}</span>
                </p>
              </div>
            )}
          </section>

          {/* Reçu par image with Télécharger image & Partager WhatsApp */}
          <ReceiptCard transaction={uploadedTx} t={t} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onViewHistory}
              className="min-h-[48px] rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-display font-bold text-sm transition-colors cursor-pointer"
            >
              {t.navHistorique}
            </button>
            <button
              type="button"
              onClick={onBackHome}
              className="min-h-[48px] rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 font-display font-bold text-sm transition-colors cursor-pointer"
            >
              {t.navAccueil}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* BIG Merchant Payment Number Card */}
          <section className="rounded-3xl bg-blue-700 text-white p-6 sm:p-7 shadow-sm space-y-4">
            <p className="text-sm sm:text-base font-semibold text-blue-50">
              {t.envoyerArgentText}
            </p>

            <div className="rounded-2xl bg-white text-slate-900 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="block text-xs font-semibold text-slate-500">
                  Numéro officiel de dépôt
                </span>
                <span className="font-mono font-extrabold text-2xl sm:text-3xl tracking-tight text-blue-700 tabular-nums">
                  {PAYMENT_MERCHANT_NUMBER}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyNumber}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-display font-bold text-sm flex items-center justify-center gap-2 shrink-0 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Numéro copié</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copier</span>
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Summary + RIBA 4% Rule */}
          <section className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3 min-w-0">
                <OperatorLogo operatorId={checkout.operatorId} size="sm" />
                <div className="min-w-0">
                  <p className="font-display font-bold text-base text-slate-900 truncate">
                    {checkout.bundleLabel
                      ? `${checkout.operatorName} · ${checkout.bundleLabel}${
                          checkout.isGift ? ' (Cadeau Mega)' : ''
                        }`
                      : checkout.kind === 'recharge'
                      ? checkout.country === 'NG'
                        ? 'Recharge Wallet Nigeria (₦)'
                        : 'Recharge Solde Sauri Mega'
                      : checkout.kind === 'airtime'
                      ? `Airtime Nigeria · ${checkout.operatorName}`
                      : checkout.kind === 'data'
                      ? `Data Nigeria · ${checkout.operatorName}`
                      : checkout.kind === 'pin'
                      ? `Carte Recharge PIN · ${checkout.operatorName}`
                      : `${t.creditChapChap} · ${checkout.operatorName}`}
                  </p>
                  <p className="font-mono text-xs sm:text-sm text-slate-600 mt-0.5 tabular-nums">
                    {checkout.isGift ? 'Bénéficiaire' : t.numero} : {checkout.phoneNumber}
                  </p>
                  {checkout.rechargePin && (
                    <p className="font-mono text-xs font-bold text-blue-700 mt-1 tabular-nums">
                      PIN Carte Recharge : {checkout.rechargePin}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
              <div className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-slate-800">
                <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>
                  Règle RIBA : Vous envoyez {formatAmount(riba.amountSent, currency)}, vous recevrez{' '}
                  {formatAmount(riba.amountSent, currency)} - 4% soit{' '}
                  <strong className="text-green-600">
                    {formatAmount(riba.amountCredited, currency)}
                  </strong>{' '}
                  dans votre solde.
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center">
                <div>
                  <span className="block text-[11px] text-slate-500">{t.montantEnvoye}</span>
                  <span className="font-display font-extrabold text-sm sm:text-base text-slate-900 tabular-nums">
                    {formatAmount(riba.amountSent, currency)}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500">{t.profit} 4%</span>
                  <span className="font-display font-extrabold text-sm sm:text-base text-blue-700 tabular-nums">
                    {formatAmount(riba.profitFee, currency)}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500">{t.montantCredite}</span>
                  <span className="font-display font-extrabold text-sm sm:text-base text-green-600 tabular-nums">
                    {formatAmount(riba.amountCredited, currency)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Recup par Image Upload */}
          <section className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
              id="recup-image-input"
            />

            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
              <Upload className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="font-display font-bold text-lg text-slate-900">
                Recup par Image
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Sélectionnez la capture d'écran ou la photo du SMS de paiement depuis votre galerie.
              </p>
            </div>

            {uploadError && (
              <p role="alert" className="text-sm font-medium text-red-600">
                {uploadError}
              </p>
            )}

            <button
              type="button"
              disabled={isReading}
              onClick={() => fileInputRef.current?.click()}
              className="w-full min-h-[54px] rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 active:scale-[0.99] text-white font-display font-extrabold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer px-4"
            >
              <Upload className="w-5 h-5 shrink-0" />
              <span>{isReading ? 'Envoi en cours...' : t.recupParImageBtn}</span>
            </button>
          </section>
        </div>
      )}
    </div>
  );
};
