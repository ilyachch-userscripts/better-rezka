import { log } from '../utils/log';

export function removeDuplicatesFromNewest() {
  log('Removing duplicates from newest slider...');

  const newestSliderContent = document.querySelector('#newest-slider-content');
  if (!newestSliderContent) {
    return;
  }

  const newestElements = document.querySelectorAll('#newest-slider-content .b-content__inline_item');
  if (!newestElements.length) {
    return;
  }

  const duplicates: number[] = [];

  for (let i = 0; i < newestElements.length; i++) {
    const element = newestElements[i];
    const id = element.getAttribute('data-id');
    let duplicatesCount = 0;

    for (let j = 0; j < newestElements.length; j++) {
      if (i === j) {
        continue;
      }

      const otherElement = newestElements[j];
      const otherId = otherElement.getAttribute('data-id');
      if (id === otherId) {
        duplicatesCount++;
      }
    }

    duplicates.push(duplicatesCount > 0 ? 1 : 0);
  }

  const duplicatesString = duplicates.join('');
  let duplicatesStringPartsStart = duplicatesString.match(/^1*/g)?.[0] ?? '';
  let duplicatesStringPartsEnd = duplicatesString.match(/1*$/g)?.[0] ?? '';
  const duplicatesStringPartsMiddle = duplicatesString.match(/0+/g)?.[0] ?? '';

  duplicatesStringPartsStart =
    '1'.repeat(duplicatesStringPartsStart.length / 2) +
    '0'.repeat(duplicatesStringPartsStart.length / 2);

  duplicatesStringPartsEnd =
    '0'.repeat(duplicatesStringPartsEnd.length / 2) +
    '1'.repeat(duplicatesStringPartsEnd.length / 2);

  const duplicatesStringNew =
    duplicatesStringPartsStart + duplicatesStringPartsMiddle + duplicatesStringPartsEnd;

  const elementsToRemove: Element[] = [];

  for (let i = 0; i < duplicatesStringNew.length; i++) {
    if (duplicatesStringNew[i] === '1') {
      elementsToRemove.push(newestElements[i]);
    }
  }

  elementsToRemove.forEach((element) => {
    element.remove();
  });
}
