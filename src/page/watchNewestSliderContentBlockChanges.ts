import { Marker } from '../services/marker';
import { log } from '../utils/log';
import { removeDuplicatesFromNewest } from './removeDuplicatesFromNewest';

export function watchNewestSliderContentBlockChanges() {
  log('Watching for changes in newest slider content...');

  const newestSliderContent = document.querySelector('#newest-slider-content');
  if (!newestSliderContent) {
    return;
  }

  let timer: number | undefined;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type !== 'childList') {
        return;
      }

      if (timer !== undefined) {
        clearTimeout(timer);
      }

      timer = window.setTimeout(() => {
        removeDuplicatesFromNewest();
        void new Marker().markVideosWithStatuses();
      }, 500);
    });
  });

  observer.observe(newestSliderContent, {
    childList: true,
    subtree: true,
  });
}
