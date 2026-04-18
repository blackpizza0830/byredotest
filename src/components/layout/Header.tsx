"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { AuthModal } from "@/components/auth/AuthModal";
import { getAuthClient } from "@/lib/auth/auth-client";
import type { AuthMode } from "@/types/auth";

const MOBILE_NAV_LINKS = [
  { label: "shop", href: "/shop" },
  { label: "offline-store", href: "/offline-store" },
  { label: "mypage", href: "/mypage" },
] as const;

interface HeaderProps {
  isPurchaseMode?: boolean;
  onPurchase?: () => void;
}

export function Header({
  isPurchaseMode = false,
  onPurchase,
}: HeaderProps): React.JSX.Element {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signUp");

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showBg = scrolled || isPurchaseMode;
  const authClient = getAuthClient();

  const openAuthModal = (mode: AuthMode): void => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 h-[60px] transition-all duration-300",
        isPurchaseMode ? "z-[60]" : "z-50",
        showBg
          ? "bg-white/95 backdrop-blur-md border-b border-black/[0.06]"
          : "bg-transparent"
      )}
    >
      <div className="grid h-full w-full grid-cols-3 items-center px-[10px]">
        {/* Left nav */}
        <div className="flex min-w-0 items-center justify-start">
          <button
            type="button"
            className="flex -ml-2 items-center justify-center rounded-sm p-2 text-black md:hidden hover:opacity-60 transition-opacity"
            onClick={() => setMobileMenuOpen(true)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label="Open menu"
          >
            <Menu size={22} strokeWidth={1.5} aria-hidden />
          </button>
          <nav className="hidden md:flex items-center gap-[44px]">
            <Link
              href="/shop"
              className="text-[11px] text-black leading-[9px] hover:opacity-60 transition-opacity"
            >
              shop
            </Link>
            <Link
              href="/offline-store"
              className="text-[11px] text-black leading-[9px] hover:opacity-60 transition-opacity"
            >
              offline-store
            </Link>
          </nav>
        </div>

        {/* Center logo */}
        <div className="flex justify-center">
          <Link href="/" className="block h-[21px] w-[100px] shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/기타/logo.svg"
              alt="Byredo"
              className="h-full w-full object-contain"
            />
          </Link>
        </div>

        {/* Right nav — default or purchase mode */}
        <div className="flex min-w-0 items-center justify-end">
          {isPurchaseMode ? (
            <button
              type="button"
              onClick={onPurchase}
              className="hidden md:block h-[32px] px-6 bg-black text-white font-sans font-medium text-[11px] tracking-[2.2px] uppercase hover:bg-byredo-gray-700 transition-colors duration-300"
            >
              PURCHASE
            </button>
          ) : (
            <nav className="hidden md:flex items-center gap-[10px]">
              <Link
                href="/mypage"
                className="text-[11px] text-black leading-[9px] hover:opacity-60 transition-opacity"
              >
                mypage
              </Link>
              <button
                type="button"
                onClick={() => openAuthModal("signIn")}
                className="text-[11px] text-black leading-[9px] hover:opacity-60 transition-opacity"
              >
                login
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("signUp")}
                className="text-[11px] text-black leading-[9px] hover:opacity-60 transition-opacity"
              >
                join
              </button>
            </nav>
          )}
          <span className="inline-block w-10 shrink-0 md:hidden" aria-hidden />
        </div>
      </div>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={MOBILE_NAV_LINKS}
        actions={[
          {
            label: "login",
            onClick: () => openAuthModal("signIn"),
          },
          {
            label: "join",
            onClick: () => openAuthModal("signUp"),
          },
        ]}
      />

      <AuthModal
        open={authModalOpen}
        mode={authMode}
        authClient={authClient}
        onClose={() => setAuthModalOpen(false)}
        onModeChange={setAuthMode}
      />
    </header>
  );
}
