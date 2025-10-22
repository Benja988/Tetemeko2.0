import nodemailer from 'nodemailer';
import sanitize from 'sanitize-html';
import logger from './logger.js';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
config();

// Email configuration with defaults
const EMAIL_CONFIG = {
  service: process.env.EMAIL_SERVICE || 'gmail',
  user: process.env.EMAIL_USER || '',
  pass: process.env.EMAIL_PASS || '',
  from: process.env.EMAIL_FROM || '"Tetemeko Media Group" <no-reply@tetemeko.com>',
  maxRetries: Number(process.env.EMAIL_MAX_RETRIES) || 3,
  retryDelay: Number(process.env.EMAIL_RETRY_DELAY) || 1000, // ms
  maxEmailsPerMinute: Number(process.env.EMAIL_RATE_LIMIT) || 100,
};

// Validate required environment variables
const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    logger.error(`${varName} is not defined in environment variables`);
    throw new Error(`${varName} is not defined`);
  }
});

// Create email transporter
const transporter = nodemailer.createTransport({
  service: EMAIL_CONFIG.service,
  auth: {
    user: EMAIL_CONFIG.user,
    pass: EMAIL_CONFIG.pass,
  },
  tls: {
    rejectUnauthorized: false, // Handle self-signed certificates
  },
});

// Simple in-memory queue for email sending
const emailQueue = [];
let isProcessingQueue = false;

/**
 * Validate email content and recipients
 * @param {string|string[]} to - Recipient email(s)
 * @param {string} subject - Email subject
 * @param {{ html: string, text: string }} content - Email content (HTML and plain text)
 * @returns {Object} Validated and sanitized email data
 */
const validateEmail = (to, subject, content) => {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  // Validate recipients
  const recipients = Array.isArray(to) ? to : [to];
  if (!recipients.every((email) => emailRegex.test(email))) {
    throw new Error('Invalid recipient email address');
  }

  // Validate subject
  if (!subject || typeof subject !== 'string' || subject.length > 998) {
    throw new Error('Invalid or too long subject line');
  }

  // Validate content
  if (!content || (!content.html && !content.text)) {
    throw new Error('Email content (HTML or text) is required');
  }

  // Sanitize inputs
  return {
    to: recipients.map((email) => sanitize(email, { allowedTags: [] })),
    subject: sanitize(subject, { allowedTags: [] }),
    html: content.html
      ? sanitize(content.html, {
          allowedTags: [
            'div', 'p', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'hr', 'br',
            'span', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'tfoot',
          ],
          allowedAttributes: {
            '*': ['style', 'role', 'aria-label', 'aria-level'],
            'a': ['href'],
          },
        })
      : undefined,
    text: content.text ? sanitize(content.text, { allowedTags: [] }) : undefined,
  };
};

/**
 * Process email queue
 */
const processQueue = async () => {
  if (isProcessingQueue || emailQueue.length === 0) return;

  isProcessingQueue = true;
  while (emailQueue.length > 0) {
    const { mailOptions, resolve, reject, retries = 0 } = emailQueue.shift();

    try {
      const info = await transporter.sendMail({
        ...mailOptions,
        headers: {
          'X-Correlation-ID': mailOptions.correlationId || uuidv4(),
          'X-Priority': mailOptions.priority || '3', // Normal priority
        },
      });

      logger.info('Email sent successfully', {
        messageId: info.messageId,
        to: mailOptions.to,
        subject: mailOptions.subject,
        correlationId: mailOptions.correlationId,
      });

      resolve(info);
    } catch (error) {
      if (retries < EMAIL_CONFIG.maxRetries) {
        logger.warn('Retrying email send', {
          to: mailOptions.to,
          subject: mailOptions.subject,
          retryCount: retries + 1,
          error: error.message,
        });

        setTimeout(() => {
          emailQueue.push({
            mailOptions,
            resolve,
            reject,
            retries: retries + 1,
          });
        }, EMAIL_CONFIG.retryDelay);
      } else {
        logger.error('Failed to send email after retries', {
          to: mailOptions.to,
          subject: mailOptions.subject,
          error: error.message,
          correlationId: mailOptions.correlationId,
        });
        reject(new Error(`Failed to send email: ${error.message}`));
      }
    }
  }

  isProcessingQueue = false;
};

/**
 * Send email with retry and queueing
 * @param {string|string[]} to - Recipient email(s)
 * @param {string} subject - Email subject
 * @param {{ html: string, text: string }} content - Email content (HTML and plain text)
 * @returns {Promise} Resolves with email info or rejects with error
 */
export const sendEmail = async (to, subject, content) => {
  try {
    // Validate and sanitize inputs
    const validated = validateEmail(to, subject, content);

    // Prepare mail options
    const mailOptions = {
      from: EMAIL_CONFIG.from,
      to: validated.to,
      subject: validated.subject,
      html: validated.html,
      text: validated.text,
      correlationId: uuidv4(),
    };

    // Return promise for queue processing
    return new Promise((resolve, reject) => {
      emailQueue.push({ mailOptions, resolve, reject });
      processQueue();
    });
  } catch (error) {
    logger.error('Email validation error', {
      to,
      subject,
      error: error.message,
      correlationId: mailOptions?.correlationId,
    });
    throw error;
  }
};

// Initialize logger with email service info
logger.info('Email service initialized', {
  service: EMAIL_CONFIG.service,
  from: EMAIL_CONFIG.from,
});