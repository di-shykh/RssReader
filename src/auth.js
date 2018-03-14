import firebase from 'firebase'
import firebaseui from 'firebaseui';

const config = {
    apiKey: "AIzaSyCWtw3as5iKYJChDIw_n-wY1t_pSSSnqIc",
    authDomain: "rssreader-77f35.firebaseapp.com",
    databaseURL: "https://rssreader-77f35.firebaseio.com",
    projectId: "rssreader-77f35",
    storageBucket: "rssreader-77f35.appspot.com",
    messagingSenderId: "83074358936"
};

const auth = {
  context: null,
  uiConfig: null,
  ui: null,

  init(context) {
    this.context = context;

    firebase.initializeApp(config);
    this.uiConfig = {
      signInSuccessUrl: 'reader',
      signInOptions: [
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ]
    }
    this.ui = new firebaseui.auth.AuthUI(firebase.auth());

    firebase.auth().onAuthStateChanged((user) => {
      this.context.$store.dispatch('user/setCurrentUser')

      let requireAuth = this.context.$route.matched.some(record => record.meta.requireAuth)
      let guestOnly = this.context.$route.matched.some(record => record.meta.guestOnly)

      if(requireAuth && !user) this.context.$router.push('auth')
      else if (guestOnly && user) this.context.$router.push('reader')
    });
  },
  authForm(container) {
    this.ui.start(container, this.uiConfig);
  },
  user() {
    return this.context ? firebase.auth().currentUser : null;
  },
  logout() {
    firebase.auth().signOut();
  }
}

export default auth;