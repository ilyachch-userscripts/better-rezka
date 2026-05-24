import { log } from '../utils/log';

function markAsWatched(button: HTMLButtonElement) {
  const id = button.getAttribute('data-id');
  if (!id) {
    return;
  }

  const url = '/engine/ajax/cdn_saves_view.php';
  const data = `id=${id}`;
  const xhr = new XMLHttpRequest();

  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(data);

  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) {
      return;
    }

    if (xhr.status !== 200) {
      console.log(`${xhr.status}: ${xhr.statusText}`);
      return;
    }

    button.closest('.b-videosaves__list_item')?.classList.toggle('watched-row');
    button.classList.toggle('watched');
  };
}

function markAsDeleted(button: HTMLButtonElement) {
  const id = button.getAttribute('data-id');
  if (!id) {
    return;
  }

  const url = '/engine/ajax/cdn_saves_remove.php';
  const data = `id=${id}`;
  const xhr = new XMLHttpRequest();

  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(data);

  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) {
      return;
    }

    if (xhr.status !== 200) {
      console.log(`${xhr.status}: ${xhr.statusText}`);
      return;
    }

    button.closest('.b-videosaves__list_item')?.remove();
  };
}

export function removeConfirmationRequestBeforeMarkAsWatched() {
  log('Removing confirmation requests for marking as watched...');

  const continueBlock = document.querySelector('#videosaves-list');
  if (!continueBlock) {
    return;
  }

  const buttonsWatched = continueBlock.querySelectorAll<HTMLAnchorElement>('a.i-sprt.view');
  const buttonsDelete = continueBlock.querySelectorAll<HTMLAnchorElement>('a.i-sprt.delete');

  buttonsWatched.forEach((button) => {
    const newButton = document.createElement('button');
    newButton.classList.add('i-sprt', 'view');
    newButton.setAttribute('data-id', button.getAttribute('data-id') ?? '');
    newButton.setAttribute('data-text-watch', button.getAttribute('data-text-watch') ?? '');
    newButton.setAttribute('data-text-unwatch', button.getAttribute('data-text-unwatch') ?? '');
    newButton.style.border = 'none';
    newButton.style.backgroundColor = 'transparent';

    newButton.addEventListener('click', (event) => {
      event.preventDefault();
      markAsWatched(newButton);
    });

    button.parentNode?.replaceChild(newButton, button);
  });

  buttonsDelete.forEach((button) => {
    const newButton = document.createElement('button');
    newButton.classList.add('i-sprt', 'delete');
    newButton.setAttribute('data-id', button.getAttribute('data-id') ?? '');
    newButton.style.border = 'none';
    newButton.style.backgroundColor = 'transparent';

    newButton.addEventListener('click', (event) => {
      event.preventDefault();
      markAsDeleted(newButton);
    });

    button.parentNode?.replaceChild(newButton, button);
  });
}
