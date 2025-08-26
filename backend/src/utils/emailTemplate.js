import sanitize from 'sanitize-html';

// Configuration object for branding and settings
const EMAIL_CONFIG = {
  companyName: 'Tetemeko Media Group',
  supportEmail: 'support@tetemeko.com',
  primaryColor: '#07131F',
  secondaryColor: '#59a6ff',
  backgroundColor: '#f1f4f6',
  year: new Date().getFullYear(),
  frontendUrl: process.env.FRONTEND_URL || 'https://tetemeko.com',
  templateVersion: '1.0.0'
};

// Template literal tag for safe HTML generation
const htmlTemplate = (strings, ...values) => {
  const sanitizedValues = values.map(value => 
    typeof value === 'string' ? sanitize(value, { allowedTags: [] }) : value
  );
  return String.raw({ raw: strings }, ...sanitizedValues);
};

// Base HTML template structure
const baseHtmlTemplate = ({ content, previewText, lang = 'en' }) => htmlTemplate`
  <!DOCTYPE html>
  <html lang="${lang}">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      :root {
        --primary-color: ${EMAIL_CONFIG.primaryColor};
        --secondary-color: ${EMAIL_CONFIG.secondaryColor};
        --background-color: ${EMAIL_CONFIG.backgroundColor};
        --text-color: #07131F;
        --muted-color: #4b5c6b;
      }
      body {
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 24px;
        background-color: var(--background-color);
        color: var(--text-color);
        line-height: 1.6;
      }
      .container {
        border-radius: 8px;
        padding: 24px;
        background-color: #ffffff;
      }
      h2 {
        color: var(--primary-color);
        margin-bottom: 16px;
      }
      a.button {
        display: inline-block;
        padding: 14px 28px;
        margin: 20px 0;
        background-color: var(--primary-color);
        color: #ffffff;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
        text-align: center;
      }
      hr {
        margin: 40px 0;
        border: none;
        border-top: 1px solid #ccc;
      }
      .footer {
        font-size: 14px;
        color: var(--muted-color);
        margin-top: 24px;
      }
      .footer a {
        color: var(--primary-color);
        text-decoration: underline;
      }
      @media (max-width: 600px) {
        body {
          padding: 16px;
        }
        .container {
          padding: 16px;
        }
        a.button {
          width: 100%;
          box-sizing: border-box;
        }
      }
    </style>
  </head>
  <body>
    <div style="display: none;">${previewText}</div>
    <main class="container" role="main">
      ${content}
      <hr>
      <footer class="footer">
        <p>Need help? Contact us at <a href="mailto:${EMAIL_CONFIG.supportEmail}">${EMAIL_CONFIG.supportEmail}</a></p>
        <p>&copy; ${EMAIL_CONFIG.year} ${EMAIL_CONFIG.companyName}. All rights reserved.</p>
        <p>Template version: ${EMAIL_CONFIG.templateVersion}</p>
      </footer>
    </main>
  </body>
  </html>
`;

// Plain text template helper
const plainTextTemplate = ({ content, lang = 'en' }) => `
${content}

---
Need help? Contact us at ${EMAIL_CONFIG.supportEmail}
© ${EMAIL_CONFIG.year} ${EMAIL_CONFIG.companyName}. All rights reserved.
Template version: ${EMAIL_CONFIG.templateVersion}
`;

/**
 * Generate email verification template
 * @param {string} name - User's name
 * @param {string} verificationLink - Email verification URL
 * @param {string} [lang='en'] - Language code
 * @returns {{ html: string, text: string }} HTML and plain text versions
 */
export const generateVerificationEmail = (name, verificationLink, lang = 'en') => {
  if (!process.env.FRONTEND_URL) {
    throw new Error('FRONTEND_URL environment variable is required');
  }

  const content = htmlTemplate`
    <h2 role="heading" aria-level="2">Welcome to ${EMAIL_CONFIG.companyName}, ${name}!</h2>
    <p>Thanks for joining our community. To get started, please verify your email address by clicking the button below:</p>
    <a href="${verificationLink}" class="button" role="button" aria-label="Verify email address">Verify My Email</a>
    <p>If you didn’t create an account, you can safely ignore this email.</p>
    <p style="font-style: italic;">This verification link is valid for the next 24 hours.</p>
  `;

  const textContent = plainTextTemplate({
    content: `
Welcome to ${EMAIL_CONFIG.companyName}, ${name}!

Thanks for joining our community. To get started, please verify your email address by visiting:
${verificationLink}

If you didn’t create an account, you can safely ignore this email.

This verification link is valid for the next 24 hours.
    `,
    lang
  });

  return {
    html: baseHtmlTemplate({ content, previewText: `Verify your ${EMAIL_CONFIG.companyName} account`, lang }),
    text: textContent
  };
};

/**
 * Generate verification success email
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @param {string} [lang='en'] - Language code
 * @returns {{ html: string, text: string }} HTML and plain text versions
 */
