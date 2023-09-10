import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

import { defaultCountry } from "../../app/config";
import { useCountriesContext } from "../../app/contexts/countries";

export interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CountrySelect({ value, onChange }: CountrySelectProps) {
  const { countries } = useCountriesContext();
  if (!countries) return null;

  const selected =
    countries.find((c) => value !== "" && c.code === value) ||
    countries.find((c) => c.country === defaultCountry?.toUpperCase());

  return (
    <div className="min-w-[90px] pl-2">
      <Listbox value={selected?.code} onChange={onChange}>
        <div className="relative z-10 mt-0.5">
          <Listbox.Button className="relative w-full cursor-pointer text-left sm:text-sm">
            {selected && (
              <div className="flex items-center">
                <div className="mr-1.5">
                  <div className="aspect-[3/2] h-3.5">
                    {selected.code && (
                      <img
                        src={`/images/flags/4x3/${selected.country.toLowerCase()}.svg`}
                        alt="Flag"
                        className="rounded-sm"
                      />
                    )}
                  </div>
                </div>

                <div className="mr-2.5 flex-1 text-base">+{selected.code}</div>

                <span className="pointer-events-none absolute inset-y-0 flex items-center right-0">
                  <ChevronDownIcon
                    className="h-3.5 w-3.5 text-secondary-400"
                    aria-hidden="true"
                  />
                </span>
              </div>
            )}
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 max-w-[200px] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {countries
                ?.filter((c) => c.code !== value)
                .map((country, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      `relative cursor-pointer select-none p-2 ${
                        active
                          ? "bg-primary-100 text-primary-900"
                          : "text-secondary-900"
                      }`
                    }
                    value={country.code}
                  >
                    {({ selected }) => (
                      <>
                        <div className="flex items-center">
                          <div className="mr-1.5">
                            <div className="w-5 h-5">
                              {country.code && (
                                <img
                                  src={`/images/flags/1x1/${country.country.toLowerCase()}.svg`}
                                  alt="Flag"
                                  className="rounded-full"
                                />
                              )}
                            </div>
                          </div>

                          <div
                            className={`truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {country.name}
                          </div>
                        </div>
                        {selected ? (
                          <span className="absolute inset-y-0 right-1 flex items-center text-primary">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
