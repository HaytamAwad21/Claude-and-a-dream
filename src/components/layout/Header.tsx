"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Sheet } from "@/components/ui/Sheet";
import { siteConfig } from "@/config/site";
import { categories } from "@/data/categories";
import { freeShippingLabel } from "@/lib/format";
import { cartUi, useCart, useHydrated } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";
import { ProductArt } from "@/components/product/ProductArt";
import { helpLinks, mainNav } from "./nav";
import { SearchDialog } from "./SearchDialog";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const cart = useCart();
  const wishlist = useWishlist();
  const hydrated = useHydrated();
  const count = hydrated ? cart.itemCount : 0;
  const saved = hydrated ? wishlist.length : 0;

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      <a
        href="#main"
        className="eyebrow fixed left-4 top-4 z-[70] -translate-y-24 bg-acid px-4 py-3 text-on-acid transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <header
        className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur-md"
        onMouseLeave={() => setMegaOpen(false)}
      >
        <div className="container-site flex h-[var(--spacing-header)] items-center gap-4">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="-ml-2 flex h-11 w-11 items-center justify-center text-bone lg:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Icon name="menu" size={22} />
          </button>

          <Link
            href="/"
            className="display text-[1.75rem] leading-none tracking-wide text-bone transition-colors hover:text-acid"
            aria-label={`${siteConfig.name} home`}
          >
            {siteConfig.name}
          </Link>

          <nav aria-label="Main" className="ml-6 hidden lg:block xl:ml-10">
            <ul className="flex items-center gap-5 xl:gap-7">
              {mainNav.map((item) => (
                <li key={item.href} onMouseEnter={() => setMegaOpen(Boolean(item.mega))}>
                  {item.mega ? (
                    <button
                      type="button"
                      className={`eyebrow flex items-center gap-1 py-6 transition-colors hover:text-bone ${
                        megaOpen ? "text-bone" : "text-muted"
                      }`}
                      aria-expanded={megaOpen}
                      aria-controls="mega-menu"
                      onClick={() => setMegaOpen((o) => !o)}
                    >
                      Shop
                      <Icon name="chevronDown" size={14} className={`transition-transform ${megaOpen ? "rotate-180" : ""}`} />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={`eyebrow relative whitespace-nowrap py-6 transition-colors hover:text-bone ${
                        isActive(item.href) ? "text-bone" : "text-muted"
                      } after:absolute after:inset-x-0 after:bottom-4 after:h-px after:origin-left after:scale-x-0 after:bg-acid after:transition-transform hover:after:scale-x-100 ${
                        isActive(item.href) ? "after:scale-x-100" : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-11 items-center gap-3 px-2 text-bone transition-colors hover:text-acid xl:min-w-56 xl:border xl:border-line xl:px-3 xl:text-muted xl:hover:border-line-strong"
              aria-label="Search products"
            >
              <Icon name="search" size={18} />
              <span className="hidden text-sm xl:inline">Search needles, SKUs…</span>
            </button>
            <ThemeToggle />
            <Link
              href="/wishlist"
              className="relative flex h-11 w-11 items-center justify-center text-bone transition-colors hover:text-acid"
              aria-label={`Wishlist, ${saved} ${saved === 1 ? "item" : "items"}`}
            >
              <Icon name="heart" size={20} />
              {saved > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-acid" aria-hidden="true" />
              )}
            </Link>
            <button
              type="button"
              onClick={() => cartUi.open()}
              className="relative -mr-2 flex h-11 w-11 items-center justify-center text-bone transition-colors hover:text-acid"
              aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
            >
              <Icon name="bag" size={21} />
              {count > 0 && (
                <span
                  className="absolute right-0.5 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-acid px-1 font-mono text-[10px] font-semibold text-on-acid"
                  aria-hidden="true"
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {megaOpen && (
          <div
            id="mega-menu"
            className="absolute inset-x-0 top-full hidden animate-fade-up border-b border-line bg-charcoal lg:block"
            onKeyDown={(e) => e.key === "Escape" && setMegaOpen(false)}
          >
            <div className="container-site grid grid-cols-6 gap-4 py-8">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/collections/${c.slug}`}
                  onClick={() => setMegaOpen(false)}
                  className="group block"
                >
                  <div className="overflow-hidden rounded-card">
                    <ProductArt
                      kind={c.art}
                      label={c.shortName.slice(0, 4).toUpperCase()}
                      decorative
                      alt=""
                      className="aspect-square w-full transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 text-sm font-medium text-bone group-hover:text-acid">{c.name}</p>
                  <p className="eyebrow mt-1 text-[10px] text-faint">{c.blurb}</p>
                </Link>
              ))}
            </div>
            <div className="border-t border-line">
              <div className="container-site flex h-12 items-center justify-between">
                <Link href="/collections/all" onClick={() => setMegaOpen(false)} className="eyebrow text-bone hover:text-acid">
                  Shop all products →
                </Link>
                <Link href="/offers" onClick={() => setMegaOpen(false)} className="eyebrow text-acid hover:text-bone">
                  Current bundle deals →
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="border-b border-line bg-ink">
        <div className="container-site flex h-9 items-center justify-center overflow-hidden text-center">
          <p className="eyebrow whitespace-nowrap text-[10px] text-muted">
            <span className="text-acid">●</span> {freeShippingLabel} · Worldwide shipping
            <span className="hidden sm:inline">
              {" "}
              · {siteConfig.returns.days}-day returns · Volume pricing on every box
            </span>
          </p>
        </div>
      </div>

      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} side="left" label="Menu">
        <div className="flex h-16 items-center justify-between border-b border-line px-4">
          <span className="display text-2xl">{siteConfig.name}</span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="flex h-11 w-11 items-center justify-center"
            aria-label="Close menu"
          >
            <Icon name="close" />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-6">
          <p className="eyebrow mb-3 text-faint">Shop</p>
          <ul className="mb-8 border-t border-line">
            {[{ slug: "all", name: "Shop all" }, ...categories].map((c) => (
              <li key={c.slug} className="border-b border-line">
                <Link
                  href={`/collections/${c.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="display flex items-center justify-between py-3.5 text-2xl text-bone"
                >
                  {c.name}
                  <Icon name="arrowRight" size={18} className="text-faint" />
                </Link>
              </li>
            ))}
          </ul>
          <ul className="grid grid-cols-2 gap-3">
            {[{ label: "Offers", href: "/offers" }, { label: "Wholesale", href: "/wholesale" }, { label: "About", href: "/about" }, ...helpLinks].map(
              (l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={() => setMenuOpen(false)} className="text-sm text-muted hover:text-bone">
                    {l.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>
        <div className="border-t border-line p-4">
          <a
            href={`https://wa.me/${siteConfig.contact.whatsapp}`}
            className="eyebrow flex items-center gap-2 text-muted hover:text-acid"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="whatsapp" size={18} /> WhatsApp us
          </a>
        </div>
      </Sheet>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
