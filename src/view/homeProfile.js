import {
  device,
  deviceNoIPad,
} from '../utiles/utilitarias.js';

import {
  homeHeader,
  profile,
  postHomeMobile,
  postArea,
  optionsMobile,
  userLoggedIn,
  imgProfileUserDefault,
} from './templateHomeProfile.js';

import {
  signOutUser,
  codersArea,
} from '../controller/homeProfile-controller.js';

import {
  createNewPost,
  publicPosts,
  postProfile,
  cutURL,
} from '../controller/post-controller.js';

import {
  updateUserName,
  updateUserAbout,
} from '../controller/userData-controller.js';

import {
  readPostProfile,
  readPostHome,
} from '../model/posts-firestore-model.js';

import {
  shareImgPost,
  delFileStorage,
} from '../model/storage-firestore-model.js';

const changeUserLogged = () => {
  let userData = '';
  if (deviceNoIPad() === 'Mobile' && /home/.test(window.location.hash)) {
    userData = '';
  } else {
    userData = userLoggedIn();
  }
  return userData;
};

const changeMenu = () => {
  let menu = '';
  if (device() === 'Mobile') {
    menu = optionsMobile;
  } else {
    menu = `<div class="items itemsHover">${(/profile/.test(window.location.hash)) ? homeHeader : profile}</div>`;
  }
  return menu;
};

const changeViewPost = () => {
  let post = '';
  if (device() === 'Desktop') {
    post = postArea;
  } else {
    post = (/profile/.test(window.location.hash)) ? postArea : postHomeMobile();
  }
  return post;
};

const changeContainerPosts = () => {
  let containerPosts = '';
  if (/home/.test(window.location.hash)) {
    containerPosts = '<div class="container-new-post-home">';
  }
  if (/profile/.test(window.location.hash)) {
    containerPosts = '<div class="container-new-post-profile">';
  }
  return containerPosts;
};

