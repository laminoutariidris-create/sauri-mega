/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AdminPage } from './components/AdminPage';
import { AuthPage } from './components/AuthPage';
import { BottomNav } from './components/BottomNav';
import { CountryWelcomeScreen } from './components/CountryWelcomeScreen';
import { CreditHubPage } from './components/CreditHubPage';
import { GiftMegaModal } from './components/GiftMegaModal';
import { Header } from './components/Header';
import { HistoryPage } from './components/HistoryPage';
import { HomePage } from './components/HomePage';
import { MegaHubPage } from './components/MegaHubPage';
import { NigeriaPage, NigeriaServiceTab } from './components/NigeriaPage';
import { OperatorPage } from './components/OperatorPage';
import { PaymentSheet } from './components/PaymentSheet';
import { ProfilePage } from './components/ProfilePage';
import { ReceiptPage } from './components/ReceiptView';
import { RechargePage } from './components/RechargePage';
import { AfricanCountry } from './data/countries';
import {
  INITIAL_TRANSACTIONS,
  INITIAL_USERS,
  REFERRAL_BONUS_AMOUNT,
  buildReferralCode,
  calculateRiba,
} from './data/operators';
import { LANGUAGES, TRANSLATIONS } from './data/translations';
import {
  CountryMode,
  LanguageCode,
  NavTab,
  OperatorId,
  PendingCheckout,
  Transaction,
  UserAccount,
} from './types';

const STORAGE_KEYS = {
  users: 'sauri_mega_users_v2',
  currentUserId: 'sauri_mega_current_user_id_v2',
  transactions: 'sauri_mega_transactions_v2',
  adminLoggedIn: 'sauri_mega_admin_logged_in_v2',
  language: 'sauri_mega_lang_v2',
  country: 'sauri_mega_country_v1',
  countryMode: 'sauri_mega_country_mode_v1',
};

function normalizeUsers(list: UserAccount[]): UserAccount[] {
  return list.map((u) => ({
    ...u,
    soldeNGN: u.soldeNGN ?? 0,
    referralCode: u.referralCode || buildReferralCode(u.name, u.id),
    referralCount: u.referralCount ?? 0,
  }));
}

