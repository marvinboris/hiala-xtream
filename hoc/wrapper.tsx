import Head from "next/head";
import { ReactNode, useEffect, useState } from "react";

import { defaultCountry } from "../app/config";
import CountriesContext from "../app/contexts/countries";
import ThemeContext from "../app/contexts/theme";
import { getCountries, getCountryFromIP } from "../app/data/countries";
import { setAuthToken } from "../app/helpers/utils";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import CountryType from "../app/types/country";
import Theme from "../app/types/theme";
import { check, selectAuth } from "../features/auth/authSlice";
import tailwindConfig from "../tailwind.config";

interface WrapperProps {
  children: ReactNode;
}

export default function Wrapper({ children }: WrapperProps) {
  const [countries, setCountries] = useState<CountryType[] | null | undefined>(null);
  const [defaultCode, setDefaultCode] = useState("");
  const [theme, setTheme] = useState<Theme | null>(Theme.DARK);

  const dispatch = useAppDispatch();
  const { token, data } = useAppSelector(selectAuth);

  useEffect(() => {
    const isAuth = localStorage.getItem("token") !== null;
    if (!token && isAuth) dispatch(check());
    else if (token) setAuthToken(token);
  }, [token]);

  useEffect(() => {
    const root = document.querySelector("html")!;
    if (theme === Theme.DARK) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  useEffect(() => {
    if (!countries)
      getCountries().then((countries) => {
        setCountries(countries);
        const defaultCode =
          countries.find((c) => c.country === defaultCountry)?.code || "";
        setDefaultCode(defaultCode);
      });
  }, [countries]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <CountriesContext.Provider
        value={{ defaultCode, countries, setCountries }}
      >
        <Head>
          <meta
            name="theme-color"
            content={
              theme === Theme.DARK
                ? tailwindConfig.theme.extend.colors.secondary[900]
                : "#ffffff"
            }
          />

          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
          />

          <meta
            name="robots"
            content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
          />

          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
          <meta name="apple-mobile-web-app-title" content="Net TV" />
          <meta name="application-name" content="Net TV" />

          <link rel="manifest" href="/manifest.json" />
          <link
            rel="apple-touch-icon"
            sizes="57x57"
            href="/icons/apple-icon-57x57.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="60x60"
            href="/icons/apple-icon-60x60.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="72x72"
            href="/icons/apple-icon-72x72.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href="/icons/apple-icon-76x76.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="114x114"
            href="/icons/apple-icon-114x114.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="120x120"
            href="/icons/apple-icon-120x120.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="144x144"
            href="/icons/apple-icon-144x144.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/icons/apple-icon-152x152.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/apple-icon-180x180.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/icons/android-icon-192x192.png"
          />
          <link rel="icon" href="/images/favicon.svg" />
          <meta
            name="msapplication-TileColor"
            content={tailwindConfig.theme.extend.colors.primary[600]}
          />

          <base href="/" />

          <meta property="og:locale" content="fr_FR" />
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content="Net TV" />

          <meta name="twitter:card" content="summary" />
        </Head>

        {theme != null && children}
      </CountriesContext.Provider>
    </ThemeContext.Provider>
  );
}
