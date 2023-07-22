import axios from 'axios';

//function wait for str
export async function searchImages(searchRequest, page) {
  return await axios.get('https://pixabay.com/api/', {
    params: {
      key: '38289038-83622c9e49aee8f0430adf6fc',
      q: searchRequest,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: page,
    },
  });
}
