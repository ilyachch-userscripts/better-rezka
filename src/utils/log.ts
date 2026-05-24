type LogLevel = 'info' | 'warn' | 'error';

const LOG_LEVEL_STYLES: Record<LogLevel, string> = {
  info: 'color: white;',
  warn: 'color: orange;',
  error: 'color: red;',
};

export function log(message: string, level: LogLevel = 'info') {
  console.log(`%c[Better Rezka] ${message}`, LOG_LEVEL_STYLES[level] ?? '');
}