export default function App() {
  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.users);
      if (saved) {
        const parsed = JSON.parse(saved) as UserAccount[];
        if (Array.isArray(parsed) && parsed.length > 0) return normalizeUsers(parsed);
      }
    } catch {
      // Fallback to initial users
    }
    return normalizeUsers(INITIAL_USERS);
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.currentUserId);
    } catch {
      return null;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.transactions);
      if (saved) {
        const parsed = JSON.parse(saved) as Transaction[];
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback to initial transactions
    }
    return INITIAL_TRANSACTIONS;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.adminLoggedIn) === 'true';
    } catch {
      return false;
    }
  });

  const [language, setLanguage] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.language) as LanguageCode | null;
      if (saved && saved in TRANSLATIONS) return saved;
    } catch {
      // Fallback to French
    }
    return 'fr';
  });

  const [selectedCountry, setSelectedCountry] = useState<AfricanCountry | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.country);
      return saved ? (JSON.parse(saved) as AfricanCountry) : null;
    } catch {
      return null;
    }
  });
  const [isChangingCountry, setIsChangingCountry] = useState<boolean>(false);

  const [countryMode, setCountryMode] = useState<CountryMode>(() => {
    try {
      const savedMode = localStorage.getItem(STORAGE_KEYS.countryMode);
      if (savedMode === 'NE' || savedMode === 'NG') return savedMode;
      const savedCountry = localStorage.getItem(STORAGE_KEYS.country);
      if (savedCountry) {
        const parsed = JSON.parse(savedCountry) as AfricanCountry;
        if (parsed?.code === 'NG') return 'NG';
      }
    } catch {
      // Fallback to Niger
    }
    return 'NE';
  });
  const [nigeriaService, setNigeriaService] = useState<NigeriaServiceTab>('airtime');

  const [activeTab, setActiveTab] = useState<NavTab>('accueil');
  const [selectedOperatorId, setSelectedOperatorId] = useState<OperatorId | null>(null);
  const [isRecharging, setIsRecharging] = useState<boolean>(false);
  const [giftModalOperator, setGiftModalOperator] = useState<OperatorId | null>(null);
  const [pendingCheckout, setPendingCheckout] = useState<PendingCheckout | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    } catch {
      // Ignore storage quota errors
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUserId) {
        localStorage.setItem(STORAGE_KEYS.currentUserId, currentUserId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.currentUserId);
      }
    } catch {
      // Ignore storage errors
    }
  }, [currentUserId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
    } catch {
      // Ignore storage quota errors
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.adminLoggedIn, String(isAdminLoggedIn));
    } catch {
      // Ignore storage errors
    }
  }, [isAdminLoggedIn]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.language, language);
    } catch {
      // Ignore storage errors
    }
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.countryMode, countryMode);
    } catch {
      // Ignore storage errors
    }
  }, [countryMode]);

  const t = TRANSLATIONS[language];
  const langDir = LANGUAGES.find((l) => l.code === language)?.dir ?? 'ltr';
  const currentUser = users.find((u) => u.id === currentUserId) ?? null;

  const handleLogin = (email: string, password: string): string | null => {
    if (email.toLowerCase() === 'admin@saurimega.com' && password === 'admin123') {
      setCurrentUserId(users[0]?.id ?? null);
      setIsAdminLoggedIn(true);
      setActiveTab('admin');
      setSelectedOperatorId(null);
      setIsRecharging(false);
      setPendingCheckout(null);
      return null;
    }

    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      return 'Email ou mot de passe incorrect.';
    }
    setCurrentUserId(found.id);
    setActiveTab('accueil');
    setSelectedOperatorId(null);
    setIsRecharging(false);
    setPendingCheckout(null);
    return null;
  };

  const handleRegister = (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    referralCode?: string;
  }): string | null => {
    const exists = users.some(
      (u) => u.email.toLowerCase() === payload.email.toLowerCase()
    );
    if (exists) {
      return 'Un compte existe déjà avec cet email.';
    }

    const cleanCode = payload.referralCode?.trim().toUpperCase() || '';
    const referrer = cleanCode
      ? users.find(
          (u) =>
            (u.referralCode || buildReferralCode(u.name, u.id)).toUpperCase() ===
            cleanCode
        )
      : undefined;

    if (cleanCode && !referrer) {
      return 'Code parrainage invalide. Vérifiez le code ou laissez le champ vide.';
    }

    const newId = `user-${Date.now()}`;
    const newUser: UserAccount = {
      id: newId,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      solde: referrer ? REFERRAL_BONUS_AMOUNT : 0,
      soldeNGN: 0,
      avatarUrl: '/src/assets/images/user_avatar_1794508186869.jpg',
      referralCode: buildReferralCode(payload.name, newId),
      referredBy: referrer?.id,
      referralCount: 0,
    };

    setUsers((prev) => {
      const updated = referrer
        ? prev.map((u) =>
            u.id === referrer.id
              ? {
                  ...u,
                  solde: u.solde + REFERRAL_BONUS_AMOUNT,
                  referralCount: (u.referralCount ?? 0) + 1,
                }
              : u
          )
        : prev;
      return [...updated, newUser];
    });
    setCurrentUserId(newUser.id);
    setActiveTab('accueil');
    setSelectedOperatorId(null);
    setIsRecharging(false);
    setGiftModalOperator(null);
    setPendingCheckout(null);
    return null;
  };

  const handleApplyReferralCode = (
    rawCode: string
  ): { ok: boolean; message: string } => {
    if (!currentUser) {
      return { ok: false, message: 'Session introuvable.' };
    }
    if (currentUser.referredBy) {
      return {
        ok: false,
        message: 'Vous avez déjà bénéficié d’un code parrainage.',
      };
    }

    const cleanCode = rawCode.trim().toUpperCase();
    if (!cleanCode) {
      return { ok: false, message: 'Veuillez entrer un code parrainage.' };
    }

    const ownCode = (
      currentUser.referralCode || buildReferralCode(currentUser.name, currentUser.id)
    ).toUpperCase();
    if (cleanCode === ownCode) {
      return {
        ok: false,
        message: 'Vous ne pouvez pas utiliser votre propre code parrainage.',
      };
    }

    const referrer = users.find(
      (u) =>
        (u.referralCode || buildReferralCode(u.name, u.id)).toUpperCase() ===
        cleanCode
    );
    if (!referrer) {
      return { ok: false, message: 'Code parrainage introuvable.' };
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            solde: u.solde + REFERRAL_BONUS_AMOUNT,
            referredBy: referrer.id,
          };
        }
        if (u.id === referrer.id) {
          return {
            ...u,
            solde: u.solde + REFERRAL_BONUS_AMOUNT,
            referralCount: (u.referralCount ?? 0) + 1,
          };
        }
        return u;
      })
    );

    return {
      ok: true,
      message: `Bravo ! Vous et ${referrer.name} avez reçu ${REFERRAL_BONUS_AMOUNT} F dans votre Wallet.`,
    };
  };

  const handleChangeCountryMode = (mode: CountryMode) => {
    setCountryMode(mode);
    setSelectedOperatorId(null);
    setIsRecharging(false);
    setGiftModalOperator(null);
    setPendingCheckout(null);
    if (mode === 'NG') {
      if (activeTab === 'credit') {
        setNigeriaService('airtime');
      } else if (activeTab === 'mega') {
        setNigeriaService('data');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (tab: NavTab) => {
    setActiveTab(tab);
    if (countryMode === 'NG') {
      if (tab === 'credit') setNigeriaService('airtime');
      if (tab === 'mega') setNigeriaService('data');
    }
    setSelectedOperatorId(null);
    setIsRecharging(false);
    setGiftModalOperator(null);
    setPendingCheckout(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUploadComplete = (
    checkout: PendingCheckout,
    screenshotUrl: string,
    screenshotName: string
  ): Transaction => {
    const riba = calculateRiba(checkout.amountSent);
    const activeUser = currentUser ?? users[0];
    const txCountry = checkout.country ?? countryMode;
    const txCurrency = checkout.currency ?? (txCountry === 'NG' ? 'NGN' : 'FCFA');

    const newTx: Transaction = {
      id: `TX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      userId: activeUser.id,
      userName: activeUser.name,
      userEmail: activeUser.email,
      kind: checkout.kind,
      country: txCountry,
      currency: txCurrency,
      operatorId: checkout.operatorId,
      operatorName: checkout.operatorName,
      phoneNumber: checkout.phoneNumber,
      bundleLabel: checkout.bundleLabel,
      rechargePin: checkout.rechargePin,
      isGift: checkout.isGift,
      amountSent: riba.amountSent,
      amountCredited: riba.amountCredited,
      profitFee: riba.profitFee,
      status: 'En attente',
      screenshotUrl,
      screenshotName,
    };

    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  };

  const handleUpdateProfile = (updates: Partial<UserAccount>) => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...updates } : u))
    );
  };

  const handleLogout = () => {
    setCurrentUserId(null);
    setSelectedOperatorId(null);
    setIsRecharging(false);
    setPendingCheckout(null);
    setActiveTab('accueil');
  };

  const handleValidateTransaction = (txId: string) => {
    const target = transactions.find((tItem) => tItem.id === txId);
    if (!target || target.status !== 'En attente') return;

    setTransactions((prev) =>
      prev.map((tItem) => (tItem.id === txId ? { ...tItem, status: 'Validé' } : tItem))
    );

    setUsers((prev) =>
      prev.map((u) => {
        if (
          u.id === target.userId ||
          u.email.toLowerCase() === target.userEmail.toLowerCase()
        ) {
          if (target.currency === 'NGN' || target.country === 'NG') {
            return { ...u, soldeNGN: (u.soldeNGN ?? 0) + target.amountCredited };
          }
          return { ...u, solde: u.solde + target.amountCredited };
        }
        return u;
      })
    );
  };

  const handleRejectTransaction = (txId: string) => {
    setTransactions((prev) =>
      prev.map((tItem) =>
        tItem.id === txId && tItem.status === 'En attente'
          ? { ...tItem, status: 'Rejeté' }
          : tItem
      )
    );
  };

  const handleCountryComplete = (country: AfricanCountry, fullPhone: string) => {
    setSelectedCountry(country);
    if (country.code === 'NG') {
      setCountryMode('NG');
    } else if (country.code === 'NE') {
      setCountryMode('NE');
    }
    try {
      localStorage.setItem(STORAGE_KEYS.country, JSON.stringify(country));
    } catch {
      // Ignore storage errors
    }

    const targetId = currentUserId ?? users[0]?.id ?? null;
    if (targetId) {
      setUsers((prev) =>
        prev.map((u) => (u.id === targetId ? { ...u, phone: fullPhone } : u))
      );
      setCurrentUserId(targetId);
    }

    setIsChangingCountry(false);
    setActiveTab('accueil');
    setSelectedOperatorId(null);
    setIsRecharging(false);
    setPendingCheckout(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!selectedCountry || isChangingCountry) {
    return (
      <div dir={langDir}>
        <CountryWelcomeScreen
          initialCountry={selectedCountry}
          onComplete={handleCountryComplete}
        />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div dir={langDir}>
        <AuthPage
          language={language}
          onChangeLanguage={setLanguage}
          t={t}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      </div>
    );
  }

  const userTransactions = transactions.filter(
    (tItem) =>
      tItem.userId === currentUser.id ||
      tItem.userEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  return (
    <div dir={langDir} className="min-h-screen bg-white flex flex-col">
      <Header
        activeTab={activeTab}
        onNavigate={navigateTo}
        onRechargeSolde={() => {
          setActiveTab('accueil');
          setSelectedOperatorId(null);
          setPendingCheckout(null);
          setIsRecharging(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={currentUser}
        language={language}
        onChangeLanguage={setLanguage}
        countryMode={countryMode}
        onChangeCountryMode={handleChangeCountryMode}
        t={t}
      />

      <main className="flex-1 bg-slate-50/60">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-5 sm:pt-7 pb-24 lg:pb-12">
          {pendingCheckout ? (
            <PaymentSheet
              checkout={pendingCheckout}
              t={t}
              onCancel={() => setPendingCheckout(null)}
              onUploadComplete={handleUploadComplete}
              onViewHistory={() => navigateTo('historique')}
              onBackHome={() => navigateTo('accueil')}
            />
          ) : (
            <>
              {activeTab === 'accueil' && (
                <>
                  {isRecharging ? (
                    <RechargePage
                      user={currentUser}
                      countryMode={countryMode}
                      onBack={() => setIsRecharging(false)}
                      onProceedToPayment={(checkout) => {
                        setPendingCheckout(checkout);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  ) : countryMode === 'NG' ? (
                    <NigeriaPage
                      user={currentUser}
                      t={t}
                      activeService={nigeriaService}
                      onChangeService={setNigeriaService}
                      onProceedToPayment={(checkout) => {
                        setPendingCheckout(checkout);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  ) : selectedOperatorId ? (
                    <OperatorPage
                      operatorId={selectedOperatorId}
                      userPhone={currentUser.phone}
                      onBack={() => setSelectedOperatorId(null)}
                      onOpenGiftMega={(opId) => setGiftModalOperator(opId)}
                      onProceedToPayment={(checkout) => {
                        setPendingCheckout(checkout);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  ) : (
                    <HomePage
                      user={currentUser}
                      t={t}
                      onSelectOperator={(opId) => {
                        setSelectedOperatorId(opId);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      onOpenCreditPage={() => navigateTo('credit')}
                      onOpenMegaPage={() => navigateTo('mega')}
                      onOpenGiftMega={() => setGiftModalOperator('airtel')}
                      onOpenProfile={() => navigateTo('profil')}
                      onQuickRecharge5000={(checkout) => {
                        setPendingCheckout(checkout);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  )}
                </>
              )}

              {activeTab === 'credit' && (
                countryMode === 'NG' ? (
                  <NigeriaPage
                    user={currentUser}
                    t={t}
                    activeService="airtime"
                    onChangeService={(svc) => {
                      setNigeriaService(svc);
                      if (svc !== 'airtime') setActiveTab('accueil');
                    }}
                    onProceedToPayment={(checkout) => {
                      setPendingCheckout(checkout);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                ) : (
                  <CreditHubPage
                    user={currentUser}
                    t={t}
                    onBackHome={() => navigateTo('accueil')}
                    onProceedToPayment={(checkout) => {
                      setPendingCheckout(checkout);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )
              )}

              {activeTab === 'mega' && (
                countryMode === 'NG' ? (
                  <NigeriaPage
                    user={currentUser}
                    t={t}
                    activeService="data"
                    onChangeService={(svc) => {
                      setNigeriaService(svc);
                      if (svc !== 'data') setActiveTab('accueil');
                    }}
                    onProceedToPayment={(checkout) => {
                      setPendingCheckout(checkout);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                ) : (
                  <MegaHubPage
                    user={currentUser}
                    t={t}
                    onBackHome={() => navigateTo('accueil')}
                    onOpenGiftMega={(opId) => setGiftModalOperator(opId)}
                    onProceedToPayment={(checkout) => {
                      setPendingCheckout(checkout);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )
              )}

              {activeTab === 'recu' && (
                <ReceiptPage
                  transactions={userTransactions}
                  t={t}
                  onGoHome={() => navigateTo('accueil')}
                />
              )}

              {activeTab === 'historique' && (
                <HistoryPage
                  transactions={userTransactions}
                  t={t}
                  onGoHome={() => navigateTo('accueil')}
                />
              )}

              {activeTab === 'profil' && (
                <ProfilePage
                  user={currentUser}
                  language={language}
                  selectedCountry={selectedCountry}
                  t={t}
                  onChangeLanguage={setLanguage}
                  onChangeCountry={() => setIsChangingCountry(true)}
                  onUpdateProfile={handleUpdateProfile}
                  onApplyReferralCode={handleApplyReferralCode}
                  onRechargeSolde={() => {
                    setActiveTab('accueil');
                    setSelectedOperatorId(null);
                    setIsRecharging(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenAdmin={() => navigateTo('admin')}
                  onLogout={handleLogout}
                />
              )}

              {activeTab === 'admin' && (
                <AdminPage
                  isAdminLoggedIn={isAdminLoggedIn}
                  transactions={transactions}
                  onAdminLogin={() => setIsAdminLoggedIn(true)}
                  onAdminLogout={() => setIsAdminLoggedIn(false)}
                  onValidateTransaction={handleValidateTransaction}
                  onRejectTransaction={handleRejectTransaction}
                />
              )}
            </>
          )}
        </div>
      </main>

      <BottomNav
        activeTab={activeTab}
        onNavigate={navigateTo}
        countryMode={countryMode}
        t={t}
      />

      {giftModalOperator && (
        <GiftMegaModal
          userPhone={currentUser.phone}
          initialOperatorId={giftModalOperator}
          onClose={() => setGiftModalOperator(null)}
          onProceedToPayment={(checkout) => {
            setGiftModalOperator(null);
            setPendingCheckout(checkout);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
}
