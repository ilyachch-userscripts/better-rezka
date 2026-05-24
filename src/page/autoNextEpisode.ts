import { log } from '../utils/log';

export function autoNextEpisode() {
  log('Initializing auto_next_episode...');

  if (!window.location.pathname.match(/\/\d+-.*?\.html/)) {
    return;
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type !== 'childList') {
        return;
      }

      const nextEpisodeLoader = document.querySelector('.b-player__next_episode_loader');
      if (nextEpisodeLoader) {
        setTimeout(() => {
          nextEpisodeLoader.click();
        }, 500);
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
