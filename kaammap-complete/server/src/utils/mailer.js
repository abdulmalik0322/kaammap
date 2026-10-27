import nodemailer from 'nodemailer';
import { env, isProd } from '../config/env.js';

// Email sending.
// - If SMTP_HOST is configured, mail is sent through that SMTP provider.
// - Otherwise the mailer runs in DEV MODE: nothing is sent; the plain-text
//   version is written to the server console instead (so a developer can
//   still complete flows locally). Production responses never expose tokens
//   or codes — see the auth controller's dev-field gating.
let transporter = null;

export function mailConfigured() {
  return Boolean(env.SMTP_HOST);
}

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    });
  }
  return transporter;
}

export async function sendMail({ to, subject, text, html }) {
  if (!mailConfigured()) {
    console.log(
      `\n[DEV EMAIL — not sent, SMTP not configured] To: ${to} | Subject: ${subject}\n${text}\n`
    );
    return { sent: false, dev: true };
  }
  await getTransporter().sendMail({ from: env.EMAIL_FROM, to, subject, text, html });
  return { sent: true, dev: false };
}

export function actionLink(path, token) {
  const base = (env.CLIENT_BASE_URL || '').replace(/\/$/, '');
  return `${base}${path}?token=${encodeURIComponent(token)}`;
}

// ---------- Branded HTML templates ----------
// Table-based layout + inline styles only: the combination email clients
// (Gmail, Outlook, Apple Mail) render reliably. Brand colours match the app:
// deep green #173D32, forest #237A57, lime #D9F36A, ivory #F8F7F2.

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function emailShell({ heading, bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#F8F7F2;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8F7F2;padding:28px 12px;">
<tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E4E8E0;">
  <tr><td style="background-color:#173D32;padding:26px 36px;">
    <span style="font-size:24px;font-weight:bold;color:#ffffff;letter-spacing:0.5px;">KAAM<span style="color:#D9F36A;">MAP</span></span>
    <div style="color:#BFD8CB;font-size:12px;margin-top:4px;">Har Kaam Ka Aasan Raasta</div>
  </td></tr>
  <tr><td style="padding:32px 36px 8px 36px;">
    <h1 style="margin:0 0 14px 0;font-size:21px;color:#173D32;">${heading}</h1>
    ${bodyHtml}
  </td></tr>
  <tr><td style="padding:18px 36px 28px 36px;">
    <p style="margin:0;font-size:12px;line-height:1.6;color:#626D65;">KAAMMAP helps people in Pakistan understand what a task needs — documents, official fees, where to apply, and the next step. KAAMMAP is an independent information platform and is not a government website.</p>
  </td></tr>
</table>
<p style="margin:14px 0 0 0;font-size:11px;color:#8A948C;">You received this email because this address is used with a KAAMMAP account.</p>
</td></tr></table>
</body></html>`;
}

function greeting(name) {
  return `<p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:#20251F;">Assalam-o-Alaikum <strong>${escapeHtml(name)}</strong>,</p>`;
}

export function buildPasswordResetCodeEmail(user, code) {
  const subject = 'Your KAAMMAP password reset code';
  const text = `Assalam-o-Alaikum ${user.name},\n\nYour KAAMMAP password reset code is: ${code}\n\nEnter this 6-digit code on the reset page to choose a new password. The code is valid for 10 minutes and allows only a few attempts. Never share this code with anyone — KAAMMAP will never call or message you to ask for it.\n\nIf you did not request this, you can ignore this email — your password will not change.\n\nKAAMMAP is an independent information platform and is not a government website.`;
  const html = emailShell({
    heading: 'Reset your password',
    bodyHtml: `${greeting(user.name)}
    <p style="margin:0 0 18px 0;font-size:15px;line-height:1.65;color:#20251F;">We received a request to reset the password of your KAAMMAP account. Please enter the following code on the reset page:</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="background-color:#EAF3EC;border:1px solid #CBE0D2;border-radius:14px;padding:22px 10px;">
      <div style="font-size:12px;font-weight:bold;letter-spacing:2px;color:#237A57;">YOUR 6-DIGIT CODE</div>
      <div style="font-size:38px;font-weight:bold;letter-spacing:10px;color:#173D32;font-family:'Courier New',monospace;margin-top:8px;">${escapeHtml(code)}</div>
    </td></tr></table>
    <p style="margin:18px 0 0 0;font-size:14px;line-height:1.65;color:#20251F;">This code is valid for <strong>10 minutes</strong> and allows only a few attempts.</p>
    <p style="margin:10px 0 0 0;font-size:14px;line-height:1.65;color:#20251F;"><strong>Never share this code with anyone.</strong> KAAMMAP will never call or message you to ask for it.</p>
    <p style="margin:10px 0 0 0;font-size:14px;line-height:1.65;color:#626D65;">If you did not request a password reset, you can safely ignore this email — your password will not change.</p>`,
  });
  return { subject, text, html };
}

export function buildVerificationEmail(user, rawToken) {
  const link = actionLink('/verify-email', rawToken);
  const subject = 'Verify your KAAMMAP email address';
  const text = `Assalam-o-Alaikum ${user.name},\n\nWelcome to KAAMMAP. Please verify your account email by opening this link (valid for 24 hours):\n${link}\n\nIf you did not create this account, you can ignore this email.\n\nKAAMMAP is an independent information platform and is not a government website.`;
  const html = emailShell({
    heading: 'Verify your email address',
    bodyHtml: `${greeting(user.name)}
    <p style="margin:0 0 20px 0;font-size:15px;line-height:1.65;color:#20251F;">Welcome to KAAMMAP. Please confirm that this is your email address by clicking the button below. The link is valid for <strong>24 hours</strong>.</p>
    <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background-color:#237A57;border-radius:999px;">
      <a href="${escapeHtml(link)}" style="display:inline-block;padding:13px 30px;font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;">Verify My Email</a>
    </td></tr></table>
    <p style="margin:20px 0 0 0;font-size:13px;line-height:1.6;color:#626D65;">If the button does not work, open this link in your browser:<br><a href="${escapeHtml(link)}" style="color:#237A57;">${escapeHtml(link)}</a></p>
    <p style="margin:12px 0 0 0;font-size:14px;line-height:1.65;color:#626D65;">If you did not create this account, you can safely ignore this email.</p>`,
  });
  return { subject, text, html };
}

export async function sendVerificationEmail(user, rawToken) {
  const { subject, text, html } = buildVerificationEmail(user, rawToken);
  return sendMail({ to: user.email, subject, text, html });
}

export async function sendPasswordResetCodeEmail(user, code) {
  const { subject, text, html } = buildPasswordResetCodeEmail(user, code);
  return sendMail({ to: user.email, subject, text, html });
}

export { isProd };
