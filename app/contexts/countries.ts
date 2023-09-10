import { createContext, useContext } from "react";

import CountryType from "../types/country";

type Type = CountryType[] | null;

const CountriesContext = createContext<{
  defaultCode: string;
  countries: Type;
  setCountries: (countries: Type) => void;
}>({
  defaultCode: "",
  countries: null,
  setCountries: () => {},
});

export const useCountriesContext = () => useContext(CountriesContext);

export default CountriesContext;
