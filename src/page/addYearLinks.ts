import { log } from '../utils/log';

export function addYearLinks() {
  log('Adding year links...');

  const yearMatch = window.location.pathname.match(/\/best.*?\/(\d{4})\//);
  if (!yearMatch) {
    return;
  }

  const year = Number.parseInt(yearMatch[1], 10);
  const nextYear = year + 1;
  const prevYear = year - 1;
  const header = document.querySelector('.b-content__htitle h1');

  if (!header) {
    return;
  }

  const createLink = (url: string, text: string) => {
    const link = document.createElement('a');
    link.style.marginLeft = '10px';
    link.href = url;
    link.innerText = text;
    return link;
  };

  const nextYearLink = createLink(
    window.location.pathname.replace(/\d{4}\/.*/, `${nextYear}/`),
    `${nextYear}`,
  );
  const prevYearLink = createLink(
    window.location.pathname.replace(/\d{4}\/.*/, `${prevYear}/`),
    `${prevYear}`,
  );

  header.appendChild(prevYearLink);
  if (year !== new Date().getFullYear()) {
    header.appendChild(nextYearLink);
  }
}
