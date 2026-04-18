"use client";

import Link from "next/link";
import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavLink {
  label: string;
  href: string;
}

interface MobileMenuAction {
  label: string;
  onClick: () => void;
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: readonly NavLink[];
  actions?: readonly MobileMenuAction[];
}

export function MobileMenu({
  open,
  onClose,
  links,
  actions = [],
}: MobileMenuProps): React.JSX.Element {
  useEffect(() => {
    if (!open) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return (): void => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-white md:hidden"
        >
          <div className="flex h-full max-h-[100dvh] flex-col overflow-y-auto px-[10px] pb-10 pt-6">
            <div className="flex items-center justify-between border-b border-black/10 pb-6">
              <Link href="/" onClick={onClose} className="block h-[21px] w-[100px] shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/기타/logo.svg"
                  alt="Byredo"
                  className="h-full w-full object-contain"
                />
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="p-2 text-black hover:opacity-60 transition-opacity"
              >
                <X size={22} strokeWidth={1.5} aria-hidden />
              </button>
            </div>

            <nav id="mobile-navigation" className="mt-10 flex flex-col gap-6">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block text-[11px] tracking-[0.16em] uppercase text-black leading-[9px] hover:opacity-60 transition-opacity"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {actions.length > 0 && (
              <div className="mt-auto pt-12">
                <div className="grid grid-cols-2 gap-3 border-t border-black/10 pt-6">
                  {actions.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => {
                        onClose();
                        action.onClick();
                      }}
                      className="h-11 border border-black text-[11px] uppercase tracking-[0.16em] text-black transition-colors hover:bg-black hover:text-white"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
