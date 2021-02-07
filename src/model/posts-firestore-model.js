export const datePostDB = () => {
  const datePost = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  const timePost = {
    hour12: 'true',
    hour: 'numeric',
    minute: 'numeric',
  };

  const date = new Date().toLocaleDateString('es-Es', datePost);
  const time = new Date().toLocaleTimeString('es-Es', timePost);
  const dateTime = `${date} ${time}`;

  return dateTime;
};

const orderDate = () => {
  const dateNow = new Date();
  const year = dateNow.getFullYear();
  const month = `0${dateNow.getMonth()}`.slice(-2);
  const day = `0${dateNow.getDate()}`.slice(-2);
  const hour = `0${dateNow.getHours()}`.slice(-2);
  const minute = `0${dateNow.getMinutes()}`.slice(-2);
  const second = `0${dateNow.getSeconds()}`.slice(-2);
  return parseInt(`${year}${month}${day}${hour}${minute}${second}`, 0);
};

// CREATE POSTS
export const createPostDB = (uid, names, profilePicture, post, imgPost, privacy) => firebase.firestore().collection('posts').add({
  uid,
  names,
  profilePicture,
  post,
  photo: imgPost,
  privacy,
  date: datePostDB(),
  orderDate: orderDate(),
  likes: [],
});

// READ POSTS HOME
export const readPostHome = (callback) => {
  firebase.firestore().collection('posts').where('privacy', '==', '1')
    .orderBy('orderDate', 'desc')
    .onSnapshot((querySanpshot) => {
      const post = [];
      querySanpshot.forEach((doc) => {
        post.push({ id: doc.id, ...doc.data() });
      });
      callback(post);
    });
};

// READ POSTS PROFILE
export const readPostProfile = (uid, callback) => {
  firebase.firestore().collection('posts').where('uid', '==', uid)
    .orderBy('orderDate', 'desc')
    .onSnapshot((querySanpshot) => {
      const post = [];
      querySanpshot.forEach((doc) => {
        post.push({ id: doc.id, ...doc.data() });
      });
      callback(post);
    });
};

// UPDATE PERSONAL DATA
export const updatePersonalData = (idpost, userNames) => firebase.firestore().collection('posts').doc(idpost).update({
  names: userNames,
});

// UPDATE POSTS
export const updatePosts = (idpost, textPost) => firebase.firestore().collection('posts').doc(idpost).update({
  post: textPost,
});

// DELETE POSTS
export const deletePosts = idpost => firebase.firestore().collection('posts').doc(idpost).delete();

// CREATE COMMENTS
export const createCommentsDB = (idPost, uid, names, profilePicture, comment) => firebase.firestore().collection('comments').add({
  idPost,
  uid,
  names,
  profilePicture,
  comment,
  date: datePostDB(),
  orderDate: orderDate(),
});

// READ COMMENTS
export const readComments = (callback, idPost) => {
  firebase.firestore().collection('comments')
    .orderBy('orderDate', 'desc')
    .onSnapshot((querySanpshot) => {
      const comment = [];
      querySanpshot.forEach((doc) => {
        comment.push({ id: doc.id, ...doc.data() });
      });
      callback(comment, idPost);
    });
};

// UPDATE COMMENTS
export const updateCommentsDB = (idcomment, textComment) => firebase.firestore().collection('comments').doc(idcomment).update({
  comment: textComment,
});

// DELETE COMMENTS
export const deleteCommentsDB = idcomment => firebase.firestore().collection('comments').doc(idcomment).delete();

// ADD LIKE
export const addLikeArr = (idPost, uid) => (
  firebase.firestore().collection('posts').doc(idPost)
    .update({ likes: firebase.firestore.FieldValue.arrayUnion(uid) })
);

// REMOVE LIKE
export const removeLikeArr = (idPost, uid) => (
  firebase.firestore().collection('posts').doc(idPost)
    .update({ likes: firebase.firestore.FieldValue.arrayRemove(uid) })
);
