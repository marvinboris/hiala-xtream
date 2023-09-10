import Link from "next/link";
import { ReactNode } from "react";

import Logo from "../../ui/logo";

type BlockProps = {
  title: string;
  className?: string;
  children?: ReactNode;
};

type ButtonProps = {
  href: string;
  name: string;
  os: string;
};

type NavLinkProps = {
  href: string;
  children?: ReactNode;
};

type SocialLinkProps = {
  href: string;
  icon: string;
};

const Block = ({ title, className, children }: BlockProps) => (
  <div className={className}>
    <div className="text-[25px] font-bold mb-[18px]">{title}</div>

    <div>{children}</div>
  </div>
);

const Button = ({ href, name, os }: ButtonProps) => (
  <a
    href={href}
    className="rounded bg-white text-secondary-700 shadow-sm py-4 px-8 flex flex-col items-center justify-center space-y-1"
  >
    <div className="text-xl font-extrabold text-primary-800">{name}</div>
    <div className="text-sm">{os}</div>
  </a>
);

const NavLink = ({ href, children }: NavLinkProps) => (
  <div className="mt-2 flex items-center space-x-2">
    <div className="h-0.5 w-2.5 bg-white rounded-full" />
    <Link href={href}>
      <a>{children}</a>
    </Link>
  </div>
);

const SocialLink = ({ href, icon }: SocialLinkProps) => (
  <a
    href={href}
    target="_blank"
    className="w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center"
  >
    <img
      src={`/images/social-networks/${icon}.svg`}
      alt={icon.toUpperCase()}
      className="w-5"
    />
  </a>
);

export default function Footer() {
  const socialNetworks = (
    <>
      <SocialLink href="#" icon="facebook" />
      <SocialLink href="#" icon="linkedin" />
      <SocialLink href="#" icon="twitter" />
      <SocialLink href="#" icon="instagram" />
      <SocialLink href="#" icon="youtube" />
    </>
  );

  return (
    <footer className="text-white bg-secondary-800 min-h-[625px] lg:min-h-[425px] relative overflow-hidden z-0">
      <div className="hidden lg:block w-[540px] h-[540px] -z-10 rounded-full bg-gradient-to-b from-green/10 to-transparent absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 p-[50px]">
        <div className="rounded-full w-full h-full bg-secondary-800" />
      </div>

      <div className="container pt-14 lg:pt-16 pb-14 grid gap-x-4 gap-y-9 grid-cols-2 lg:grid-cols-5 xl:grid-cols-7">
        <div className="col-span-2 lg:col-span-5 xl:col-span-2 order-1">
          <Logo reset />
        </div>

        <Block title="Liens utiles" className="order-2">
          <NavLink href="/chaines">Chaines TV</NavLink>
          <NavLink href="/films">Films</NavLink>
          <NavLink href="/series">Séries</NavLink>
          <NavLink href="/bouquets">Nos formules</NavLink>
        </Block>

        <Block
          title="Télécharger nos applis"
          className="col-span-2 sm:col-span-1 lg:col-span-2 order-3 lg:order-4"
        >
          <div className="grid grid-cols-2 gap-2 relative z-10">
            {[
              { name: "Hiala C", os: "Android", href: "https://play.google.com/store/apps/details?id=com.hailatv.hailatviptvbox" },
              { name: "Hiala P", os: "Android", href: "https://play.google.com/store/apps/details?id=com.hialatv.hialatviptvbox" },
              { name: "Hiala C", os: "iOS", href: "/files/hiala-c.app" },
              { name: "Hiala P", os: "iOS", href: "/files/hiala-p.app" },
            ].map((item) => (
              <Button key={JSON.stringify(item)} {...item} />
            ))}
          </div>
        </Block>

        <Block
          title="Nous acceptons"
          className="col-span-2 sm:col-span-1 lg:col-span-2 order-3 lg:order-4"
        >
          <div className="flex flex-wrap gap-2">
            <img
              src="/images/payment-methods/Orange-Money-emblem.png"
              alt="Payment methods - Orange Money"
              className="h-8 w-auto"
            />
            <img
              src="/images/payment-methods/69-691715_mtn-mm-logo-generic-mtn-mobile-money-logo.png"
              alt="Payment methods - MTN MoMo"
              className="h-8 w-auto"
            />
            <img
              src="/images/payment-methods/card.png"
              alt="Payment methods - card"
              className="h-8 w-auto"
            />
          </div>
        </Block>

        <div className="flex lg:hidden col-span-2 sm:col-span-1 space-x-2.5 order-5">
          {socialNetworks}
        </div>
      </div>

      <div className="border-t h-[88px] flex items-center border-white/50">
        <div className="container flex items-center">
          <div className="flex-1">
            Copyright {new Date().getFullYear()}. Tous droits réservés.{" "}
            <span className="font-bold text-green">Hiala TV</span>
          </div>

          <div className="hidden lg:flex space-x-2.5">{socialNetworks}</div>
        </div>
      </div>
    </footer>
  );
}
