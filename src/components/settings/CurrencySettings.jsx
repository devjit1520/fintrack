import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Globe,
  Calendar,
  Hash,
} from "lucide-react";

function CurrencySettings() {
  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "INR"
  );

  const [locale, setLocale] = useState(
    localStorage.getItem("locale") || "en-IN"
  );

  const [dateFormat, setDateFormat] = useState(
    localStorage.getItem("dateFormat") || "DD/MM/YYYY"
  );

  const [numberFormat, setNumberFormat] = useState(
    localStorage.getItem("numberFormat") || "1,23,456.78"
  );

  useEffect(() => {
    localStorage.setItem("currency", currency);
    localStorage.setItem("locale", locale);
    localStorage.setItem("dateFormat", dateFormat);
    localStorage.setItem("numberFormat", numberFormat);
  }, [currency, locale, dateFormat, numberFormat]);

  const Item = ({
    icon: Icon,
    title,
    value,
    setValue,
    options,
  }) => (
    <div className="rounded-2xl bg-slate-800/60 p-5">
      <div className="mb-3 flex items-center gap-3">
        <Icon
          className="text-cyan-400"
          size={20}
        />

        <span className="font-semibold text-white">
          {title}
        </span>
      </div>

      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white outline-none"
      >
        {options.map((item) => (
          <option
            key={item}
            value={item}
          >
            {item}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
    >
      <div className="mb-8 flex items-center gap-3">
        <DollarSign
          className="text-cyan-400"
          size={28}
        />

        <h2 className="text-2xl font-bold text-white">
          Regional Settings
        </h2>
      </div>

      <div className="space-y-5">

        <Item
          icon={DollarSign}
          title="Currency"
          value={currency}
          setValue={setCurrency}
          options={[
            "INR",
            "USD",
            "EUR",
            "GBP",
            "JPY",
          ]}
        />

        <Item
          icon={Globe}
          title="Locale"
          value={locale}
          setValue={setLocale}
          options={[
            "en-IN",
            "en-US",
            "en-GB",
            "de-DE",
            "fr-FR",
          ]}
        />

        <Item
          icon={Calendar}
          title="Date Format"
          value={dateFormat}
          setValue={setDateFormat}
          options={[
            "DD/MM/YYYY",
            "MM/DD/YYYY",
            "YYYY-MM-DD",
          ]}
        />

        <Item
          icon={Hash}
          title="Number Format"
          value={numberFormat}
          setValue={setNumberFormat}
          options={[
            "1,23,456.78",
            "123,456.78",
            "123456.78",
          ]}
        />

      </div>

      <div className="mt-8 rounded-2xl bg-cyan-500/10 p-5">
        <p className="text-sm text-slate-300">
          Current Configuration
        </p>

        <h3 className="mt-3 text-xl font-bold text-cyan-400">
          {currency} • {locale}
        </h3>

        <p className="mt-2 text-slate-400">
          {dateFormat} • {numberFormat}
        </p>
      </div>
    </motion.div>
  );
}

export default CurrencySettings;