export const sendVerificationSuccessEmail = (name, email, lang = 'en') => {
  if (!process.env.FRONTEND_URL) {
    throw new Error('FRONTEND_URL environment variable is required');
  }

  const content = htmlTemplate`
    <h2 role="heading" aria-level="2">Email Verified Successfully, ${name}!</h2>
    <p>Your email (${email}) has been successfully verified. You can now log in to your ${EMAIL_CONFIG.companyName} account and start exploring our services.</p>
    <a href="${EMAIL_CONFIG.frontendUrl}/admin/login" class="button" role="button" aria-label="Login to account">Login to My Account</a>
    <p>If you have any questions, please contact our support team.</p>
  `;

  const textContent = plainTextTemplate({
    content: `
Email Verified Successfully, ${name}!

Your email (${email}) has been successfully verified. You can now log in to your ${EMAIL_CONFIG.companyName} account at:
${EMAIL_CONFIG.frontendUrl}/admin/login

If you have any questions, please contact our support team.
    `,
    lang
  });

  return {
    html: baseHtmlTemplate({ content, previewText: `Your ${EMAIL_CONFIG.companyName} email has been verified`, lang }),
    text: textContent
  };
};

/**
 * Generate password reset email
 * @param {string} name - User's name
 * @param {string} resetToken - Password reset token
 * @param {string} [lang='en'] - Language code
 * @returns {{ html: string, text: string }} HTML and plain text versions
 */
export const generateResetPasswordEmail = (name, resetToken, lang = 'en') => {
  if (!process.env.FRONTEND_URL) {
    throw new Error('FRONTEND_URL environment variable is required');
  }

  const resetLink = `${EMAIL_CONFIG.frontendUrl}/admin/reset-password?token=${resetToken}`;
  const content = htmlTemplate`
    <h2 role="heading" aria-level="2">Reset Your Password</h2>
    <p>Hello ${name || 'User'},</p>
    <p>We received a request to reset your password for your ${EMAIL_CONFIG.companyName} account. Click the button below to reset it:</p>
    <a href="${resetLink}" class="button" role="button" aria-label="Reset password">Reset Password</a>
    <p>This link will expire in 1 hour. If you didn’t request a password reset, you can safely ignore this email.</p>
  `;

  const textContent = plainTextTemplate({
    content: `
Reset Your Password

Hello ${name || 'User'},

We received a request to reset your password for your ${EMAIL_CONFIG.companyName} account. Visit the following link to reset it:
${resetLink}

This link will expire in 1 hour. If you didn’t request a password reset, you can safely ignore this email.
    `,
    lang
  });

  return {
    html: baseHtmlTemplate({ content, previewText: `Reset your ${EMAIL_CONFIG.companyName} password`, lang }),
    text: textContent
  };
};

/**
 * Generate password reset success email
 * @param {string} name - User's name
 * @param {string} [lang='en'] - Language code
 * @returns {{ html: string, text: string }} HTML and plain text versions
 */
export const generatePasswordResetSuccessEmail = (name, lang = 'en') => {
  if (!process.env.FRONTEND_URL) {
    throw new Error('FRONTEND_URL environment variable is required');
  }

  const content = htmlTemplate`
    <h2 role="heading" aria-level="2">Your Password Was Reset</h2>
    <p>Hi ${name || 'User'},</p>
    <p>Your password has been successfully reset. You can now log in with your new password.</p>
    <a href="${EMAIL_CONFIG.frontendUrl}/admin/login" class="button" role="button" aria-label="Go to login">Go to Login</a>
    <p>If you did not perform this action, please contact our support team immediately.</p>
  `;

  const textContent = plainTextTemplate({
    content: `
Your Password Was Reset

Hi ${name || 'User'},

Your password has been successfully reset. You can now log in with your new password at:
${EMAIL_CONFIG.frontendUrl}/admin/login

If you did not perform this action, please contact our support team immediately.
    `,
    lang
  });

  return {
    html: baseHtmlTemplate({ content, previewText: `Your ${EMAIL_CONFIG.companyName} password was reset`, lang }),
    text: textContent
  };
};

/**
 * Generate admin registration success email
 * @param {string} name - Admin's name
 * @param {string} [lang='en'] - Language code
 * @returns {{ html: string, text: string }} HTML and plain text versions
 */
export const generateAdminRegistrationSuccessEmail = (name, lang = 'en') => {
  if (!process.env.FRONTEND_URL) {
    throw new Error('FRONTEND_URL environment variable is required');
  }

  const content = htmlTemplate`
    <h2 role="heading" aria-level="2">Welcome aboard, ${name}!</h2>
    <p>Congratulations! Your admin account for ${EMAIL_CONFIG.companyName} has been successfully created and verified.</p>
    <p>You can now log in to the admin dashboard and start managing your platform.</p>
    <a href="${EMAIL_CONFIG.frontendUrl}/admin/login" class="button" role="button" aria-label="Go to admin login">Go to Admin Login</a>
    <p>If you did not register for an admin account, please contact support immediately.</p>
  `;

  const textContent = plainTextTemplate({
    content: `
Welcome aboard, ${name}!

Congratulations! Your admin account for ${EMAIL_CONFIG.companyName} has been successfully created and verified.

You can now log in to the admin dashboard at:
${EMAIL_CONFIG.frontendUrl}/admin/login

If you did not register for an admin account, please contact support immediately.
    `,
    lang
  });

  return {
    html: baseHtmlTemplate({ content, previewText: `Your ${EMAIL_CONFIG.companyName} admin account is ready`, lang }),
    text: textContent
  };
};