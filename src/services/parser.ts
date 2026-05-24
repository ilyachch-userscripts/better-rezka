import { Database } from '../storage/database';
import { type VideoStatusJSON, VideoStatus, isVideoStatusListName } from '../models/videoStatus';
import { log } from '../utils/log';

export class Parser {
  private readonly parser = new DOMParser();

  private readonly db = new Database<VideoStatusJSON>('VideoStatusDatabase', 'statuses');

  constructor() {
    log('Parser initialized.');
  }

  async fetchWithRetry(url: string, options: RequestInit = {}, maxRetries = 5) {
    log(`Fetching URL: ${url} with retry mechanism...`);
    let delay = 1000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        }

        return response;
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }

        console.warn(`Request failed (attempt ${attempt}). Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      }
    }

    throw new Error('Retry loop finished without returning a response.');
  }

  async parseWatched() {
    log('Parsing watched videos...');
    const response = await this.fetchWithRetry('/continue/');
    const htmlText = await response.text();
    const doc = this.parser.parseFromString(htmlText, 'text/html');
    const continueBlock = doc.querySelector('#videosaves-list');

    if (!continueBlock) {
      return null;
    }

    const videoStatus = new VideoStatus();
    const items = continueBlock.querySelectorAll('.b-videosaves__list_item');

    for (const item of items) {
      if (!item.getAttribute('id')) {
        continue;
      }

      const link = item.querySelector<HTMLAnchorElement>('.td.title a');
      const href = link?.getAttribute('href');
      const id = href?.match(/\/(\d+?)-/)?.[1];

      if (!id) {
        continue;
      }

      if (item.classList.contains('watched-row')) {
        videoStatus.addToList('watched', id);
      } else {
        videoStatus.addToList('inProgress', id);
      }
    }

    return videoStatus;
  }

  async fetchFavoritesByCategory(categoryURL: string) {
    log(`Fetching favorites by category: ${categoryURL}`);
    const videoElements: Element[] = [];
    let page = 1;

    while (true) {
      const response = await this.fetchWithRetry(`${categoryURL}page/${page}/`);
      const htmlText = await response.text();
      const doc = this.parser.parseFromString(htmlText, 'text/html');
      const elements = doc.querySelectorAll('.b-content__inline_item');

      if (!elements.length) {
        break;
      }

      videoElements.push(...elements);
      page++;
    }

    return videoElements
      .map((element) => element.getAttribute('data-id'))
      .filter((id): id is string => Boolean(id));
  }

  async parseFavorites() {
    log('Parsing favorite videos...');
    const response = await this.fetchWithRetry('/favorites/');
    const htmlText = await response.text();
    const doc = this.parser.parseFromString(htmlText, 'text/html');
    const categoryLinks = doc.querySelectorAll('.b-favorites_content__cats_list_link');
    const videoStatus = new VideoStatus();

    for (const link of categoryLinks) {
      const category = link.querySelector('.name')?.textContent?.trim() ?? '';
      const href = link.getAttribute('href');

      if (!href || !isVideoStatusListName(category)) {
        continue;
      }

      const ids = await this.fetchFavoritesByCategory(href);
      ids.forEach((id) => videoStatus.addToList(category, id));
    }

    return videoStatus;
  }

  async parseMarks() {
    log('Parsing all marks...');
    let statuses = new VideoStatus();
    const watchedStatus = await this.parseWatched();
    const favoritesStatus = await this.parseFavorites();

    statuses = statuses.merge(watchedStatus ?? new VideoStatus());
    statuses = statuses.merge(favoritesStatus);

    return statuses;
  }

  async parseAndSaveMarks() {
    log('Parsing and saving marks...');
    const videoStatus = await this.parseMarks();
    await this.db.save('currentStatus', videoStatus.toJSON());
    log('Marks parsed and saved successfully.');
  }
}
