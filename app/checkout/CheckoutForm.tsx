"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import JudetSelector from "../../components/JudetSelector";
import LocalitateSelector from "../../components/LocalitateSelector";
import { DPD_COUNTRIES } from "@/lib/shippingUtils";
import { COUNTRY_REGIONS } from "@/lib/regionsData";

type Address = {
    nume_prenume: string;
    email: string;
    telefon: string;
    judet: string;
    localitate: string;
    strada_nr: string;
    postCode?: string;
    country?: string;
};

type Billing = {
    tip_factura: "persoana_fizica" | "persoana_juridica";
    name?: string;
    email?: string;
    telefon?: string;
    denumire_companie?: string;
    cui?: string;
    reg_com?: string;
    judet?: string;
    localitate?: string;
    strada_nr?: string;
    postCode?: string;
    country?: string;
};

export default function CheckoutForm({
    address,
    setAddress,
    billing,
    setBilling,
    sameAsDelivery,
    setSameAsDelivery,
    errors,
}: {
    address: Address;
    setAddress: (updater: (a: Address) => Address) => void;
    billing: Billing;
    setBilling: (updater: (b: Billing) => Billing) => void;
    sameAsDelivery: boolean;
    setSameAsDelivery: (v: boolean) => void;
    errors: Record<string, string>;
}) {
    const onAddr = (k: keyof Address, v: string) => setAddress((a) => ({ ...a, [k]: v }));
    const onBill = <K extends keyof Billing>(k: K, v: Billing[K]) => setBilling((b) => ({ ...b, [k]: v }));

    const AUTO_FILL_FIELDS: (keyof Billing)[] = ["denumire_companie", "reg_com", "judet", "localitate", "strada_nr", "postCode", "telefon"];
    const [fetchingCompany, setFetchingCompany] = useState(false);
    const [cuiError, setCuiError] = useState<string | null>(null);
    const [companyIdentified, setCompanyIdentified] = useState(false);
    const lastFetchedCui = useRef("");
    const userEditedFields = useRef(new Set<keyof Billing>());
    // Ultimul CUI aflat efectiv in campul de input, actualizat live - folosit
    // ca sa ignoram un raspuns ANAF intarziat daca utilizatorul a schimbat
    // deja CUI-ul cat timp cererea era in zbor (race condition).
    const liveCuiRef = useRef(billing.cui || "");
    useEffect(() => {
        liveCuiRef.current = billing.cui || "";
    }, [billing.cui]);

    const markBillEdited = <K extends keyof Billing>(k: K, v: Billing[K]) => {
        if (AUTO_FILL_FIELDS.includes(k)) userEditedFields.current.add(k);
        onBill(k, v);
    };

    const resetAutofillLocks = (cleanCui: string) => {
        if (cleanCui !== lastFetchedCui.current) {
            AUTO_FILL_FIELDS.forEach((field) => userEditedFields.current.delete(field));
        }
    };

    const fetchCompanyData = useCallback(async (cui: string) => {
        if (billing.tip_factura !== "persoana_juridica") return;

        const cleanCui = cui.replace(/\D/g, "");
        if (!cleanCui || cleanCui.length < 3) return;
        if (cleanCui === lastFetchedCui.current) return;

        setFetchingCompany(true);
        setCuiError(null);

        try {
            const res = await fetch(`/api/company?cui=${encodeURIComponent(cui)}`);
            const data = await res.json();

            if (!res.ok) {
                setCuiError(data.error || "Compania nu a fost găsită");
                return;
            }

            const currentCleanCui = (liveCuiRef.current || "").replace(/\D/g, "");
            if (currentCleanCui !== cleanCui) {
                // Utilizatorul a schimbat deja CUI-ul cat timp astepta acest
                // raspuns - il ignoram ca sa nu suprascriem cu firma veche.
                return;
            }

            lastFetchedCui.current = cleanCui;
            setCompanyIdentified(true);

            setBilling((prev) => {
                const next = { ...prev };

                const fill = (field: keyof Billing, value?: string) => {
                    if (!value) return;
                    if (userEditedFields.current.has(field) && prev[field]) return;
                    (next as Record<keyof Billing, Billing[keyof Billing]>)[field] = value as Billing[keyof Billing];
                };

                fill("denumire_companie", data.denumire);
                fill("reg_com", data.regCom);
                fill("telefon", data.telefon);

                if (!sameAsDelivery) {
                    fill("judet", data.judet);
                    fill("localitate", data.localitate);
                    fill("strada_nr", data.adresa);
                    fill("postCode", data.codPostal);
                    next.country = "RO";
                }

                return next;
            });
        } catch {
            setCuiError("Serviciul ANAF este indisponibil");
        } finally {
            setFetchingCompany(false);
        }
    }, [billing.tip_factura, sameAsDelivery, setBilling]);

    useEffect(() => {
        if (billing.tip_factura !== "persoana_juridica") return;
        const cleanCui = (billing.cui || "").replace(/\D/g, "");
        if (cleanCui && billing.denumire_companie) {
            lastFetchedCui.current = cleanCui;
            setCompanyIdentified(true);
        }
    }, [billing.tip_factura, billing.cui, billing.denumire_companie]);

    useEffect(() => {
        if (billing.tip_factura !== "persoana_juridica") return;

        const cui = billing.cui || "";
        const cleanCui = cui.replace(/\D/g, "");
        if (cleanCui.length < 3) return;
        if (cleanCui === lastFetchedCui.current) return;

        const timer = setTimeout(() => {
            void fetchCompanyData(cui);
        }, 600);

        return () => clearTimeout(timer);
    }, [billing.cui, billing.tip_factura, fetchCompanyData]);

    useEffect(() => {
        if (!sameAsDelivery) return;
        setBilling((b) => ({
            ...b,
            name: address.nume_prenume,
            judet: address.judet,
            localitate: address.localitate,
            strada_nr: address.strada_nr,
            postCode: address.postCode,
            country: address.country,
        }));
    }, [sameAsDelivery, address.nume_prenume, address.judet, address.localitate, address.strada_nr, address.postCode, address.country]);

    return (
        <div className="space-y-8">
            {/* 1. LIVRARE */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm shadow-lg shadow-emerald-600/30 font-black">1</span>
                    Date de livrare
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <Field id="address.country" label="Țară">
                            <select className={inputCls()} value={address.country || 'RO'} onChange={(e) => { const c = e.target.value; setAddress(a => ({ ...a, country: c, judet: '', localitate: '' })); }}>
                                {DPD_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                            </select>
                        </Field>
                    </div>
                    <div className="md:col-span-2">
                        <Field id="address.nume_prenume" label="Nume și Prenume" error={errors["address.nume_prenume"]}>
                            <input className={inputCls(errors["address.nume_prenume"])} value={address.nume_prenume} onChange={(e) => onAddr("nume_prenume", e.target.value)} placeholder="ex: Popescu Ion" />
                        </Field>
                    </div>
                    <div className="md:col-span-2">
                        <Field id="address.telefon" label="Telefon" error={errors["address.telefon"]}>
                            <input className={inputCls(errors["address.telefon"])} value={address.telefon} onChange={(e) => onAddr("telefon", e.target.value)} placeholder="07xxxxxxxx" />
                        </Field>
                    </div>
                    <div className="md:col-span-2">
                        <Field id="address.email" label="Email" error={errors["address.email"]}>
                            <input className={inputCls(errors["address.email"])} value={address.email} onChange={(e) => onAddr("email", e.target.value)} placeholder="email@exemplu.ro" />
                        </Field>
                    </div>

                    {(!address.country || address.country === 'RO') ? (
                        <>
                            <div className="md:col-span-2">
                                <JudetSelector label="Județ" value={address.judet} onChange={v => onAddr("judet", v)} />
                                {errors["address.judet"] && <p className="mt-1 text-xs text-red-500">{errors["address.judet"]}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <LocalitateSelector label="Localitate" judet={address.judet} value={address.localitate} onChange={v => onAddr("localitate", v)} onPostCodeChange={pc => onAddr("postCode", pc)} />
                                {errors["address.localitate"] && <p className="mt-1 text-xs text-red-500">{errors["address.localitate"]}</p>}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="md:col-span-2">
                                {address.country && COUNTRY_REGIONS[address.country] ? (
                                    <Field id="address.judet" label="Regiune / Stat" error={errors["address.judet"]}>
                                        <select className={inputCls(errors["address.judet"])} value={address.judet} onChange={e => onAddr("judet", e.target.value)}>
                                            <option value="">Selectează regiunea</option>
                                            {COUNTRY_REGIONS[address.country].map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </Field>
                                ) : (
                                    <Field id="address.judet" label="Regiune / Stat" error={errors["address.judet"]}>
                                        <input className={inputCls(errors["address.judet"])} value={address.judet} onChange={e => onAddr("judet", e.target.value)} placeholder="Regiune" />
                                    </Field>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <Field id="address.localitate" label="Oraș / Localitate" error={errors["address.localitate"]}>
                                    <input className={inputCls(errors["address.localitate"])} value={address.localitate} onChange={e => onAddr("localitate", e.target.value)} placeholder="Oraș" />
                                </Field>
                            </div>
                        </>
                    )}

                    <div className="md:col-span-3">
                        <Field id="address.strada_nr" label="Adresă" error={errors["address.strada_nr"]}>
                            <input className={inputCls(errors["address.strada_nr"])} value={address.strada_nr} onChange={(e) => onAddr("strada_nr", e.target.value)} placeholder="Stradă, număr, bloc..." />
                        </Field>
                    </div>
                    <div className="md:col-span-1">
                        <Field id="address.postCode" label="Cod poștal">
                            <input className={inputCls()} value={address.postCode || ""} onChange={(e) => onAddr("postCode", e.target.value)} placeholder="000000" />
                        </Field>
                    </div>
                </div>
            </div>

            {/* 2. FACTURARE */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm shadow-lg shadow-emerald-600/30 font-black">2</span>
                    Detalii Facturare
                </h2>

                <div className="flex w-full overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl mb-6 p-1 bg-slate-50 dark:bg-slate-950 max-w-sm">
                    <button type="button" onClick={() => { onBill("tip_factura", "persoana_fizica"); setCompanyIdentified(false); }} className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition-all duration-200 ${billing.tip_factura === "persoana_fizica" ? "bg-white dark:bg-slate-800 text-emerald-600 shadow-sm" : "text-slate-500"}`}>Persoană fizică</button>
                    <button type="button" onClick={() => onBill("tip_factura", "persoana_juridica")} className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition-all duration-200 ${billing.tip_factura === "persoana_juridica" ? "bg-white dark:bg-slate-800 text-emerald-600 shadow-sm" : "text-slate-500"}`}>Persoană juridică</button>
                </div>

                <div className="mb-6">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input type="checkbox" checked={sameAsDelivery} onChange={(e) => setSameAsDelivery(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                        <span className="text-slate-700 dark:text-slate-300 font-bold text-sm">Adresa de facturare coincide cu cea de livrare</span>
                    </label>
                </div>

                {billing.tip_factura === "persoana_juridica" && (
                    <div className="bg-emerald-50/30 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-6 mb-6 space-y-4">
                        <Field id="billing.cui" label="CUI / CIF *" error={errors["billing.cui"] || cuiError || undefined}>
                            <div className="relative max-w-md">
                                <input
                                    className={`${inputCls(errors["billing.cui"] || cuiError || undefined)} pr-10`}
                                    value={billing.cui || ""}
                                    onChange={e => {
                                        const value = e.target.value;
                                        const cleanCui = value.replace(/\D/g, "");
                                        resetAutofillLocks(cleanCui);
                                        if (cleanCui !== lastFetchedCui.current) {
                                            setCompanyIdentified(false);
                                            setBilling((b) => ({
                                                ...b,
                                                cui: value,
                                                denumire_companie: "",
                                                reg_com: "",
                                            }));
                                        } else {
                                            onBill("cui", value);
                                        }
                                        setCuiError(null);
                                    }}
                                    onBlur={() => void fetchCompanyData(billing.cui || "")}
                                    placeholder="ex: 12345678"
                                />
                                {fetchingCompany && (
                                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-emerald-600" />
                                )}
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                                Introdu CUI-ul firmei — datele se completează automat din ANAF.
                            </p>
                        </Field>

                        {companyIdentified && billing.denumire_companie && (
                            <div className="rounded-xl border border-emerald-200 bg-white dark:bg-slate-900 p-4 space-y-2">
                                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Date firmă identificate</p>
                                <CompanyDataRow label="Denumire" value={billing.denumire_companie} />
                                <CompanyDataRow label="CUI / CIF" value={billing.cui} />
                                {billing.reg_com && <CompanyDataRow label="Reg. Com." value={billing.reg_com} />}
                                {billing.telefon && <CompanyDataRow label="Telefon" value={billing.telefon} />}
                                {!sameAsDelivery && billing.strada_nr && (
                                    <>
                                        <CompanyDataRow
                                            label="Adresă sediu social"
                                            value={[billing.strada_nr, billing.localitate, billing.judet, billing.postCode].filter(Boolean).join(", ")}
                                        />
                                    </>
                                )}
                                {sameAsDelivery && (
                                    <p className="text-xs text-slate-500 pt-1">
                                        Adresa de facturare coincide cu adresa de livrare.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {!sameAsDelivery && billing.tip_factura !== "persoana_juridica" && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="md:col-span-2">
                            <Field id="billing.country" label="Țară Facturare">
                                <select className={inputCls()} value={billing.country || 'RO'} onChange={e => { const c = e.target.value; setBilling(b => ({ ...b, country: c, judet: '', localitate: '' })); }}>
                                    {DPD_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                                </select>
                            </Field>
                        </div>

                        {billing.tip_factura === 'persoana_fizica' && (
                            <>
                                <div className="md:col-span-2">
                                    <Field id="billing.name" label="Nume și Prenume" error={errors["billing.name"]}>
                                        <input className={inputCls(errors["billing.name"])} value={billing.name || ""} onChange={e => onBill("name", e.target.value)} />
                                    </Field>
                                </div>
                                <div className="md:col-span-2">
                                    <Field id="billing.email" label="Email" error={errors["billing.email"]}>
                                        <input className={inputCls(errors["billing.email"])} value={billing.email || ""} onChange={e => onBill("email", e.target.value)} />
                                    </Field>
                                </div>
                                <div className="md:col-span-2">
                                    <Field id="billing.telefon" label="Telefon" error={errors["billing.telefon"]}>
                                        <input className={inputCls(errors["billing.telefon"])} value={billing.telefon || ""} onChange={e => onBill("telefon", e.target.value)} />
                                    </Field>
                                </div>
                            </>
                        )}

                        {(!billing.country || billing.country === 'RO') ? (
                            <>
                                <div className="md:col-span-2">
                                    <JudetSelector label="Județ (facturare)" value={billing.judet || ""} onChange={v => markBillEdited("judet", v)} />
                                    {errors["billing.judet"] && <p className="mt-1 text-xs text-red-500">{errors["billing.judet"]}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <LocalitateSelector label="Localitate (facturare)" judet={billing.judet || ""} value={billing.localitate || ""} onChange={v => markBillEdited("localitate", v)} onPostCodeChange={pc => markBillEdited("postCode", pc)} />
                                    {errors["billing.localitate"] && <p className="mt-1 text-xs text-red-500">{errors["billing.localitate"]}</p>}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="md:col-span-2">
                                    {billing.country && COUNTRY_REGIONS[billing.country] ? (
                                        <Field id="billing.judet" label="Regiune (facturare)">
                                            <select className={inputCls()} value={billing.judet || ""} onChange={e => onBill("judet", e.target.value)}>
                                                <option value="">Alege regiunea</option>
                                                {COUNTRY_REGIONS[billing.country].map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                        </Field>
                                    ) : (
                                        <Field id="billing.judet" label="Regiune (facturare)">
                                            <input className={inputCls()} value={billing.judet || ""} onChange={e => onBill("judet", e.target.value)} />
                                        </Field>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <Field id="billing.localitate" label="Oraș (facturare)">
                                        <input className={inputCls()} value={billing.localitate || ""} onChange={e => onBill("localitate", e.target.value)} />
                                    </Field>
                                </div>
                            </>
                        )}

                        <div className="md:col-span-3">
                            <Field id="billing.strada_nr" label="Adresă (Sediul social / Domiciliu)" error={errors["billing.strada_nr"]}>
                                <input className={inputCls(errors["billing.strada_nr"])} value={billing.strada_nr || ""} onChange={e => markBillEdited("strada_nr", e.target.value)} placeholder="Stradă, număr, etc." />
                            </Field>
                        </div>
                        <div className="md:col-span-1">
                            <Field id="billing.postCode" label="Cod poștal">
                                <input className={inputCls()} value={billing.postCode || ""} onChange={e => onBill("postCode", e.target.value)} placeholder="000000" />
                            </Field>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function CompanyDataRow({ label, value }: { label: string; value?: string }) {
    if (!value) return null;
    return (
        <div className="flex flex-col sm:flex-row sm:gap-3 text-sm border-b border-slate-100 dark:border-slate-800 last:border-0 pb-2 last:pb-0">
            <span className="font-semibold text-slate-600 dark:text-slate-400 shrink-0 sm:w-36">{label}</span>
            <span className="text-slate-900 dark:text-slate-100 font-medium">{value}</span>
        </div>
    );
}

function Field({ id, label, error, children, disabled }: { id: string; label: string; error?: string; children: React.ReactNode; disabled?: boolean }) {
    return (
        <div className={`text-sm block ${disabled ? "opacity-60 pointer-events-none" : ""}`}>
            <span className="mb-1.5 block font-bold text-slate-700 dark:text-slate-200">{label}</span>
            {children}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

function inputCls(hasError?: string, disabled?: boolean) {
    return `w-full rounded-xl border px-4 py-2.5 focus:outline-none focus:ring-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:ring-emerald-500 placeholder-slate-400 transition-all font-medium ${hasError ? "border-red-500 ring-1 ring-red-500/20" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;
}

