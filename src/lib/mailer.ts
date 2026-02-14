import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.SMTP_FROM || "Projet Carthage <noreply@example.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/* ═══ SEND VERIFICATION EMAIL ═══ */

export async function sendVerificationEmail(to: string, displayName: string, token: string) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a14;font-family:'Segoe UI',system-ui,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <img src="${APP_URL}/images/carthage_logo.png" alt="Carthage" width="48" height="48" style="display:inline-block;margin-bottom:12px;" />
      <h1 style="margin:0;font-size:20px;font-weight:700;color:#00d4ff;letter-spacing:3px;">PROJET CARTHAGE</h1>
    </div>

    <!-- Card -->
    <div style="background:#12121f;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:32px 28px;">
      <h2 style="margin:0 0 8px;font-size:22px;color:#ffffff;font-weight:700;">Bienvenue, ${displayName} !</h2>
      <p style="margin:0 0 24px;font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6;">
        Merci de vous être inscrit sur Projet Carthage. Pour activer votre compte et commencer à coder, veuillez confirmer votre adresse email.
      </p>

      <!-- Button -->
      <div style="text-align:center;margin:28px 0;">
        <a href="${verifyUrl}" style="display:inline-block;padding:14px 36px;background:#00d4ff;color:#0a0a14;font-size:14px;font-weight:700;text-decoration:none;border-radius:12px;letter-spacing:0.5px;">
          ✓ Confirmer mon email
        </a>
      </div>

      <p style="margin:0 0 16px;font-size:12px;color:rgba(255,255,255,0.25);line-height:1.6;">
        Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :
      </p>
      <p style="margin:0;font-size:11px;color:#00d4ff;word-break:break-all;background:rgba(0,212,255,0.05);padding:10px 14px;border-radius:8px;border:1px solid rgba(0,212,255,0.1);">
        ${verifyUrl}
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:28px;">
      <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.15);">
        Ce lien expire dans 24 heures.
      </p>
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.1);">
        Code Lyoko © MoonScoop — Fan Project
      </p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: FROM,
    to,
    subject: "✉ Confirmez votre email — Projet Carthage",
    html,
  });
}

/* ═══ SEND WELCOME EMAIL (after verification) ═══ */

export async function sendWelcomeEmail(to: string, displayName: string) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a14;font-family:'Segoe UI',system-ui,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <img src="${APP_URL}/images/carthage_logo.png" alt="Carthage" width="48" height="48" style="display:inline-block;margin-bottom:12px;" />
      <h1 style="margin:0;font-size:20px;font-weight:700;color:#00d4ff;letter-spacing:3px;">PROJET CARTHAGE</h1>
    </div>

    <!-- Card -->
    <div style="background:#12121f;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:32px 28px;">
      <h2 style="margin:0 0 8px;font-size:22px;color:#ffffff;font-weight:700;">🎉 Compte activé !</h2>
      <p style="margin:0 0 20px;font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6;">
        Félicitations ${displayName}, votre email est vérifié et votre compte est maintenant actif !
      </p>

      <div style="background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.12);border-radius:12px;padding:16px;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.6;">
          <strong style="color:#00ff88;">1100+ exercices</strong> vous attendent dans <strong style="color:#00ff88;">8 modules</strong> :
          Front-End, JavaScript, Python, Dart, React, Node.js, C/C++ et C#.
        </p>
      </div>

      <!-- Button -->
      <div style="text-align:center;">
        <a href="${APP_URL}/dashboard" style="display:inline-block;padding:14px 36px;background:#00ff88;color:#0a0a14;font-size:14px;font-weight:700;text-decoration:none;border-radius:12px;letter-spacing:0.5px;">
          🚀 Commencer à coder
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:28px;">
      <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.1);">
        Code Lyoko © MoonScoop — Fan Project
      </p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: FROM,
    to,
    subject: "🎉 Bienvenue sur Projet Carthage !",
    html,
  });
}
