import Api from '@/services/Api';

export default {
  findCurrentSource(URL) {
    return Api().post('/addsource', URL);
  },
  updateSource(URL) {
    return Api().post('/articles', URL);
  },
};
