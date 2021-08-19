import _ from 'lodash';
import chai from 'chai';
import Post from '../setup/Post';
import Author from '../setup/Author';
import { HandlingFake } from '../setup//fakes/HandilingFake';
import { QueryModifierFake } from '../setup//fakes/QueryModifierFake';
import { QueryBuilderFake } from '../setup/fakes/QueryBuilderFake';

// Classes a serem testadas (Implementações da Classe Abstrata Model)
let post: Post;
let author: Author;

describe('Unit Tests - Model', () => {
  before('Setup', () => {
    post = new Post(new QueryBuilderFake(), new QueryModifierFake(), new HandlingFake());

    author = new Author();
    author.id = 2;
    author.type = 'authors';
  });

  afterEach('Reseta o Post', () => {
    post = new Post(new QueryBuilderFake(), new QueryModifierFake(), new HandlingFake());
  })

  it('All', () => {
    chai.expect(post.all().getUrlConfig()).to.deep.equal({
      data: undefined,
      headers: undefined,
      method: 'GET',
      url: 'http://localhost/api/posts',
    });
  });

  it('Search', () => {
    chai.expect(post.search().getUrlConfig()).to.deep.equal({
      method: 'GET',
      url: 'http://localhost/api/posts/search',
      data: undefined,
      headers: undefined
    });
  });

  it('Find', () => {
    chai.expect(post.find(1).getUrlConfig()).to.deep.equal({
      data: undefined,
      headers: undefined,
      method: 'GET',
      url: 'http://localhost/api/posts/1',
    });
  });

  it('Attach de Post com Author', () => {
    post.id = 10;

    chai.expect(post.attach([author]).getUrlConfig()).deep.includes({
      method: 'PATCH',
      url: 'http://localhost/api/posts/10/relationships/authors',
      headers: undefined,
      data: '{"id":10,"type":"posts"}',
      // ? O Body não é padrão JSONAPI, ou o que realmente retorna na API,
      // ? Pois no caso o Handling (Responsavel por serializar) é fake,
      // ? O teste garante que o que for retornado pelo Handling, será adicionado ao ConfigUrl
    });
  });

  it('Detach de Post com Author', () => {
    post.id = 11;

    chai.expect(post.detach([author]).getUrlConfig()).to.deep.includes({
      method: 'PATCH',
      url: 'http://localhost/api/posts/11/relationships/authors',
      headers: undefined,
      data: JSON.stringify({data: []}),
    });
  });

  it('Create Pivot de Post com Author', () => {
    post.id = 12;

    chai.expect(post.createPivot([author]).getUrlConfig()).to.deep.includes({
      method: 'POST',
      url: 'http://localhost/api/posts/12/relationships/authors',
      headers: undefined,
      data: '{"id":12,"type":"posts"}',
      // ? O Body não é padrão JSONAPI, ou o que realmente retorna na API,
      // ? Pois no caso o Handling (Responsavel por serializar) é fake,
      // ? O teste garante que o que for retornado pelo Handling, será adicionado ao ConfigUrl
    });
  });

  it('Delete Pivot de Post com Author', () => {
    post.id = 13;

    chai.expect(post.deletePivot([author]).getUrlConfig()).to.deep.includes({
      method: 'DELETE',
      url: 'http://localhost/api/posts/13/relationships/authors',
      headers: undefined,
      data: '{"id":13,"type":"posts"}',
      // ? O Body não é padrão JSONAPI, ou o que realmente retorna na API,
      // ? Pois no caso o Handling (Responsavel por serializar) é fake,
      // ? O teste garante que o que for retornado pelo Handling, será adicionado ao ConfigUrl
    });
  });

  it('Save sem ID', () => {
    chai.expect(post.save().getUrlConfig()).to.deep.includes({
      method: 'POST',
      url: 'http://localhost/api/posts',
      headers: undefined,
      data: '{"type":"posts"}',
      // ? O Body não é padrão JSONAPI, ou o que realmente retorna na API,
      // ? Pois no caso o Handling (Responsavel por serializar) é fake,
      // ? O teste garante que o que for retornado pelo Handling, será adicionado ao ConfigUrl
    });
  });

  it('Save com ID (Já setado na Model)', () => {
    post.id = 11;

    chai.expect(post.save().getUrlConfig()).to.deep.includes({
      method: 'PUT',
      url: 'http://localhost/api/posts/11',
      headers: undefined,
      data: '{"id":11,"type":"posts"}',
      // ? O Body não é padrão JSONAPI, ou o que realmente retorna na API,
      // ? Pois no caso o Handling (Responsavel por serializar) é fake,
      // ? O teste garante que o que for retornado pelo Handling, será adicionado ao ConfigUrl
    });
  });

  it('Save passando o ID', () => {
    chai.expect(post.save(10).getUrlConfig()).to.deep.includes({
      method: 'PUT',
      url: 'http://localhost/api/posts/10',
      headers: undefined,
      data: '{"id":10,"type":"posts"}',
      // ? O Body não é padrão JSONAPI, ou o que realmente retorna na API,
      // ? Pois no caso o Handling (Responsavel por serializar) é fake,
      // ? O teste garante que o que for retornado pelo Handling, será adicionado ao ConfigUrl
    });
  });

  it('Create', () => {
    chai.expect(post.create().getUrlConfig()).to.deep.includes({
      method: 'POST',
      url: 'http://localhost/api/posts',
      headers: undefined,
      data: '{"type":"posts"}',
      // ? O Body não é padrão JSONAPI, ou o que realmente retorna na API,
      // ? Pois no caso o Handling (Responsavel por serializar) é fake,
      // ? O teste garante que o que for retornado pelo Handling, será adicionado ao ConfigUrl
    });
  });

  it('Update (Obrigatorio ID)', () => {
    chai.expect(post.update(5).getUrlConfig()).to.deep.includes({
      method: 'PUT',
      url: 'http://localhost/api/posts/5',
      headers: undefined,
      data: '{"id":5,"type":"posts"}',
      // ? O Body não é padrão JSONAPI, ou o que realmente retorna na API,
      // ? Pois no caso o Handling (Responsavel por serializar) é fake,
      // ? O teste garante que o que for retornado pelo Handling, será adicionado ao ConfigUrl
    });
  });

  it('Delete sem passar ID (Model já setada com ID)', () => {
    post.id = 20; // ID já setado na model

    chai.expect(post.delete().getUrlConfig()).to.deep.includes({
      method: 'DELETE',
      url: 'http://localhost/api/posts/20',
      headers: undefined
    });
  });

  it('Delete passando ID', () => {
    chai.expect(post.delete(7).getUrlConfig()).to.deep.includes({
      method: 'DELETE',
      url: 'http://localhost/api/posts/7',
      headers: undefined
    });
  });
});