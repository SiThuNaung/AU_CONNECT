import currencies from "@/data/currencies.json";

export const JOB_SALARY_CURRENCIES = currencies;

export type JobSalaryCurrency = (typeof JOB_SALARY_CURRENCIES)[number]["code"];

export const DEFAULT_JOB_SALARY_CURRENCY: JobSalaryCurrency = "USD";

// These ranges only size the filter slider. Number inputs can exceed them.
// They are not exchange rates or limits on salaries that can be posted.
const SALARY_SLIDER_SETTINGS: Record<string, readonly [number, number]> = {
  THB: [500_000, 5_000],
  CAD: [25_000, 250],
  AUD: [30_000, 500],
  SGD: [30_000, 500],
  MYR: [80_000, 1_000],
  IDR: [500_000_000, 5_000_000],
  PHP: [1_000_000, 10_000],
  VND: [500_000_000, 5_000_000],
  KHR: [80_000_000, 1_000_000],
  LAK: [500_000_000, 5_000_000],
  MMK: [100_000_000, 1_000_000],
  JPY: [2_000_000, 25_000],
  CNY: [150_000, 2_000],
  KRW: [20_000_000, 250_000],
  INR: [1_000_000, 10_000],
  HKD: [200_000, 2_500],
  TWD: [1_000_000, 10_000],
  AED: [100_000, 1_000],
  SAR: [100_000, 1_000],
  BRL: [100_000, 1_000],
  BDT: [1_000_000, 10_000],
  NPR: [2_000_000, 20_000],
  PKR: [5_000_000, 50_000],
  LKR: [5_000_000, 50_000],
  KWD: [10_000, 100],
  BHD: [10_000, 100],
  OMR: [10_000, 100],
  QAR: [100_000, 1_000],
  PLN: [100_000, 1_000],
  CZK: [500_000, 5_000],
  HUF: [10_000_000, 100_000],
  TRY: [2_000_000, 20_000],
  MXN: [500_000, 5_000],
  ARS: [50_000_000, 500_000],
  COP: [100_000_000, 1_000_000],
  ZAR: [500_000, 5_000],
  NGN: [50_000_000, 500_000],
  KES: [2_000_000, 20_000],
  EGP: [2_000_000, 20_000],
};

export function isJobSalaryCurrency(
  value: string,
): value is JobSalaryCurrency {
  return JOB_SALARY_CURRENCIES.some(({ code }) => code === value);
}

export function getJobSalaryCurrencyConfig(currency: JobSalaryCurrency) {
  const [sliderMax, step] = SALARY_SLIDER_SETTINGS[currency] ?? [20_000, 250];
  return { sliderMax, step };
}

export function formatJobSalaryAmount(
  amount: number,
  currency: JobSalaryCurrency,
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(amount);
}
