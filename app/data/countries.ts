import { CORS } from "../constants";
import CountryType from "../types/country";

export const getCountries = async () => {
  let countries: CountryType[];

  try {
    const phoneRes = await fetch(CORS + "http://country.io/phone.json", {
      method: "GET",
      mode: "cors",
    });
    const namesRes = await fetch(CORS + "http://country.io/names.json", {
      method: "GET",
      mode: "cors",
    });

    const phoneData = await phoneRes.json();
    const namesData = await namesRes.json();

    const phone = JSON.parse(phoneData.contents) as { [key: string]: string };
    const names = JSON.parse(namesData.contents) as { [key: string]: string };

    countries = Object.keys(phone).map((key) => ({
      country: key,
      code: phone[key],
      name: names[key],
    }));
    countries = countries.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    countries = [];
    console.log(error);
  }

  return countries;
};

export const getCountryFromIP = async (ip: string) => {
  const response = await fetch(`http://ip-api.com/json/${ip}`);
  const data = await response.json();
  console.log(data);
  return data.country as string;
};