export default () => {
  const headerHome = `
  <input type="checkbox" id="btnMenu">
  <label for="btnMenu">&#9776;</label>
  <h1 class="coderPlace">&lt;CoderPlace/&gt;</h1>
  <nav class="menu">
    <section class="separator">
      <section>
        <div class="items userLogged">
          <img src="${localStorage.getItem('userProfileImg') || imgProfileUserDefault}" alt="Profile" class="userImage">
          <span class="userName"> ${localStorage.getItem('userName') || 'Nombre y Apellido '}</span>
        </div>
        ${changeMenu()}
      </section>
      <div class="main-title">
        <h1 class="coderPlaceDesktop">&lt;CoderPlace/&gt;</h1>
      </div>
      <div class="items itemsHover" id="log-out">
        <img src="./img/log-out.png" alt="Log Out" class="icons-cp">
        <span>Cerrar Sesión</span>
      </div>
    </section>
  </nav>`;

  const mainHome = `
  <div class="container-main">
    <div class="general-information">
      <div class="user-logged">${changeUserLogged()}</div>
      <div class="coder-information">
        <div class="coder-header">
          <p>&lt; Coders /&gt;</p>
        </div>
        <div class="container-coders">
          <div class="charging">
            <img src="./img/cat-charging.gif">
          </div>
        </div>
      </div>
    </div>

    <div class="container-post">
      <div class = "change-post">
        ${changeViewPost()}
      </div>
      ${changeContainerPosts()}
      <div class="charging">
        <img src="./img/cat-charging.gif">
      </div>
    </div>
  </div>`;

  // CREANDO EL CONTENEDOR DE LOS TEMPLATES
  const sectionMain = document.createElement('section');
  sectionMain.className = 'section-main';
  sectionMain.innerHTML = mainHome;
  const header = document.querySelector('header');
  header.innerHTML = headerHome;

  // PARA MOSTRAR EL AREA DE CODERS
  codersArea();

  // PARA MOSTRAR TODOS LOS POSTS
  readPostHome(publicPosts);
  readPostProfile(firebase.auth().currentUser.uid, postProfile);

  const photoPost = sectionMain.querySelector('#photoPost');
  const btnSharePost = sectionMain.querySelector('#btnSharePost');

  // EVENTO PARA ELIMINAR LA IMG CARGADA EN EL POST
  const btnDeleteImg = sectionMain.querySelector('.deleteImg');
  if (btnDeleteImg) {
    btnDeleteImg.addEventListener('click', () => {
      const objFile = cutURL(sessionStorage.getItem('imgNewPost'));
      delFileStorage(objFile.photoURL, objFile.uid);
      sessionStorage.removeItem('imgNewPost');
      btnDeleteImg.parentNode.classList.add('hide');
      btnSharePost.classList.remove('btnShareActive');
    });
  }

  // EVENTO COMPARTIR POST EN PERFIL E INICIO ESCRITORIO
  const post = sectionMain.querySelector('#postArea');
  if (post) {
    post.addEventListener('keyup', () => {
      if (post.value.trim()) {
        btnSharePost.classList.add('btnShareActive');
      } else {
        btnSharePost.classList.remove('btnShareActive');
      }
    });
  }

  if (photoPost) {
    photoPost.addEventListener('change', (e) => {
      if (e.target.files[0]) {
        btnSharePost.classList.add('btnShareActive');
      } else {
        btnSharePost.classList.remove('btnShareActive');
      }
    });
  }

  if (btnSharePost) {
    btnSharePost.addEventListener(('click'), () => {
      const privacyPostArea = sectionMain.querySelector('#privacyPostArea');
      const postContent = post.value.trim();
      const privacyPost = privacyPostArea.value;

      if (!postContent && !sessionStorage.getItem('imgNewPost')) {
        // btnSharePost.setAttribute('disabled', true);
      } else {
        createNewPost(postContent, privacyPost);
        if (btnDeleteImg) btnDeleteImg.parentNode.classList.add('hide');
        post.value = '';
        btnSharePost.classList.remove('btnShareActive');
      }
    });
  }

  // EVENTO PARA CERRAR SESIÓN
  const btnLogOut = header.querySelector('#log-out');

  if (btnLogOut) {
    btnLogOut.addEventListener('click', () => {
      signOutUser();
    });
  }

  // EVENTO PARA SUBIR LAS IMAGENES EN LOS POSTS
  const bntImgPost = sectionMain.querySelector('#photoPost');

  if (bntImgPost) {
    bntImgPost.addEventListener(('change'), (e) => {
      const file = e.target.files[0];
      const userPost = firebase.auth().currentUser;
      shareImgPost(file, userPost.uid);
    });
  }

  const optiosPrivacy = sectionMain.querySelector('.comment');
  if (optiosPrivacy) {
    optiosPrivacy.addEventListener('click', () => {
      const privacyPostArea = sectionMain.querySelector('#privacyPostArea');
      privacyPostArea.classList.toggle('hide');
    });
  }

  // SIMULATOR SELECT PRIVACY
  const priv = sectionMain.querySelector('#private');
  const pub = sectionMain.querySelector('#public');

  if (priv) {
    pub.addEventListener('click', () => {
      const containerOpctions = sectionMain.querySelector('.tooltip-container');
      containerOpctions.classList.toggle('hide');
      sessionStorage.setItem('privacy', 1);
      const privPost = document.querySelector('#privPost');
      if (privPost) privPost.setAttribute('src', './img/public.png');
    });
  }

  if (pub) {
    priv.addEventListener('click', () => {
      const containerOpctions = sectionMain.querySelector('.tooltip-container');
      containerOpctions.classList.toggle('hide');
      sessionStorage.setItem('privacy', 2);
      const privPost = document.querySelector('#privPost');
      if (privPost) privPost.setAttribute('src', './img/private.png');
    });
  }

  // EVETNO PARA TOMAR EL VALOR DEL SELECT PRIVACIDAD
  const selectPrivacy = sectionMain.querySelector('#privacyPostArea');
  if (selectPrivacy) {
    selectPrivacy.addEventListener(('change'), () => {
      if (selectPrivacy.value === '1') {
        sessionStorage.setItem('privacy', '1');
      } else {
        sessionStorage.setItem('privacy', '2');
      }
    });
  }

  updateUserName(sectionMain);
  updateUserAbout(sectionMain);

  return sectionMain;
};
