"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import {
  JOB_SALARY_CURRENCIES,
  type JobSalaryCurrency,
} from "@/lib/jobSalary";

type CurrencyPickerProps = {
  value: string;
  onChange: (currency: JobSalaryCurrency) => void;
  className?: string;
  label?: string;
  error?: string;
  menuAlign?: "left" | "right";
  menuWidth?: "wide" | "input";
  openAllOnFocus?: boolean;
};

export default function CurrencyPicker({
  value,
  onChange,
  className = "",
  label = "Salary currency",
  error,
  menuAlign = "right",
  menuWidth = "wide",
  openAllOnFocus = false,
}: CurrencyPickerProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const messageId = useId();

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const search = query.trim().toLocaleLowerCase();
  const matches = search
    ? JOB_SALARY_CURRENCIES.filter(({ code, name, symbol }) =>
        [code, name, symbol].some((field) =>
          field.toLocaleLowerCase().includes(search),
        ),
      )
    : JOB_SALARY_CURRENCIES;
  const noMatches = search.length > 0 && matches.length === 0;
  const highlightedIndex = Math.min(activeIndex, matches.length - 1);

  const selectCurrency = (currency: JobSalaryCurrency) => {
    setQuery(currency);
    setIsOpen(false);
    onChange(currency);
  };

  return (
    <div
      className={`relative ${className}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
          const exactMatch = matches.find(
            ({ code, name }) =>
              code.toLocaleLowerCase() === search ||
              name.toLocaleLowerCase() === search,
          );
          const onlyMatch = matches.length === 1 ? matches[0] : undefined;
          if (exactMatch || onlyMatch) {
            selectCurrency((exactMatch ?? onlyMatch)!.code);
          } else if (!noMatches) {
            setQuery(value);
          }
        }
      }}
    >
      <div className="flex items-center rounded-xl border border-zinc-200 bg-white focus-within:border-red-400">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-label={label}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={isOpen && matches.length > 0 ? listId : undefined}
          aria-activedescendant={
            isOpen && matches.length > 0
              ? `${listId}-${highlightedIndex}`
              : undefined
          }
          aria-invalid={noMatches || Boolean(error)}
          aria-describedby={noMatches || error ? messageId : undefined}
          autoComplete="off"
          value={query}
          onFocus={(event) => {
            if (openAllOnFocus && query === value) {
              setQuery("");
            } else {
              event.currentTarget.select();
            }
            setIsOpen(true);
            setActiveIndex(0);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setIsOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsOpen(false);
              return;
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setIsOpen(true);
              if (matches.length > 0) {
                setActiveIndex((index) => Math.min(index + 1, matches.length - 1));
              }
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setIsOpen(true);
              setActiveIndex((index) => Math.max(index - 1, 0));
            }
            if (event.key === "Enter" && isOpen && matches.length > 0) {
              event.preventDefault();
              selectCurrency(matches[highlightedIndex].code);
            }
          }}
          placeholder="Type a currency"
          className="min-w-0 w-full bg-transparent px-3 py-2 text-sm text-zinc-700 outline-none placeholder:text-zinc-400"
        />
        <button
          type="button"
          aria-label="Show currencies"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            setQuery("");
            setActiveIndex(0);
            setIsOpen(true);
            inputRef.current?.focus();
          }}
          className="px-2 py-2 text-zinc-500"
        >
          <ChevronDown size={16} aria-hidden="true" />
        </button>
      </div>

      {isOpen && matches.length > 0 && (
        <div
          id={listId}
          role="listbox"
          aria-label="Currencies"
          className={`absolute ${menuAlign === "left" ? "left-0" : "right-0"} z-50 mt-1 ${menuWidth === "input" ? "w-full" : "w-64 max-w-[calc(100vw-2rem)]"} max-h-52 overflow-y-auto rounded-xl border border-zinc-200 bg-white py-1 shadow-lg`}
        >
          {matches.map(({ code, name, symbol }, index) => (
            <button
              key={code}
              id={`${listId}-${index}`}
              type="button"
              role="option"
              aria-selected={value === code}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectCurrency(code)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 ${
                highlightedIndex === index ? "bg-zinc-100" : ""
              }`}
            >
              <span className="w-10 shrink-0 font-semibold">{code}</span>
              <span className="min-w-0 flex-1 truncate">{name}</span>
              <span className="shrink-0 text-zinc-500">{symbol}</span>
            </button>
          ))}
        </div>
      )}

      {(noMatches || error) && (
        <p id={messageId} className="mt-1 text-xs text-red-500" role="alert">
          {noMatches ? "No matching currency" : error}
        </p>
      )}
    </div>
  );
}
