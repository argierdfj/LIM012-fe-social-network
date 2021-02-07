import {
  device,
} from '../utiles/utilitarias.js';

import {
  createCommentsDB,
  deleteCommentsDB,
  updateCommentsDB,
} from '../model/posts-firestore-model.js';

import {
  templateComment,
} from '../view/templateComment.js';

// FUNCIÓN PARA CREAR COMENTARIO
export const createNewComment = (idPost, comment) => {
  const names = localStorage.getItem('userName');
  const profilePic = localStorage.getItem('userProfileImg');
  const idCurrentUser = firebase.auth().currentUser.uid;

  return createCommentsDB(idPost, idCurrentUser, names, profilePic, comment)
    .then(() => {
      // console.log(res.id);
    })
    .catch(() => {
      // console.log(error);
    });
};

// DELETE COMMENT
export const deleteCommentOnClick = () => {
  const iconDelete = document.querySelectorAll('.del');
  if (iconDelete.length) {
    iconDelete.forEach((objComment) => {
      objComment.addEventListener('click', () => {
        const idcomment = objComment.getAttribute('idcomment');
        deleteCommentsDB(idcomment)
          .then(() => {})
          .catch(() => {});
      });
    });
  }
};

// UPDATE COMMENT
export const updateCommentOnClick = () => {
  const iconUpdateComment = document.querySelectorAll('.update-comment');
  if (iconUpdateComment.length) {
    iconUpdateComment.forEach((comments) => {
      comments.addEventListener('click', (evento) => {
        evento.preventDefault();
        const idComment = comments.getAttribute('idComment');
        const textComment = document.querySelector(`#textComment-${idComment}`);
        // console.log(textComment);
        const iconSaveComment = textComment.parentNode.querySelector('.save-comment');
        textComment.contentEditable = 'true';
        textComment.focus();
        iconSaveComment.classList.remove('hide');
      });
    });
  }

  // FUNCIÓN PARA GUARDAR LA ACTUALIZACIÓN DEL COMENTARIO
  const iconSaveCom = document.querySelectorAll('.save-comment');
  if (iconSaveCom.length) {
    iconSaveCom.forEach((comments) => {
      comments.addEventListener('click', (evento) => {
        evento.preventDefault();
        const idComment = comments.getAttribute('idComment');
        const textComment = document.querySelector(`#textComment-${idComment}`);
        if (textComment.innerText.trim() !== '') {
          textComment.contentEditable = 'false';
          comments.classList.add('hide');
          const comment = textComment.innerText.trim();
          updateCommentsDB(idComment, comment)
            .then(() => {})
            .catch(() => {});
        }
      });
    });
  }

  // FUNCIÓN PARA INHABILITAR EL BTN DE COMENTARIOS SI EL CAMPO ESTÁ VACÍO
  const textComment = document.querySelectorAll('.p-comment');
  if (textComment.length) {
    textComment.forEach((objComment) => {
      objComment.addEventListener('keyup', () => {
        const icon = objComment.parentNode.querySelector('.save-comment');
        if (icon) {
          if (objComment.innerText.trim() === '') {
            icon.classList.add('activeSave');
          } else {
            icon.classList.remove('activeSave');
          }
        }
      });
    });
  }
};

// SHOW OPTIONS COMMENT
const showOpt = () => {
  const containerComment = document.querySelectorAll('.name-comment');
  if (containerComment.length) {
    containerComment.forEach((objComment) => {
      if (device() === 'Desktop') {
        objComment.addEventListener('mouseover', () => {
          const opt = objComment.querySelector('.comment');
          if (opt && !opt.classList.contains('active')) {
            opt.classList.remove('hide');
          }
        });
        objComment.addEventListener('mouseleave', () => {
          const opt = objComment.querySelector('.comment');
          if (opt && !opt.classList.contains('active')) {
            opt.classList.add('hide');
          }
        });
      } else {
        const opt = objComment.querySelector('.comment');
        if (opt) {
          opt.classList.remove('hide');
        }
      }
    });
  }
};

// READ COMMENT
export const readingComment = (comments, idPost) => {
  const container = document.querySelector(`#containerComment-${idPost}`);
  const numComments = document.querySelector(`.numComments-${idPost}`);
  const uidUser = firebase.auth().currentUser.uid;
  if (container) {
    container.innerHTML = '';
    numComments.innerText = '0';
    comments.forEach((comment) => {
      if (idPost === comment.idPost) {
        numComments.innerText = parseInt(numComments.innerText, 0) + 1;
        const divComment = templateComment(comment.names,
          comment.profilePicture, comment.comment, comment.date, comment.id, uidUser, comment.uid);
        // console.log('user', uidUser);
        // console.log('user', comment.uid);
        container.appendChild(divComment);
      }
    });

    if (parseInt(numComments.innerText, 0) === 1) {
      numComments.innerText = `${numComments.innerText} Comentario`;
    } else {
      numComments.innerText = `${numComments.innerText} Comentarios`;
    }
  }

  deleteCommentOnClick();
  updateCommentOnClick();
  showOpt();

  return container;
};
