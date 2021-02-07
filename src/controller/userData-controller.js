import {
  readUserDB,
  updateUserDataName,
  updateUserDataAbout,
} from '../model/user-firestore-model.js';

import {
  readPostProfile,
  updatePersonalData,
} from '../model/posts-firestore-model.js';


const updateDataUser = (posts) => {
  posts.forEach((post) => {
    updatePersonalData(post.id, localStorage.getItem('userName'));
  });
};

// FUNCIÓN PARA ACTUALIZAR EL NOMBRE DEL USUARIO
export const updateUserName = (nodo) => {
  const iconEdit = nodo.querySelector('#editName');
  const iconSave = nodo.querySelector('#saveName');
  const userName = nodo.querySelector('#userName');

  if (iconEdit) {
    iconEdit.addEventListener('click', () => {
      userName.classList.add('editNameAbout');
      userName.contentEditable = 'true';
      userName.focus();
      iconEdit.classList.add('hide');
      iconSave.classList.remove('hide');
    });
  }

  // FUNCIÓN PARA GUARADAR LA ACTUALIZACIÓN DEL NOMBRE
  if (iconSave) {
    iconSave.addEventListener('click', () => {
      const uid = firebase.auth().currentUser.uid;
      readUserDB(uid).then((querySnapshot) => {
        querySnapshot.forEach((user) => {
          if (userName.innerText.trim() !== '') {
            userName.classList.remove('editNameAbout');
            userName.contentEditable = 'false';
            iconEdit.classList.remove('hide');
            iconSave.classList.add('hide');
            const nam = userName.innerText.trim();
            updateUserDataName(user.id, nam)
              .then(() => {
                localStorage.setItem('userName', nam);
                readPostProfile(firebase.auth().currentUser.uid, updateDataUser);
              })
              .catch(() => {});
          }
        });
      });
    });
  }

  if (userName) {
    userName.addEventListener('keyup', () => {
      if (iconSave) {
        if (userName.innerText.trim() === '') {
          iconSave.classList.add('activeSave');
        } else {
          iconSave.classList.remove('activeSave');
        }
      }
    });
  }
};

// FUNCIÓN PARA ACTUALIZAR LA DESCRIPCIÓN
export const updateUserAbout = (nodo) => {
  const iconEdit = nodo.querySelector('#editAbout');
  const iconSave = nodo.querySelector('#saveAbout');
  const userAbout = nodo.querySelector('#userAbout');

  if (iconEdit) {
    iconEdit.addEventListener('click', () => {
      userAbout.classList.add('editNameAbout');
      userAbout.contentEditable = 'true';
      userAbout.focus();
      iconEdit.classList.add('hide');
      iconSave.classList.remove('hide');
      iconSave.classList.add('iconSv');
    });
  }

  // FUNCIÓN PARA GUARDAR ACTUALIZACIÓN DEL ABOUT
  if (iconSave) {
    iconSave.addEventListener('click', () => {
      const uid = firebase.auth().currentUser.uid;
      readUserDB(uid).then((querySnapshot) => {
        querySnapshot.forEach((user) => {
          if (userAbout.innerText.trim() !== '') {
            userAbout.classList.remove('editNameAbout');
            userAbout.contentEditable = 'false';
            iconEdit.classList.remove('hide');
            iconSave.classList.add('hide');
            const desc = userAbout.innerText.trim();
            updateUserDataAbout(user.id, desc)
              .then(() => {
                localStorage.setItem('userAbout', desc);
              })
              .catch(() => {});
          }
        });
      });
    });
  }

  if (userAbout) {
    userAbout.addEventListener('keyup', () => {
      if (iconSave) {
        if (userAbout.innerText.trim() === '') {
          iconSave.classList.add('activeSave');
        } else {
          iconSave.classList.remove('activeSave');
        }
      }
    });
  }
};
