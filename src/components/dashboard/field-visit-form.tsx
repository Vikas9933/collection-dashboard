"use client";

import { useState, useTransition } from "react";
import { Loader2, MapPinPlus } from "lucide-react";
import { createFieldVisit } from "@/app/dashboard/actions";
import type { AccountOption } from "@/lib/types";

interface FieldVisitFormProps {
  accounts: AccountOption[];
}

export function FieldVisitForm({ accounts }: FieldVisitFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [promiseToPay, setPromiseToPay] = useState(false);
  const [isPending, startTransition] = useTransition();

  const today = new Date().toISOString().slice(0, 10);

  function handleSubmit(formData: FormData) {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await createFieldVisit(formData);
      if (result.error) setError(result.error);
      else if (result.success) {
        setMessage(result.success);
        setPromiseToPay(false);
      }
    });
  }

  return (
    <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-4">
      <div className="mb-3 flex items-center gap-2">
        <MapPinPlus className="h-4 w-4 text-indigo-600" />
        <h3 className="text-sm font-semibold text-slate-900">Record Field Visit</h3>
      </div>

      {(message || error) && (
        <div
          className={`mb-3 rounded-lg px-3 py-2 text-sm ${
            error
              ? "border border-rose-200 bg-rose-50 text-rose-700"
              : "border border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {error ?? message}
        </div>
      )}

      <form action={handleSubmit} className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="md:col-span-2">
          <label htmlFor="accountId" className="mb-1 block text-xs font-medium text-slate-600">
            Account (Loan Number)
          </label>
          <select
            id="accountId"
            name="accountId"
            required
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400"
          >
            <option value="">Select account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.loanNumber} — {account.customerName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="visitDate" className="mb-1 block text-xs font-medium text-slate-600">
            Visit Date
          </label>
          <input
            id="visitDate"
            name="visitDate"
            type="date"
            required
            defaultValue={today}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="customerMet" className="rounded border-slate-300" />
            Customer Met
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="promiseToPay"
              checked={promiseToPay}
              onChange={(e) => setPromiseToPay(e.target.checked)}
              className="rounded border-slate-300"
            />
            Promise to Pay
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="settlementInterest" className="rounded border-slate-300" />
            Settlement Interest
          </label>
        </div>

        {promiseToPay && (
          <div>
            <label htmlFor="ptpAmount" className="mb-1 block text-xs font-medium text-slate-600">
              PTP Amount
            </label>
            <input
              id="ptpAmount"
              name="ptpAmount"
              type="number"
              min={1}
              step={0.01}
              required
              placeholder="Amount"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
          </div>
        )}

        <div className="md:col-span-2 xl:col-span-3">
          <label htmlFor="remarks" className="mb-1 block text-xs font-medium text-slate-600">
            Remarks
          </label>
          <input
            id="remarks"
            name="remarks"
            type="text"
            placeholder="Visit notes..."
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save Visit
          </button>
        </div>
      </form>
    </div>
  );
}
