// import axios from 'axios';
import Notiflix from 'notiflix';
import { searchImages } from './pixabay-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ScrollWatch from 'scrollwatch';

const gallery = document.querySelector('.js-gallery');
const searchForm = document.querySelector('.js-form');
const watchDiv = document.querySelector('.js-watch');

// const infScroll = document.querySelector('.js-infscroll');
let page = 1;

localStorage.removeItem('searchQuery');

const swInstance = new ScrollWatch({
  // watch: '[data-scroll-watch]',
  infiniteScroll: true,
  infiniteOffset: 200,
  onInfiniteYInView: onLoadMore,
});

// localStorage.removeItem('searchQuery');

// const loadMore = document.querySelector('.js-load');
// loadMore.classList.add('hidden');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

searchForm.addEventListener('submit', handlerSubmit);

async function handlerSubmit(event) {
  // loadMore.classList.add('hidden');

  event.preventDefault();
  try {
    // loadMore.addEventListener('click', onLoadMore);

    localStorage.setItem('searchQuery', String(searchForm.searchQuery.value));
    gallery.innerHTML = '';
    const searchData = await searchImages(
      String(searchForm.searchQuery.value),
      page
    );
    const {
      data: { hits, totalHits },
    } = searchData;
    if (!hits.length) {
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      gallery.insertAdjacentHTML('beforeend', createMarkup(hits).join(''));
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      watchDiv.classList.add('.js-infscroll');
      swInstance.resumeInfiniteScroll();
      // loadMore.classList.remove('hidden');
    }

    lightbox.refresh();
  } catch (err) {
    // loadMore.classList.add('hidden');
    console.log(err);
    Notiflix.Notify.failure(`${err}`);
    gallery.innerHTML = '';
  } finally {
    searchForm.searchQuery.value = '';
  }

  // .then(({ data: { hits } }) => {
  // if (!hits.length) {
  //   console.log(
  //     'Sorry, there are no images matching your search query. Please try again.'
  //   );
  //   } else {
  // const markup = hits.map(
  //   ({
  //     comments,
  //     webformatURL,
  //     // largeImageURL,
  //     likes,
  //     tags,
  //     views,
  //     downloads,
  //   }) => {
  //     return `<div class="photo-card">
  //         <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  //         <div class="info">
  //             <p class="info-item">
  //                 <b>Likes: ${likes}</b>
  //              </p>
  //             <p class="info-item">
  //                 <b>Views: ${views}</b>
  //             </p>
  //             <p class="info-item">
  //                 <b>Comments: ${comments}</b>
  //             </p>
  //             <p class="info-item">
  //                 <b>Downloads: ${downloads}</b>
  //             </p>
  //         </div>
  //     </div>`;
  //   }
  // );
  //     gallery.innerHTML = markup.join('');
  //   }
  // })
  // .catch(e => console.log(e))
  // .finally((searchForm.searchQuery.value = ''));
}

function createMarkup(obj) {
  const markup = obj.map(
    ({
      comments,
      webformatURL,
      largeImageURL,
      likes,
      tags,
      views,
      downloads,
    }) => {
      return `<div class="photo-card">
                <a class="photo-card-link" href="${largeImageURL}">
                <div class="img-wrap">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                </div>
                <div class="info">
                    <p class="info-item">
                        <b>Likes: ${likes}</b>
                     </p>
                    <p class="info-item">
                        <b>Views: ${views}</b>
                    </p>
                    <p class="info-item">
                        <b>Comments: ${comments}</b>
                    </p>
                    <p class="info-item">
                        <b>Downloads: ${downloads}</b>
                    </p>
                </div>
            </div>`;
    }
  );

  return markup;
}

async function onLoadMore() {
  // console.log('this start when page loaded');
  if (!localStorage.getItem('searchQuery') && !gallery.childElementCount) {
    return;
  }
  page += 1;
  const searchQuery = localStorage.getItem('searchQuery');
  // console.log(searchQuery);
  try {
    const searchData = await searchImages(searchQuery, page);
    const {
      data: { hits, totalHits },
    } = searchData;
    // console.log(totalHits);
    // console.log(searchData);
    gallery.insertAdjacentHTML('beforeend', createMarkup(hits).join(''));

    lightbox.refresh();
    swInstance.refresh();

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    // console.log(cardHeight);

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (page > totalHits / 40) {
      // loadMore.classList.add('hidden');
      swInstance.destroy();
    }
  } catch (err) {
    console.log(err);
    Notiflix.Notify.failure(`${err}`);
    gallery.innerHTML = '';
  }
}
