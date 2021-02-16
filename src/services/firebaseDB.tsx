import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: 'AIzaSyCWf18K21aWbfVTEOSLgZaGqnjjC_2ezkk',
    authDomain: 'financasapp-f5435.firebaseapp.com',
    databaseURL: 'https://financasapp-f5435-default-rtdb.firebaseio.com',
    projectId: 'financasapp-f5435',
    storageBucket: 'financasapp-f5435.appspot.com',
    messagingSenderId: '963080569584',
    appId: '1:963080569584:web:2b1e6082461bc7be95f835',
    measurementId: 'G-4L2Y4YZN4Z',
  };
  
  firebase.initializeApp(firebaseConfig);

  export default firebase