export const shareImgPost = (file, uid) => {
  const refStorage = firebase.storage().ref(`imgPosts/${uid}/${file.name}`);
  const taskStorage = refStorage.put(file);

  const stateSnapshot = (snapshot) => {
    const percent = snapshot.bytesTransferred / snapshot.totalBytes * 100;
    const progress = document.querySelector('.progress');
    progress.parentNode.classList.add('showProgress');
    progress.innerText = `${percent.toFixed(0)}%`;
    progress.style.width = `${percent}%`;
  };

  const catchError = () => {
    const progress = document.querySelector('.progress');
    progress.classList.add('errorMessage');
    progress.innerText = '⚠️ Ups, esta imagen es demasiado grande, debe ser menor a 5mb.';
    setTimeout(() => {
      progress.parentNode.classList.remove('showProgress');
      progress.classList.remove('errorMessage');
    }, 3000);
  };

  const fileReady = () => {
    taskStorage.snapshot.ref.getDownloadURL()
      .then((url) => {
        // console.log(url);
        sessionStorage.setItem('imgNewPost', url);
        const pic = document.querySelector('.picPost');
        pic.parentNode.classList.remove('hide');
        pic.setAttribute('src', url);
      })
      .catch(() => {
        // console.log(err.message);
      });
    setTimeout(() => {
      const progress = document.querySelector('.progress');
      progress.parentNode.classList.remove('showProgress');
    }, 2500);
  };
  taskStorage.on('state_changed', stateSnapshot, catchError, fileReady);
};

export const delFileStorage = (file, uid) => firebase.storage().ref().child(`imgPosts/${uid}/${file}`).delete();
