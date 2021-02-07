import MockFirebase from 'mock-cloud-firestore';
import {
  createPostDB,
  readPostHome,
  readPostProfile,
  updatePosts,
  deletePosts,
} from '../src/model/posts-firestore-model.js';

const fixtureData = {
  __collection__: {
    posts: {
      __doc__: {
        a01: {
          uid: 'user1',
          names: 'Sandra',
          profilePicture: '',
          post: 'hola que hace',
          privacy: '1',
          date: '17 de mayo',
          orderDate: 1,
        },
        a02: {
          uid: 'user2',
          names: 'Veria',
          profilePicture: '',
          post: 'probando red social',
          privacy: '1',
          date: '10 de mayo',
          orderDate: 2,
        },
        a03: {
          uid: 'user2',
          names: 'Veria',
          profilePicture: '',
          post: 'probando mi segunda prueba',
          privacy: '1',
          date: '10 de mayo',
          orderDate: 2,
        },
      },
    },
  },
};

global.firebase = new MockFirebase(fixtureData, { isNaiveSnapshotListenerEnabled: true });

describe('Añadir post', () => {
  it('Debería poder agregar un post', done => createPostDB('user3', 'Maria', '', 'abc', '', '1')
    .then(() => {
      const callback = (post) => {
        const result = post.find(elemento => elemento.post === 'abc');
        expect(result.post).toBe('abc');
        done();
      };
      readPostHome(callback);
    }));
});

describe('Mostrar post de los usuarios', () => {
  it('debería leer todos los posts de un usuario', done => readPostProfile('user2', (data) => {
    const result = data.filter(post => post.uid === 'user2');
    expect(result).toHaveLength(2);
    done();
  }));
});

describe('Editar post de usuarios', () => {
  it('Deberia poder editar el post con id a02', done => updatePosts('a02', 'actualizando post').then(() => {
    const callback = (post) => {
      const result = post.find(elemento => elemento.post === 'actualizando post');
      expect(result.post).toBe('actualizando post');
      done();
    };
    readPostHome(callback);
  }));
});

describe('Delete post', () => {
  it('Deberia poder eliminar el post con id a02', done => deletePosts('a01').then(() => {
    const callback = (post) => {
      console.log(post);
      const result = post.find(elemento => elemento.id === 'a01');
      expect(result).toBe(undefined);
      done();
    };
    readPostHome(callback);
  }));
});
