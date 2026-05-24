import { Database } from '../storage/database';
import {
  VIDEO_STATUS_CLASS_NAMES,
  type VideoStatusListName,
  type VideoStatusJSON,
  VideoStatus,
} from '../models/videoStatus';
import { log } from '../utils/log';

export class Marker {
  private readonly db = new Database<VideoStatusJSON>('VideoStatusDatabase', 'statuses');

  constructor() {
    log('Marker initialized.');
  }

  async getVideoStatus() {
    log('Getting video status from database...');
    const serializedVideoStatus = await this.db.get('currentStatus');

    if (!serializedVideoStatus) {
      return null;
    }

    return VideoStatus.fromJSON(serializedVideoStatus);
  }

  async markAs(listName: VideoStatusListName, videoName: string) {
    log(`Marking video '${videoName}' as '${listName}'...`);
    const serializedVideoStatus = await this.db.get('currentStatus');

    if (!serializedVideoStatus) {
      return;
    }

    const videoStatus = VideoStatus.fromJSON(serializedVideoStatus);
    videoStatus.removeFromAnyList(videoName);
    videoStatus.addToList(listName, videoName);
    await this.db.save('currentStatus', videoStatus.toJSON());
  }

  async markVideosWithStatuses() {
    log('Marking videos with statuses...');
    const videoStatus = await this.getVideoStatus();

    if (!videoStatus) {
      return;
    }

    const items = document.querySelectorAll('.b-content__inline_item');

    items.forEach((item) => {
      const id = item.getAttribute('data-id');

      if (!id) {
        return;
      }

      item.classList.remove(...Object.values(VIDEO_STATUS_CLASS_NAMES));

      if (videoStatus.watched.includes(id)) {
        item.classList.add(VIDEO_STATUS_CLASS_NAMES.watched);
      } else if (videoStatus.inProgress.includes(id)) {
        item.classList.add(VIDEO_STATUS_CLASS_NAMES.inProgress);
      } else if (videoStatus.toWatch.includes(id)) {
        item.classList.add(VIDEO_STATUS_CLASS_NAMES.toWatch);
      } else if (videoStatus.dropped.includes(id)) {
        item.classList.add(VIDEO_STATUS_CLASS_NAMES.dropped);
      }
    });
  }
}
