const modals = [...document.querySelectorAll('.modal')];
let previousFocus = null;
let photos = [];
let photoIndex = 0;

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
  for (let i = 0; i < 9; i++) {
    const spark = document.createElement('span');
    spark.className = 'heart';
    spark.textContent = ['♡', '✦', '♥'][i % 3];
    spark.style.left = `${35 + Math.random() * 30}%`;
    spark.style.top = `${58 + Math.random() * 18}%`;
    spark.style.color = ['#6f9ed0', '#e4b952', '#d18595'][i % 3];
    spark.style.fontSize = `${14 + Math.random() * 12}px`;
    document.body.append(spark);
    spark.addEventListener('animationend', () => spark.remove(), { once: true });
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

document.querySelector('#openNote')
  .addEventListener('click', () => openModal('noteModal'));

document.querySelector('#openGallery')
  .addEventListener('click', () => openModal('galleryModal'));

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
  const addedPhotos = [...event.target.files]
    .filter(file => file.type.startsWith('image/'))
    .map(file => ({ url: URL.createObjectURL(file) }));

  photos.push(...addedPhotos);
  if (photos.length) photoIndex = photos.length - addedPhotos.length;

  showPhoto();
  photoInput.value = '';
});

previousPhoto.addEventListener('click', () => movePhoto(-1));
nextPhoto.addEventListener('click', () => movePhoto(1));

showPhoto();
