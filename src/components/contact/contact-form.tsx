"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { contactFields, contactSubjects, type ContactField, type ContactResult } from "@/lib/contact/model";
import { SecurityCheck } from "./security-check";

export function ContactForm() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ContactResult | null>(null);
  const [challenge, setChallenge] = useState<{ siteKey: string; attempt: number } | null>(null);
  const [token, setToken] = useState("");
  const startedAt = useRef(0);
  const submissionId = useRef("");
  const status = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const updateToken = useCallback((value: string) => setToken(value), []);
  useEffect(() => {
    startedAt.current = Date.now();
    const controller = new AbortController();
    fetch("/api/contact", { cache: "no-store", signal: AbortSignal.any([controller.signal, AbortSignal.timeout(5000)]) }).then(async (response) => {
      const body = await response.json(); setAvailable(response.ok && body.available === true);
    }).catch(() => { if (!controller.signal.aborted) setAvailable(false); });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (pending || !result) return;
    const first = contactFields.find((field) => result.errors?.[field]);
    const destination = first ? formRef.current?.elements.namedItem(first) : status.current;
    if (destination instanceof HTMLElement) destination.focus();
  }, [pending, result]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !available) return;
    const form = event.currentTarget;
    const errors: Partial<Record<ContactField, string>> = {};
    for (const field of contactFields) {
      const control = form.elements.namedItem(field) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      if (!control.checkValidity()) errors[field] = control.validationMessage;
    }
    if (Object.keys(errors).length) {
      setResult({ status: "error", message: "Please check the highlighted fields.", errors });
      return;
    }
    const values = new FormData(form);
    if (!submissionId.current) submissionId.current = crypto.randomUUID();
    const payload = { ...Object.fromEntries(values), startedAt: startedAt.current, submissionId: submissionId.current, token };
    setPending(true); setResult(null);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(35000) });
      const body = await response.json() as ContactResult;
      if (!["accepted", "accepted-without-receipt", "uncertain", "error", "challenge"].includes(body.status) || typeof body.message !== "string" || (body.status.startsWith("accepted") && response.status !== 202)) throw new Error("invalid-response");
      setResult(body);
      if (body.status === "challenge" && body.siteKey) setChallenge((previous) => ({ siteKey: body.siteKey!, attempt: (previous?.attempt ?? 0) + 1 }));
    } catch {
      setResult({ status: "uncertain", message: "Acceptance could not be confirmed. Your enquiry may have been accepted. Retry without editing the form to reduce duplicates, or email me directly." });
    } finally {
      setPending(false); setToken("");
      // Tokens are single-use; render a fresh check after every challenged attempt.
      setChallenge((previous) => previous ? { ...previous, attempt: previous.attempt + 1 } : null);
    }
  }

  const accepted = result?.status === "accepted" || result?.status === "accepted-without-receipt";
  function fieldError(field: ContactField) { return result?.errors?.[field] ? <span className="field-error" id={`${field}-error`}>{result.errors[field]}</span> : null; }
  const accessibility = (field: ContactField) => ({ "aria-invalid": Boolean(result?.errors?.[field]), "aria-describedby": [field === "message" ? "message-help" : "", result?.errors?.[field] ? `${field}-error` : ""].filter(Boolean).join(" ") || undefined });
  return <div className="contact-form-area">
    <div className="contact-feedback" ref={status} tabIndex={-1} role={result?.status === "error" || result?.status === "uncertain" ? "alert" : "status"} aria-live="polite">
      {pending ? <p>Sending your enquiry…</p> : result ? <p>{result.message}</p> : available === null ? <p className="muted">The form needs JavaScript to validate and submit. Please use the email link to get in touch.</p> : !available ? <p>The form is not accepting messages right now. Please use the email link.</p> : <p className="muted">All fields are required except phone.</p>}
    </div>
    {accepted ? <button className="button button-secondary" type="button" onClick={() => { setResult(null); setChallenge(null); startedAt.current = Date.now(); submissionId.current = ""; }}>Write another enquiry</button> : <form ref={formRef} onSubmit={submit} noValidate aria-label="Contact Selvarajalingam" aria-busy={pending} onChange={(event) => { const target = event.target; if ((target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) && contactFields.includes(target.name as ContactField)) submissionId.current = ""; }}>
      <fieldset disabled={pending}><legend className="sr-only">Your enquiry</legend>
        <div className="contact-fields"><div className="contact-field"><label htmlFor="name">Name</label><input id="name" name="name" autoComplete="name" maxLength={100} required {...accessibility("name")} />{fieldError("name")}</div>
        <div className="contact-field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="email" maxLength={254} required {...accessibility("email")} />{fieldError("email")}</div>
        <div className="contact-field"><label htmlFor="phone">Phone <span className="muted">(optional)</span></label><input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} {...accessibility("phone")} />{fieldError("phone")}</div>
        <div className="contact-field"><label htmlFor="subject">Subject</label><select id="subject" name="subject" defaultValue="" required {...accessibility("subject")}><option value="" disabled>Choose a subject</option>{contactSubjects.map((subject) => <option key={subject}>{subject}</option>)}</select>{fieldError("subject")}</div>
        <div className="contact-field contact-message"><label htmlFor="message">Message</label><textarea id="message" name="message" minLength={20} maxLength={5000} rows={7} required {...accessibility("message")} />{fieldError("message")}<span className="muted" id="message-help">20–5,000 characters. Please avoid sharing sensitive information.</span></div></div>
        <div className="contact-honeypot" aria-hidden="true"><label htmlFor="website">Leave this field empty<input id="website" name="website" autoComplete="off" tabIndex={-1} /></label></div>
        {challenge && <SecurityCheck key={challenge.attempt} siteKey={challenge.siteKey} onToken={updateToken} />}
        <p className="contact-privacy">By submitting this form, you acknowledge our <Link href="/privacy">Privacy Policy</Link>.</p>
        <button className="button button-primary" type="submit" disabled={pending || available !== true || Boolean(challenge && !token)}>{pending ? "Sending…" : "Send enquiry"}</button>
      </fieldset>
    </form>}
  </div>;
}
