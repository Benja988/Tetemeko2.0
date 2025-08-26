import { createLogger, format, transports } from 'winston';
import sanitize from 'sanitize-html';
import { v4 as uuidv4 } from 'uuid';
import DailyRotateFile from 'winston-daily-rotate-file'; 

// Custom log levels
const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
    audit: 6
  },
  colors: {
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
    trace: 'cyan',
    audit: 'magenta'
  }
};

// Validate log level
const validLogLevels = Object.keys(customLevels.levels);
const logLevel = validLogLevels.includes(process.env.LOG_LEVEL?.toLowerCase())
  ? process.env.LOG_LEVEL.toLowerCase()
  : 'info';

// Custom format to include correlation ID and sanitize messages
const customFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  format.errors({ stack: true }),
  format((info) => {
    // Sanitize message and meta fields
    if (typeof info.message === 'string') {
      info.message = sanitize(info.message, { allowedTags: [] });
    }
    if (info.meta && typeof info.meta === 'object') {
      Object.keys(info.meta).forEach(key => {
        if (typeof info.meta[key] === 'string') {
          info.meta[key] = sanitize(info.meta[key], { allowedTags: [] });
        }
      });
    }
    // Add correlation ID if not present
    info.correlationId = info.correlationId || uuidv4();
    return info;
  })(),
  format.json()
);

// Development console format
const devConsoleFormat = format.combine(
  format.colorize({ all: true }),
  format.printf(({ level, message, timestamp, correlationId, stack, ...meta }) => {
    const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `[${timestamp}] ${level} [${correlationId}]: ${message}${stack ? `\n${stack}` : ''}${metaString}`;
  })
);

// File rotation configuration
const fileRotateTransport = (filename, level) => new DailyRotateFile({
  filename: `logs/${filename}-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level
});

// Logger configuration
const logger = createLogger({
  levels: customLevels.levels,
  level: logLevel,
  format: customFormat,
  transports: [
    // Console transport for all environments
    new transports.Console({
      format: process.env.NODE_ENV === 'production' ? customFormat : devConsoleFormat
    }),
    // Error log file with rotation
    fileRotateTransport('error', 'error'),
    // Combined log file with rotation
    fileRotateTransport('combined', logLevel)
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' })
  ],
  rejectionHandlers: [
    new transports.File({ filename: 'logs/rejections.log' })
  ]
});

// Remote logging configuration (e.g., for Logstash or CloudWatch)
if (process.env.REMOTE_LOGGING_URL) {
  logger.add(new transports.Http({
    host: new URL(process.env.REMOTE_LOGGING_URL).hostname,
    path: new URL(process.env.REMOTE_LOGGING_URL).pathname,
    ssl: process.env.REMOTE_LOGGING_URL.startsWith('https'),
    level: 'error', // Only send errors to remote service
    format: format.json()
  }));
}

// Apply log sampling for high-traffic scenarios
const samplingFormat = format((info) => {
  if (process.env.NODE_ENV === 'production' && info.level === 'trace') {
    // Sample 10% of trace logs
    return Math.random() < 0.1 ? info : false;
  }
  return info;
})();
logger.format = format.combine(samplingFormat, logger.format);

// Apply colors for custom levels
format.colorize().addColors(customLevels.colors);

// Add audit logging method
logger.audit = (message, meta) => {
  logger.log({
    level: 'audit',
    message,
    meta,
    correlationId: meta?.correlationId || uuidv4()
  });
};

// Error handling for logger initialization
try {
  logger.info('Logger initialized', {
    level: logLevel,
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
} catch (error) {
  console.error('Failed to initialize logger:', error);
}

export default logger;