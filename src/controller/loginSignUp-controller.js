import {
  signIn,
  signInWithGoogle,
  signInWithFacebook,
  createNewUser,
} from '../model/authentication-model.js';

import {
  createUserDB,
  readUserDB,
} from '../model/user-firestore-model.js';

import {
  imgCoverUserDefault,
  imgProfileUserDefault,
} from '../view/templateHomeProfile.js';

// FUNCIONES PARA INICIAR SESIÓN

export const authEmailPass = (email, password) => {
  signIn(email, password)
    .then((res) => {
      if (!res.user.emailVerified) {
        const alertLogInSignUp = document.querySelector('#alertLogInSignUp');
        alertLogInSignUp.innerHTML = 'Debe Validar su correo para Iniciar Sesión';
        firebase.auth().signOut();
      } else {
        localStorage.setItem('userName', res.user.displayName);
        window.location.hash = '#/home';
        readUserDB(res.user.uid)
          .then((querySnapshot) => {
            querySnapshot.forEach((refDoc) => {
              const user = refDoc.data();
              localStorage.setItem('userCoverImg', user.coverPhoto);
              localStorage.setItem('userProfileImg', user.profilePicture);
              localStorage.setItem('userName', user.names);
              localStorage.setItem('userAbout', user.about);
            });
          });
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      // const errorMessage = error.message;
      const alertLogInSignUp = document.querySelector('#alertLogInSignUp');
      switch (errorCode) {
        case 'auth/invalid-email':
          alertLogInSignUp.innerHTML = '⚠️ Correo inválido';
          break;
        case 'auth/user-disabled':
          alertLogInSignUp.innerHTML = '⚠️ Comuníquese con el Administrador';
          break;
        case 'auth/user-not-found':
          alertLogInSignUp.innerHTML = '⚠️ Usuario no registrado';
          break;
        case 'auth/wrong-password':
          alertLogInSignUp.innerHTML = '⚠️ El correo o la contraseña ingresados son incorrectos';
          break;
        default:
          alertLogInSignUp.innerHTML = '⚠️ Ha ocurrido un error inesperado';
          break;
      }
    });
};
const readCreateUserDB = (uid, email, coverPhoto, profilePicture, names, about) => {
  readUserDB(uid)
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        createUserDB(uid, email, coverPhoto, profilePicture, names, about);
        localStorage.setItem('userCoverImg', coverPhoto);
        localStorage.setItem('userProfileImg', profilePicture);
        localStorage.setItem('userName', names);
        localStorage.setItem('userAbout', about);
      } else {
        querySnapshot.forEach((refDoc) => {
          const user = refDoc.data();
          localStorage.setItem('userCoverImg', user.coverPhoto);
          localStorage.setItem('userProfileImg', user.profilePicture);
          localStorage.setItem('userName', user.names);
          localStorage.setItem('userAbout', user.about);
        });
      }
    });
};
export const authAccountGoogle = () => {
  signInWithGoogle()
    .then((res) => {
      localStorage.setItem('userName', res.user.displayName);
      localStorage.setItem('userProfileImg', res.user.photoURL);
      window.location.hash = '#/home';
      readCreateUserDB(res.user.uid, res.user.email, imgCoverUserDefault, res.user.photoURL, res.user.displayName, 'Developer');
    })
    .catch((error) => {
      const errorCode = error.code;
      const alertLogInSignUp = document.querySelector('#alertLogInSignUp');
      switch (errorCode) {
        case 'auth/account-exists-with-different-credential':
          alertLogInSignUp.innerHTML = 'Ya existe una cuenta con esta dirección de correo';
          break;
        case 'auth/credential-already-in-use':
          alertLogInSignUp.innerHTML = 'La cuenta corresponde a una credencial existente';
          break;
        case 'auth/email-already-in-use':
          alertLogInSignUp.innerHTML = 'El correo corresponde a una credencial existente';
          break;
        default:
          alertLogInSignUp.innerHTML = 'Error al autenticar con Google';
          break;
      }
    });
};

export const authAccountFacebook = () => {
  signInWithFacebook()
    .then((res) => {
      localStorage.setItem('userName', res.user.displayName);
      localStorage.setItem('userProfileImg', res.user.photoURL);
      window.location.hash = '#/home';
      readCreateUserDB(res.user.uid, res.user.email, imgCoverUserDefault, res.user.photoURL, res.user.displayName, 'Developer');
    })
    .catch((error) => {
      const errorCode = error.code;
      const alertLogInSignUp = document.querySelector('#alertLogInSignUp');
      switch (errorCode) {
        case 'auth/account-exists-with-different-credential':
          alertLogInSignUp.innerHTML = 'Ya existe una cuenta con esta dirección de correo';
          break;
        case 'auth/credential-already-in-use':
          alertLogInSignUp.innerHTML = 'La cuenta corresponde a una credencial existente';
          break;
        case 'auth/email-already-in-use':
          alertLogInSignUp.innerHTML = 'El correo corresponde a una credencial existente';
          break;
        default:
          alertLogInSignUp.innerHTML = 'Error al autenticar con Facebook';
          break;
      }
    });
};

// FUNCIÓN CREAR USUARIO
export const createUser = (email, password, names) => {
  createNewUser(email, password)
    .then((res) => {
      res.user.updateProfile({
        displayName: names,
      });
      const alertLogInSignUp = document.querySelector('#alertLogInSignUp');
      const configuration = {
        url: 'https://szapataq.github.io/LIM012-fe-social-network/src/',
      };
      res.user.sendEmailVerification(configuration)
        .catch(() => {
          alertLogInSignUp.innerHTML = 'Ha ocurrido un error al crear la cuenta';
        });
      alertLogInSignUp.classList.add('alertSignUpOk');
      alertLogInSignUp.innerHTML = 'Cuenta creada satisfactoriamente, se le ha enviado un correo para validar su cuenta';
      // FUNCIÓN QUE ALMACENA LA INFO DEL USUARIO EN LA BBDD
      createUserDB(res.user.uid, email, imgCoverUserDefault, imgProfileUserDefault, names, 'Developer')
        .then(() => {
          // console.log(`Id del usuario => ${refDoc.id}`);
        })
        .catch(() => {
          // console.log(error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const alertLogInSignUp = document.querySelector('#alertLogInSignUp');
      switch (errorCode) {
        case 'auth/email-already-in-use':
          alertLogInSignUp.innerHTML = 'Ya existe una cuenta con este correo';
          break;
        case 'auth/invalid-email':
          alertLogInSignUp.innerHTML = 'Ingrese un correo válido (por ejemplo alguien@example.com)';
          break;
        case 'auth/operation-not-allowed':
          alertLogInSignUp.innerHTML = 'Comuníquese con el Administrador';
          break;
        case 'auth/weak-password':
          alertLogInSignUp.innerHTML = 'La clave debe ser de mínimo 6 dígitos';
          break;
        default:
          alertLogInSignUp.innerHTML = 'Ha ocurrido un error inesperado';
          break;
      }
    });
};
