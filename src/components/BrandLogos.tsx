import React from 'react';
import { OperatorId } from '../types';

export const SauriMegaLogo: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect width="40" height="40" rx="11" fill="#FFFFFF" />
    <rect x="2" y="2" width="36" height="36" rx="9.5" fill="url(#sauri_blue)" />
    <path
      d="M22.5 8L12.5 21.5H20L17.5 32L27.5 18.5H20L22.5 8Z"
      fill="#FFFFFF"
      stroke="#FFFFFF"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <circle cx="30" cy="10" r="3" fill="#FACC15" stroke="#FFFFFF" strokeWidth="1.2" />
    <defs>
      <linearGradient id="sauri_blue" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563EB" />
        <stop offset="1" stopColor="#1E40AF" />
      </linearGradient>
    </defs>
  </svg>
);

export const OperatorLogo: React.FC<{ operatorId?: OperatorId; size?: 'sm' | 'md' | 'lg' }> = ({
  operatorId,
  size = 'md',
}) => {
  const boxSizes = {
    sm: 'w-10 h-10 rounded-xl',
    md: 'w-14 h-14 rounded-2xl',
    lg: 'w-16 h-16 rounded-2xl',
  };

  if (operatorId === 'airtel') {
    return (
      <div
        className={`${boxSizes[size]} bg-white border border-red-200 flex items-center justify-center shrink-0 shadow-xs`}
        aria-label="Logo Airtel"
      >
        <svg viewBox="0 0 48 48" className="w-[78%] h-[78%]" fill="none">
          <path
            d="M32.4 13.5C28.1 10.6 20.6 10.7 15.8 14.8C11.4 18.6 10.8 25.1 14.3 28.9C17.1 32 22.1 32.1 26.2 29.5C29.4 27.5 31.3 24.4 30.8 21.8C30.4 19.7 28.3 18.7 25.9 19.5C23.7 20.2 21.9 22 21.2 23.9C20.7 25.2 21.1 26.4 22.1 26.7C23 27 24.2 26.4 25.1 25.4"
            stroke="#E40000"
            strokeWidth="4.2"
            strokeLinecap="round"
          />
          <text
            x="24"
            y="42"
            textAnchor="middle"
            fill="#E40000"
            fontSize="10"
            fontWeight="800"
            fontFamily="Plus Jakarta Sans, sans-serif"
            letterSpacing="-0.3"
          >
            airtel
          </text>
        </svg>
      </div>
    );
  }

  if (operatorId === 'moov') {
    return (
      <div
        className={`${boxSizes[size]} bg-white border border-sky-200 flex items-center justify-center shrink-0 shadow-xs`}
        aria-label="Logo Moov Africa"
      >
        <svg viewBox="0 0 48 48" className="w-[82%] h-[82%]" fill="none">
          <circle cx="24" cy="18.5" r="10.5" fill="#005BAC" />
          <path
            d="M15.5 21C18.5 14 26 11.5 32.5 15"
            stroke="#FF6B00"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="29.5" cy="18" r="2.2" fill="#FFFFFF" />
          <text
            x="24"
            y="40.5"
            textAnchor="middle"
            fill="#005BAC"
            fontSize="7.5"
            fontWeight="800"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            Moov Africa
          </text>
        </svg>
      </div>
    );
  }

  if (operatorId === 'zamani') {
    return (
      <div
        className={`${boxSizes[size]} bg-white border border-fuchsia-200 flex items-center justify-center shrink-0 shadow-xs`}
        aria-label="Logo Zamani Telecom"
      >
        <svg viewBox="0 0 48 48" className="w-[82%] h-[82%]" fill="none">
          <path
            d="M13 11H35L19 28H35"
            stroke="#0055A4"
            strokeWidth="4.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 28H23L35 11"
            stroke="#DB2777"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="34" cy="30" r="3" fill="#F59E0B" />
          <text
            x="24"
            y="42"
            textAnchor="middle"
            fill="#0F172A"
            fontSize="7.4"
            fontWeight="800"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            Zamani
          </text>
        </svg>
      </div>
    );
  }

  if (operatorId === 'niger_telecom') {
    return (
      <div
        className={`${boxSizes[size]} bg-white border border-emerald-200 flex items-center justify-center shrink-0 shadow-xs`}
        aria-label="Logo Niger Telecom"
      >
        <svg viewBox="0 0 48 48" className="w-[84%] h-[84%]" fill="none">
          <circle cx="24" cy="18.5" r="10" stroke="#16A34A" strokeWidth="2.8" />
          <path d="M14.5 18.5H33.5" stroke="#EA580C" strokeWidth="2.6" strokeLinecap="round" />
          <path
            d="M24 8.5C27.5 12 27.5 25 24 28.5C20.5 25 20.5 12 24 8.5Z"
            stroke="#16A34A"
            strokeWidth="2.2"
          />
          <circle cx="24" cy="18.5" r="3" fill="#EA580C" />
          <text
            x="24"
            y="40.5"
            textAnchor="middle"
            fill="#15803D"
            fontSize="6.4"
            fontWeight="800"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            NIGER TELECOM
          </text>
        </svg>
      </div>
    );
  }

  if (operatorId === 'mtn_ng') {
    return (
      <div
        className={`${boxSizes[size]} bg-yellow-400 border border-yellow-500 flex items-center justify-center shrink-0 shadow-xs`}
        aria-label="Logo MTN Nigeria"
      >
        <svg viewBox="0 0 48 48" className="w-[82%] h-[82%]" fill="none">
          <ellipse cx="24" cy="24" rx="20" ry="12" stroke="#0F172A" strokeWidth="2.4" fill="#FACC15" />
          <text
            x="24"
            y="27.5"
            textAnchor="middle"
            fill="#0F172A"
            fontSize="11"
            fontWeight="900"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            MTN
          </text>
        </svg>
      </div>
    );
  }

  if (operatorId === 'glo_ng') {
    return (
      <div
        className={`${boxSizes[size]} bg-white border border-green-200 flex items-center justify-center shrink-0 shadow-xs`}
        aria-label="Logo Glo Nigeria"
      >
        <svg viewBox="0 0 48 48" className="w-[80%] h-[80%]" fill="none">
          <circle cx="24" cy="24" r="18" fill="#16A34A" />
          <text
            x="24"
            y="28"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="12"
            fontWeight="800"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            glo
          </text>
        </svg>
      </div>
    );
  }

  if (operatorId === 'airtel_ng') {
    return (
      <div
        className={`${boxSizes[size]} bg-white border border-red-200 flex items-center justify-center shrink-0 shadow-xs`}
        aria-label="Logo Airtel Nigeria"
      >
        <svg viewBox="0 0 48 48" className="w-[78%] h-[78%]" fill="none">
          <path
            d="M32.4 13.5C28.1 10.6 20.6 10.7 15.8 14.8C11.4 18.6 10.8 25.1 14.3 28.9C17.1 32 22.1 32.1 26.2 29.5C29.4 27.5 31.3 24.4 30.8 21.8C30.4 19.7 28.3 18.7 25.9 19.5C23.7 20.2 21.9 22 21.2 23.9C20.7 25.2 21.1 26.4 22.1 26.7C23 27 24.2 26.4 25.1 25.4"
            stroke="#E40000"
            strokeWidth="4.2"
            strokeLinecap="round"
          />
          <text
            x="24"
            y="42"
            textAnchor="middle"
            fill="#E40000"
            fontSize="10"
            fontWeight="800"
            fontFamily="Plus Jakarta Sans, sans-serif"
            letterSpacing="-0.3"
          >
            airtel
          </text>
        </svg>
      </div>
    );
  }

  if (operatorId === '9mobile_ng') {
    return (
      <div
        className={`${boxSizes[size]} bg-emerald-950 border border-emerald-700 flex items-center justify-center shrink-0 shadow-xs`}
        aria-label="Logo 9mobile"
      >
        <svg viewBox="0 0 48 48" className="w-[82%] h-[82%]" fill="none">
          <circle cx="17" cy="20" r="8" fill="#84CC16" />
          <text
            x="17"
            y="24"
            textAnchor="middle"
            fill="#052E16"
            fontSize="12"
            fontWeight="900"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            9
          </text>
          <text
            x="24"
            y="39"
            textAnchor="middle"
            fill="#ECFCCB"
            fontSize="8.5"
            fontWeight="800"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            9mobile
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`${boxSizes[size]} bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0`}
      aria-label="Logo Sauri Mega"
    >
      <SauriMegaLogo className="w-7 h-7" />
    </div>
  );
};
