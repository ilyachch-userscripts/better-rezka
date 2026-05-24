import { RatingData } from '../models/ratingData';
import { log } from '../utils/log';

export class RatingMarker {
  private readonly parser = new DOMParser();

  constructor() {
    log('RatingMarker initialized.');
  }

  async addRatingsBlock(element: Element) {
    log('Adding ratings block...');

    if (element.querySelector('.ratings')) {
      return;
    }

    const elementDataId = element.getAttribute('data-id');
    if (!elementDataId) {
      return;
    }

    const response = await fetch('https://rezka.ag/engine/ajax/quick_content.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: `id=${elementDataId}`,
    });

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const responseText = await response.text();
    const doc = this.parser.parseFromString(responseText, 'text/html');
    const ratings = [
      new RatingData(doc.querySelector('.b-content__bubble_rating b'), 'Rezka'),
      new RatingData(doc.querySelector('.b-content__bubble_rates .kp b'), 'КиноПоиск'),
      new RatingData(doc.querySelector('.b-content__bubble_rates .imdb b'), 'IMDb'),
    ];

    const ratingDiv = document.createElement('div');
    ratingDiv.classList.add('ratings');

    ratings.forEach((rating) => {
      const ratingBlock = document.createElement('div');
      ratingBlock.innerHTML = rating.asString();
      ratingDiv.appendChild(ratingBlock);
    });

    const cover = element.querySelector('.b-content__inline_item-cover');
    cover?.after(ratingDiv);
  }

  markRating() {
    log('Marking ratings...');
    const elementsToMark = document.querySelectorAll('.b-content__inline_item');

    elementsToMark.forEach((element) => {
      let timer: number | undefined;

      element.addEventListener('mouseenter', () => {
        timer = window.setTimeout(() => {
          void this.addRatingsBlock(element);
        }, 500);
      });

      element.addEventListener('mouseleave', () => {
        if (timer !== undefined) {
          clearTimeout(timer);
        }
      });
    });
  }
}
