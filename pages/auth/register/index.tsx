import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Link from "next/link";
import { ChangeEvent, FormEvent, ReactElement, useState } from "react";

import MessageType from "../../../app/types/message";
import Status from "../../../app/types/status";

import Layout, { Head } from "../../../components/auth/navigation/layout";
import Button from "../../../components/auth/ui/button";
import Input from "../../../components/auth/ui/input";
import Alert from "../../../components/ui/alert";
import CountrySelect from "../../../components/ui/country-select";

const params = {
  link: "/auth/register",
  title: "S'inscrire | Net TV",
  description: "S'inscrire à Net TV",
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    code: "",
    phone: "",
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [status, setStatus] = useState(Status.IDLE);
  const [message, setMessage] = useState<MessageType | null>(null);

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status !== Status.LOADING) {
      setStatus(Status.LOADING);
      setMessage(null);
      const res = await axios.post<{ message: string } | { error: string }>(
        "/api/auth/register",
        formData
      );
      if ("message" in res.data) {
        setStatus(Status.IDLE);
        setMessage({ type: "success", content: res.data.message });
      } else {
        setStatus(Status.FAILED);
        setMessage({ type: "danger", content: res.data.error });
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-10 grid grid-cols-1 gap-y-10">
      <Head {...params} />

      {message && <Alert color={message.type}>{message.content}</Alert>}

      <div className="grid grid-cols-1 gap-y-2.5">
        <Input
          label="Prénom(s)"
          id="first_name"
          name="first_name"
          onChange={onChange}
          value={formData.first_name}
          autoComplete="given-name"
          required
        />
        <Input
          label="Nom(s)"
          id="last_name"
          name="last_name"
          onChange={onChange}
          value={formData.last_name}
          autoComplete="family-name"
          required
        />
        <Input
          label="Numéro de téléphone"
          id="phone"
          name="phone"
          type="tel"
          onChange={onChange}
          value={formData.phone}
          autoComplete="phone"
          required
          prepend={
            <CountrySelect
              value={formData.code}
              onChange={(code: string) => setFormData({ ...formData, code })}
            />
          }
        />
        <Input
          label="Adresse mail"
          id="email"
          name="email"
          type="email"
          onChange={onChange}
          value={formData.email}
          autoComplete="email"
          required
        />
        <Input
          label="Mot de passe"
          id="password"
          name="password"
          type={passwordVisible ? "text" : "password"}
          onChange={onChange}
          value={formData.password}
          required
          addon={
            <div
              className="cursor-pointer"
              onClick={() => setPasswordVisible((p) => !p)}
            >
              {!passwordVisible ? (
                <EyeIcon className="w-6" />
              ) : (
                <EyeSlashIcon className="w-6" />
              )}
            </div>
          }
        />
      </div>

      <div>
        <Button status={status}>Inscription</Button>
      </div>
    </form>
  );
};

RegisterPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout
      title="Créez votre compte"
      text={
        <>
          Vous avez déjà un compte?{" "}
          <Link href="/auth/login">
            <a className="font-medium text-primary-800 hover:underline">
              Connectez-vous
            </a>
          </Link>
          .
        </>
      }
    >
      {page}
    </Layout>
  );
};

export default RegisterPage;
