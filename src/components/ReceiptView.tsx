import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Download,
  Receipt,
  Share2,
  XCircle,
} from 'lucide-react';
import { formatAmount, formatDateFr } from '../data/operators';
import { TranslationStrings } from '../data/translations';
import { Transaction } from '../types';
import { OperatorLogo } from './BrandLogos';

interface ReceiptCardProps {
  transaction: Transaction;
  t: TranslationStrings;
}

function drawReceiptPngDataUrl(tx: Transaction, t: TranslationStrings): string {
  const currency = tx.currency ?? (tx.country === 'NG' ? 'NGN' : 'FCFA');
  const canvas = document.createElement('canvas');
  canvas.width = 760;
  canvas.height = 960;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Top Blue Banner
  const grad = ctx.createLinearGradient(0, 0, canvas.width, 190);
  grad.addColorStop(0, '#1D4ED8');
  grad.addColorStop(1, '#1E40AF');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, 190);

  // Orange accent strip
  ctx.fillStyle = '#F97316';
  ctx.fillRect(0, 190, canvas.width, 10);

  // Header text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 42px sans-serif';
  ctx.fillText('Sauri Mega', 48, 86);

  ctx.fillStyle = '#DBEAFE';
  ctx.font = '600 22px sans-serif';
  ctx.fillText(t.recuTitre, 48, 128);

  // Reference pill text on right
  ctx.textAlign = 'right';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px monospace';
  ctx.fillText(tx.id, canvas.width - 48, 86);
  ctx.textAlign = 'left';

  // Status Banner
  const statusColor =
    tx.status === 'Validé'
      ? '#16A34A'
      : tx.status === 'Rejeté'
      ? '#DC2626'
      : '#EA580C';
  const statusLabel =
    tx.status === 'Validé'
      ? t.statutValide
      : tx.status === 'Rejeté'
      ? t.statutRejete
      : t.statutEnAttente;

  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(48, 236, canvas.width - 96, 120);
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 236, canvas.width - 96, 120);

  ctx.fillStyle = '#64748B';
  ctx.font = '600 20px sans-serif';
  ctx.fillText(t.montant, 76, 278);

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 42px sans-serif';
  ctx.fillText(formatAmount(tx.amountSent, currency), 76, 330);

  ctx.textAlign = 'right';
  ctx.fillStyle = statusColor;
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(statusLabel, canvas.width - 76, 305);
  ctx.textAlign = 'left';

  const serviceLabel = tx.bundleLabel
    ? tx.bundleLabel
    : tx.kind === 'recharge'
    ? 'Recharge Solde'
    : tx.kind === 'airtime'
    ? 'Airtime Nigeria'
    : tx.kind === 'data'
    ? 'Data Nigeria'
    : tx.kind === 'pin'
    ? 'Carte Recharge PIN'
    : 'Crédit Chap Chap';

  // Details Rows
  const rows: [string, string][] = [
    [t.operateur, tx.operatorName],
    [t.numero, tx.phoneNumber],
    ['Service', serviceLabel],
    ...(tx.rechargePin ? ([['PIN Recharge', tx.rechargePin]] as [string, string][]) : []),
    [t.montantEnvoye, formatAmount(tx.amountSent, currency)],
    [t.montantCredite, formatAmount(tx.amountCredited, currency)],
    [t.date, formatDateFr(tx.date)],
    [t.reference, tx.id],
  ];

  let y = 415;
  const rowStep = rows.length > 7 ? 58 : 66;
  rows.forEach(([label, value], index) => {
    ctx.fillStyle = '#64748B';
    ctx.font = '500 22px sans-serif';
    ctx.fillText(label, 52, y);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 23px sans-serif';
    ctx.fillText(value, canvas.width - 52, y);
    ctx.textAlign = 'left';

    if (index < rows.length - 1) {
      ctx.strokeStyle = '#F1F5F9';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(52, y + 22);
      ctx.lineTo(canvas.width - 52, y + 22);
      ctx.stroke();
    }
    y += rowStep;
  });

  // Footer
  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 18px sans-serif';
  ctx.fillText('Sauri Mega · +227 96 35 05 59', 52, 910);

  return canvas.toDataURL('image/png');
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({ transaction, t }) => {
  const [pngUrl, setPngUrl] = useState<string>('');
  const [shareNote, setShareNote] = useState<string>('');
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const url = drawReceiptPngDataUrl(transaction, t);
    if (mountedRef.current) setPngUrl(url);
    return () => {
      mountedRef.current = false;
    };
  }, [transaction, t]);

  const handleDownload = () => {
    const url = pngUrl || drawReceiptPngDataUrl(transaction, t);
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = `recu-sauri-mega-${transaction.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currency =
    transaction.currency ?? (transaction.country === 'NG' ? 'NGN' : 'FCFA');

  const whatsappMessage = [
    `*Sauri Mega — ${t.recuTitre}*`,
    `${t.reference}: ${transaction.id}`,
    `${t.operateur}: ${transaction.operatorName}`,
    `${t.numero}: ${transaction.phoneNumber}`,
    transaction.bundleLabel
      ? `Forfait: ${transaction.bundleLabel}`
      : 'Service: Crédit Chap Chap',
    ...(transaction.rechargePin
      ? [`PIN Carte Recharge: ${transaction.rechargePin}`]
      : []),
    `${t.montant}: ${formatAmount(transaction.amountSent, currency)}`,
    `${t.date}: ${formatDateFr(transaction.date)}`,
    `${t.statut}: ${transaction.status}`,
  ].join('\n');

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

  const handleNativeShare = async () => {
    if (navigator.share && pngUrl) {
      try {
        const res = await fetch(pngUrl);
        const blob = await res.blob();
        const file = new File([blob], `recu-sauri-mega-${transaction.id}.png`, {
          type: 'image/png',
        });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Sauri Mega - ${transaction.id}`,
            text: whatsappMessage,
            files: [file],
          });
          return;
        }
      } catch {
        // Fallback to WhatsApp link below
      }
    }
    setShareNote('Ouverture de WhatsApp...');
    window.setTimeout(() => setShareNote(''), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Visual Receipt Card */}
      <article className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="bg-blue-700 text-white px-5 py-4 flex items-center justify-between gap-3 border-b-4 border-orange-500">
          <div className="flex items-center gap-2.5">
            <Receipt className="w-5 h-5 text-orange-300" />
            <div>
              <h3 className="font-display font-extrabold text-base leading-tight">
                Sauri Mega · {t.recuTitre}
              </h3>
              <p className="text-[11px] font-mono text-blue-100">{transaction.id}</p>
            </div>
          </div>
          <OperatorLogo operatorId={transaction.operatorId} size="sm" />
        </div>

        <div className="p-5 space-y-4">
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-center justify-between gap-3">
            <div>
              <span className="block text-xs text-slate-500">{t.montant}</span>
              <span className="font-display font-extrabold text-2xl text-slate-900 tabular-nums">
                {formatAmount(transaction.amountSent, currency)}
              </span>
            </div>

            {transaction.status === 'Validé' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.statutValide}</span>
              </span>
            )}
            {transaction.status === 'Rejeté' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600">
                <XCircle className="w-4 h-4" />
                <span>{t.statutRejete}</span>
              </span>
            )}
            {transaction.status === 'En attente' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600">
                <Clock className="w-4 h-4" />
                <span>{t.statutEnAttente}</span>
              </span>
            )}
          </div>

          <dl className="divide-y divide-slate-100 text-sm">
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="text-slate-500">{t.numero}</dt>
              <dd className="font-mono font-bold text-slate-900 tabular-nums">
                {transaction.phoneNumber}
              </dd>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="text-slate-500">{t.operateur}</dt>
              <dd className="font-bold text-slate-900">{transaction.operatorName}</dd>
            </div>
            {transaction.bundleLabel && (
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-slate-500">
                  {transaction.isGift ? 'Cadeau envoyé' : 'Forfait'}
                </dt>
                <dd className="font-bold text-slate-900">{transaction.bundleLabel}</dd>
              </div>
            )}
            {transaction.rechargePin && (
              <div className="py-2.5 flex items-center justify-between gap-4">
                <dt className="text-slate-500">PIN Carte Recharge</dt>
                <dd className="font-mono font-extrabold text-blue-700 tabular-nums">
                  {transaction.rechargePin}
                </dd>
              </div>
            )}
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="text-slate-500">{t.montant}</dt>
              <dd className="font-display font-extrabold text-orange-600 tabular-nums">
                {formatAmount(transaction.amountSent, currency)}
              </dd>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="text-slate-500">{t.date}</dt>
              <dd className="font-medium text-slate-900">{formatDateFr(transaction.date)}</dd>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="text-slate-500">{t.reference}</dt>
              <dd className="font-mono font-bold text-blue-700">{transaction.id}</dd>
            </div>
          </dl>
        </div>
      </article>

      {/* Download PNG + Share WhatsApp Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleDownload}
          className="min-h-[50px] rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-display font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{t.telechargerImage}</span>
        </button>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleNativeShare}
          className="min-h-[50px] rounded-2xl bg-green-600 hover:bg-green-700 text-white font-display font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>{t.partagerWhatsapp}</span>
        </a>
      </div>

      {shareNote && (
        <p className="text-xs text-center text-slate-500">{shareNote}</p>
      )}
    </div>
  );
};

interface ReceiptPageProps {
  transactions: Transaction[];
  t: TranslationStrings;
  onGoHome: () => void;
}

export const ReceiptPage: React.FC<ReceiptPageProps> = ({
  transactions,
  t,
  onGoHome,
}) => {
  const [selectedId, setSelectedId] = useState<string>(transactions[0]?.id ?? '');
  const activeTx =
    transactions.find((tx) => tx.id === selectedId) ?? transactions[0] ?? null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
            {t.recuTitre}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Téléchargez ou partagez votre reçu officiel sur WhatsApp
          </p>
        </div>
      </div>

      {!activeTx ? (
        <section className="rounded-3xl bg-white border border-slate-200 p-8 text-center space-y-4">
          <Receipt className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-sm text-slate-600">
            Aucun reçu disponible pour le moment. Effectuez un achat de Crédit ou de Mega.
          </p>
          <button
            type="button"
            onClick={onGoHome}
            className="min-h-[48px] px-6 py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-display font-bold text-sm cursor-pointer"
          >
            {t.navAccueil}
          </button>
        </section>
      ) : (
        <>
          {transactions.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {transactions.slice(0, 6).map((tx) => {
                const isSelected = tx.id === activeTx.id;
                return (
                  <button
                    key={tx.id}
                    type="button"
                    onClick={() => setSelectedId(tx.id)}
                    className={`min-h-[42px] px-3.5 py-2 rounded-xl border text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {tx.operatorName} ·{' '}
                    {formatAmount(
                      tx.amountSent,
                      tx.currency ?? (tx.country === 'NG' ? 'NGN' : 'FCFA')
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <ReceiptCard transaction={activeTx} t={t} />
        </>
      )}
    </div>
  );
};
