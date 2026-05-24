export class RatingData {
  readonly ratingStr: string | null;

  readonly source: string;

  readonly ratingValue: number | null;

  constructor(ratingElement: Element | null, source: string) {
    this.ratingStr = ratingElement?.textContent ?? null;
    this.source = source;
    this.ratingValue = this.ratingStr ? Number.parseFloat(this.ratingStr) : null;
  }

  asString() {
    if (this.ratingValue === null) {
      return `<span title="${this.source}">-</span>`;
    }

    if (this.ratingValue < 6) {
      return `<span title="${this.source}" style="color: red;">${this.ratingStr}</span>`;
    }

    if (this.ratingValue < 7) {
      return `<span title="${this.source}">${this.ratingStr}</span>`;
    }

    return `<span title="${this.source}" style="color: green;">${this.ratingStr}</span>`;
  }
}
