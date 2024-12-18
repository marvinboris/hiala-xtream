import {
  ArchiveBoxIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";

import {
  useAppDispatch,
  useAppSelector,
  useWindowSize,
} from "../../../../app/hooks";

import NavItemType from "../../../../app/types/nav-item";

import { logout, selectAuth } from "../../../../features/auth/authSlice";

type AccountProps = { navItems: NavItemType[] };

export default function Account({ navItems }: AccountProps) {
  const dispatch = useAppDispatch();
  const { data: account } = useAppSelector(selectAuth);

  const disconnect = () => {
    dispatch(logout());
  };

  const menuItems = [
    {
      href: "/moncompte",
      label: "Mon compte",
      icon: UserIcon,
      condition: Boolean(account),
    },
    {
      href: "/bouquets",
      label: "Nos bouquets",
      icon: ArchiveBoxIcon,
      condition: (account && !account.bouquet) || !account,
    },
  ];

  const menuContent = menuItems.map((item) => {
    const itemContent = (
      <Link key={"account-menu-item" + item.href} href={item.href}>
        <a className="bg-transparent hover:bg-white/10 text-white transition-all duration-200 flex items-center px-4 py-1">
          <div className="w-6 h-6 rounded-sm bg-green flex items-center justify-center mr-2">
            <item.icon className="w-4 h-4 text-white" />
          </div>

          <div className="text-lg">{item.label}</div>
        </a>
      </Link>
    );

    return item.condition && itemContent;
  });

  const navItemsContent = navItems.map((item) => (
    <Link key={"account-nav-item" + item.href} href={item.href}>
      <a className="bg-transparent hover:bg-white/10 transition-all duration-200 flex items-center px-4 py-2">
        {item.icon ? (
          <div className="w-6 h-6 rounded-sm flex items-center justify-center mr-2">
            <item.icon className="w-6 text-green" />
          </div>
        ) : null}

        <div className="text-lg">{item.children}</div>
      </a>
    </Link>
  ));

  return (
    <div className="relative group">
      <UserCircleIcon className="w-10 h-10 group-hover:scale-110 transition-all duration-200" />

      <div className="absolute w-72 origin-top-right opacity-0 scale-0 top-full right-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200">
        <div className="pt-4">
          <div className="rounded-xl shadow-xl bg-secondary-800 divide-y divide-secondary-100/20">
            {account ? (
              <div className="p-4 text-white">
                <div className="text-xl font-bold mb-1">Compte Net TV</div>

                <div className="text-lg">
                  Connectez-vous pour accéder à vos programmes et services
                </div>

                <Link href="/auth/login">
                  <a className="btn btn-primary btn-block mt-2">Se connecter</a>
                </Link>
              </div>
            ) : (
              <div className="py-4 md:hidden text-white">{navItemsContent}</div>
            )}

            <div className="py-4">
              {menuContent}

              {account && (
                <div className="mt-2 px-4">
                  <button
                    className="btn btn-secondary btn-block"
                    onClick={disconnect}
                  >
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
