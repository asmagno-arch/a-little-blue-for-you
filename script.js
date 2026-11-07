const modals = [...document.querySelectorAll('.modal')];
let previousFocus = null;
let photos = [];
let photoIndex = 0;
let touchStartX = 0;

const photoInput = document.querySelector('#photoUpload');
const carouselImage = document.querySelector('#carouselImage');
const emptyGallery = document.querySelector('#emptyGallery');
const slideCount = document.querySelector('#slideCount');
const previousPhoto = document.querySelector('#previousPhoto');
const nextPhoto = document.querySelector('#nextPhoto');

function openModal(id) {
  const modal = document.getElementById(id);
  previousFocus = document.activeElement;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  modal.querySelector('.close').focus();

  if (id === 'noteModal') celebrate();
}

function closeModal(modal) {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  if (previousFocus) previousFocus.focus();
}

function celebrate() {
  for (let i = 0; i < 12; i++) {
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.textContent = ['♡', '✦', '♥'][i % 3];
    heart.style.left = `${30 + Math.random() * 40}%`;
    heart.style.top = `${55 + Math.random() * 25}%`;
    heart.style.color = ['#6f9ed0', '#e4b952', '#d18595'][i % 3];
    heart.style.fontSize = `${14 + Math.random() * 14}px`;
    document.body.append(heart);
    heart.addEventListener('animationend', () => heart.remove(), { once: true });
  }
}

function showPhoto() {
  const hasPhotos = photos.length > 0;
  emptyGallery.hidden = hasPhotos;
  carouselImage.hidden = !hasPhotos;
  previousPhoto.disabled = photos.length < 2;
  nextPhoto.disabled = photos.length < 2;

  if (hasPhotos) {
    carouselImage.src = photos[photoIndex].url;
    carouselImage.alt = `Photo ${photoIndex + 1} of ${photos.length}`;
    slideCount.textContent = `${photoIndex + 1} / ${photos.length}`;
  } else {
    slideCount.textContent = '0 photos';
  }
}

function movePhoto(direction) {
  if (!photos.length) return;
  photoIndex = (photoIndex + direction + photos.length) % photos.length;
  showPhoto();
}

document.querySelector('#openNote').addEventListener('click', () => openModal('noteModal'));
document.querySelector('#openGallery').addEventListener('click', () => openModal('galleryModal'));

document.querySelectorAll('[data-close]').forEach(button => {
  button.addEventListener('click', () => {
    closeModal(document.getElementById(button.dataset.close));
  });
});

modals.forEach(modal => {
  modal.addEventListener('click', event => {
    if (event.target === modal) closeModal(modal);
  });
});

document.addEventListener('keydown', event => {
  const open = modals.find(modal => modal.classList.contains('open'));
  if (!open) return;

  if (event.key === 'Escape') closeModal(open);
  if (open.id === 'galleryModal' && event.key === 'ArrowRight') movePhoto(1);
  if (open.id === 'galleryModal' && event.key === 'ArrowLeft') movePhoto(-1);
});

photoInput.addEventListener('change', event => {
  const files = [...event.target.files].filter(file => file.type.startsWith('image/'));
  const newPhotos = files.map(file => ({ url: URL.createObjectURL(file) }));

  photos.push(...newPhotos);
  if (newPhotos.length) photoIndex = photos.length - newPhotos.length;

  showPhoto();
  photoInput.value = '';
});

previousPhoto.addEventListener('click', () => movePhoto(-1));
nextPhoto.addEventListener('click', () => movePhoto(1));

const photoFrame = document.querySelector('.photo-frame');

photoFrame.addEventListener('touchstart', event => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

photoFrame.addEventListener('touchend', event => {
  const distance = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(distance) > 45) movePhoto(distance < 0 ? 1 : -1);
}, { passive: true });

showPhoto();
