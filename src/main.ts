import './style.css';

import { addYearLinks } from './page/addYearLinks';
import { autoNextEpisode } from './page/autoNextEpisode';
import { removeConfirmationRequestBeforeMarkAsWatched } from './page/removeConfirmationRequestBeforeMarkAsWatched';
import { removeDuplicatesFromNewest } from './page/removeDuplicatesFromNewest';
import { watchNewestSliderContentBlockChanges } from './page/watchNewestSliderContentBlockChanges';
import { Marker } from './services/marker';
import { ParseManager } from './services/parseManager';
import { RatingMarker } from './services/ratingMarker';
import { log } from './utils/log';

function init() {
  log('Initializing Better Rezka script...');

  const marker = new Marker();

  autoNextEpisode();
  addYearLinks();
  removeDuplicatesFromNewest();
  removeConfirmationRequestBeforeMarkAsWatched();
  void marker.markVideosWithStatuses();
  watchNewestSliderContentBlockChanges();

  const ratingMarker = new RatingMarker();
  ratingMarker.markRating();

  const parseManager = new ParseManager();
  parseManager.setupMenu();
  parseManager.setupButton();

  log('Better Rezka script initialized successfully.');
}

init();
