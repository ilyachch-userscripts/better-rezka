import { GM_registerMenuCommand, GM_unregisterMenuCommand } from '$';

import { Parser } from './parser';
import { log } from '../utils/log';
import { retryWithExponentialBackoff } from '../utils/retryWithExponentialBackoff';

export class ParseManager {
  private isParsing = false;

  private abortController: AbortController | null = null;

  private button: HTMLButtonElement | null = null;

  private stopCommandId: string | number | null = null;

  setupMenu() {
    GM_registerMenuCommand('Start Parsing', () => {
      void this.startParsing();
    });
  }

  setupButton() {
    this.button = document.createElement('button');
    this.button.classList.add('parse-button');
    this.button.textContent = '🗘';
    document.body.appendChild(this.button);

    this.button.addEventListener('mouseenter', () => {
      if (this.isParsing) {
        this.button!.textContent = '🗙';
      }
    });

    this.button.addEventListener('mouseleave', () => {
      this.updateButtonState();
    });

    this.button.addEventListener('click', () => {
      if (this.isParsing) {
        this.stopParsing();
      } else {
        void this.startParsing();
      }
    });
  }

  updateButtonState() {
    if (!this.button) {
      return;
    }

    if (this.isParsing) {
      this.button.textContent = '⏲';
      this.button.classList.add('parsing');
    } else {
      this.button.textContent = '🗘';
      this.button.classList.remove('parsing');
    }
  }

  async startParsing() {
    if (this.isParsing) {
      log('Parsing is already in progress.', 'warn');
      return;
    }

    this.isParsing = true;
    this.abortController = new AbortController();
    this.stopCommandId = GM_registerMenuCommand('Stop Parsing', () => {
      this.stopParsing();
    });

    this.updateButtonState();

    try {
      await retryWithExponentialBackoff(async () => {
        const parser = new Parser();
        await parser.parseAndSaveMarks();
      }, this.abortController.signal);
    } catch (error) {
      console.error('Parsing failed:', error);
    } finally {
      this.isParsing = false;
      this.abortController = null;

      if (this.stopCommandId !== null) {
        GM_unregisterMenuCommand(this.stopCommandId);
        this.stopCommandId = null;
      }

      this.updateButtonState();
    }
  }

  stopParsing() {
    if (!this.isParsing) {
      log('No parsing process to stop.', 'warn');
      return;
    }

    this.abortController?.abort();
    this.isParsing = false;
    this.abortController = null;
    log('Parsing aborted.', 'info');

    if (this.stopCommandId !== null) {
      GM_unregisterMenuCommand(this.stopCommandId);
      this.stopCommandId = null;
    }

    this.updateButtonState();
  }
}
