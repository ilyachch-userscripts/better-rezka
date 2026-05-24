export const VIDEO_STATUS_LISTS = ['toWatch', 'watched', 'inProgress', 'dropped'] as const;

export type VideoStatusListName = (typeof VIDEO_STATUS_LISTS)[number];

export interface VideoStatusJSON {
  toWatch: string[];
  watched: string[];
  inProgress: string[];
  dropped: string[];
}

export const VIDEO_STATUS_CLASS_NAMES: Record<VideoStatusListName, string> = {
  toWatch: 'to-watch',
  watched: 'watched',
  inProgress: 'in-progress',
  dropped: 'dropped',
};

export function isVideoStatusListName(value: string): value is VideoStatusListName {
  return (VIDEO_STATUS_LISTS as readonly string[]).includes(value);
}

export class VideoStatus {
  toWatch: string[] = [];

  watched: string[] = [];

  inProgress: string[] = [];

  dropped: string[] = [];

  toJSON(): VideoStatusJSON {
    return {
      toWatch: this.toWatch,
      watched: this.watched,
      inProgress: this.inProgress,
      dropped: this.dropped,
    };
  }

  static fromJSON(json: Partial<VideoStatusJSON> | null | undefined) {
    const videoStatus = new VideoStatus();
    videoStatus.toWatch = json?.toWatch ?? [];
    videoStatus.watched = json?.watched ?? [];
    videoStatus.inProgress = json?.inProgress ?? [];
    videoStatus.dropped = json?.dropped ?? [];
    return videoStatus;
  }

  addToList(listName: VideoStatusListName, videoName: string) {
    this[listName].push(videoName);
  }

  removeFromList(listName: VideoStatusListName, videoName: string) {
    this[listName] = this[listName].filter((item) => item !== videoName);
  }

  merge(other: VideoStatus) {
    const result = new VideoStatus();

    for (const listName of VIDEO_STATUS_LISTS) {
      this[listName].forEach((videoName) => {
        if (!other.containsVideo(videoName)) {
          result.addToList(listName, videoName);
        }
      });
    }

    for (const listName of VIDEO_STATUS_LISTS) {
      other[listName].forEach((videoName) => {
        result.removeFromAnyList(videoName);
        result.addToList(listName, videoName);
      });
    }

    return result;
  }

  containsVideo(videoName: string) {
    return VIDEO_STATUS_LISTS.some((listName) => this[listName].includes(videoName));
  }

  removeFromAnyList(videoName: string) {
    VIDEO_STATUS_LISTS.forEach((listName) => {
      this.removeFromList(listName, videoName);
    });
  }
}
