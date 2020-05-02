export const homeHeader = `
  <a href="#/home"><img src="./img/home.png" alt="Home" class="icons-cp">
  <span>Inicio</span></a>`;

export const profile = `
  <a href="#/profile"><img src="./img/profile.png" alt="Profile" class="icons-cp usercp">
  <span>Perfil</span></a>`;

export const optionsMobile = `
  <div class="items itemsHover">${homeHeader}</div>
  <div class="items itemsHover">${profile}</div>`;

export const postProfile = `
  <div class="new-post">
    <textarea rows="4" cols="50" placeholder="¿Qué quieres compartir?" id="postProfile"></textarea>
    <div class="container-functions">
      <div class="camera-privacity">
        <img src="./img/camera.png" class="camera">
        <div class="privacidad">
          <select id="privacyPostProfile">
            <option value="1"> 🌐 Público</option>
            <option value="1"> 🔓 Solo yo </option>
          </select>
        </div>
      </div>
      <button id="btnSharePostProfile"> Compartir</button>
    </div>
  </div>`;

// FUNCIÓN DE NÚMERO ALEATORIOS
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const imgProfileUserDefault = `./img/profilePictureRandom/iconUser_${getRandomInt(1, 10)}.png`;
export const imgCoverUserDefault = `./img/ImgRandom/image_${getRandomInt(1, 15)}.png`;

export const postHome = `
  <div class="own-post">
    <div class="title-new-post-own">
      <img src="${localStorage.getItem('userProfileImg') || imgProfileUserDefault}" alt="" class="user-foto">
      <div class="comun-ocupation">
        <h4>${localStorage.getItem('userName')}</h4>
        <img src="./img/public.png" alt="" class="icon-own">
      </div>
      <div class="simulator-select">
        <span><i class="fas fa-ellipsis-v"></i></span>
        <ul>
          <li>🌐 Público</li>
          <li>🔓 Solo yo</li>
        </ul>
      </div>
    </div>
    <div class="new-post">
      <textarea rows="4" cols="50" placeholder="¿Qué quieres compartir?"></textarea>
      <div class="container-functions">
        <div class="camera-privacity">
          <img src="./img/camera.png" class="camera">
        </div>
        <button> Compartir</button>
      </div>
    </div>
  </div>`;

const iconEdit = () => {
  let icon = '';
  if (/profile/.test(window.location.hash)) {
    icon = '<img src="./img/edit.png" class="edit">';
  }
  return icon;
};

export const userLoggedIn = () => `
  <figure>
    <img src="${localStorage.getItem('userCoverImg') || imgCoverUserDefault}" alt="cover image" class="img-general">
  </figure>
  <img src="${localStorage.getItem('userProfileImg') || imgProfileUserDefault}" class="photo">
  <div class="user-data">
    <div class="container-info">
      <div class="name">
        <p>${localStorage.getItem('userName')}</p>
        ${iconEdit()}
      </div>
      <div class="description">
        <p>&lt;/&gt;${localStorage.getItem('userAbout') || 'Developer'}</p>
        ${iconEdit()}
      </div>
    </div>
  </div>`;

export const templatePost = (photoUrl, names, date, post, likes, comments) => `
<div class="each-post">
  <div class="title-new-post">
    <img src="${photoUrl}" alt="" class="user-foto">
    <div>
      <h4>${names}</h4>
      <div class="time">
        <p>${date}</p>
        <img src="./img/public.png" alt="privacidad">
      </div>
    </div>
  </div>
  <div class="body-post">
    <p>${post}</p>
  </div>
  <div class="like-comment">
    <div>
      <img src="./img/like.png" alt="" class="icon-like">
      <img src="./img/comment.png" alt="" class="icon-comment">
    </div>
    <p>${likes} Me Gusta ${comments.length} Comentarios</p>
  </div>
</div>`;
