import _ from 'lodash';
import chai from 'chai';
import { QueryBuilder } from '../../src';

/** 
 *  Classa a ser testada
 * 
 *  @type {QueryBuilder}
 */
let queryBuilder: QueryBuilder;

describe('Unit Tests - QueryBuilder', () => {
  before('Setup QueryBuilder', () => {
    queryBuilder = new QueryBuilder();
  })

  afterEach('Clean Query Builder', () => {
    queryBuilder.resetQuery()
  })

  describe('Get Query', () => {
    it('Sem parametros', () => {
      chai.expect(queryBuilder.getQuery()).to.deep.equal('');
    });

    describe('Include', () => {
      it('Um Parametro', () => {
        queryBuilder.addIncludes(['company']);

        chai.expect(queryBuilder.getQuery()).to.deep.equal(encodeURI('?include=company'));
      });

      it('Dois Parametros', () => {
        queryBuilder.addIncludes(['company', 'product']);

        chai.expect(queryBuilder.getQuery()).to.deep.equal(encodeURI('?include=company,product'));
      });

      it('Duas invocações do include', () => {
        queryBuilder.addIncludes(['company']);
        queryBuilder.addIncludes(['product']);

        chai.expect(queryBuilder.getQuery()).to.deep.equal(encodeURI('?include=company,product'));
      });
    });

    describe('Fields (Select)', () => {
      it('Um Parametro', () => {
        queryBuilder.addFields({ posts: 'title' });

        chai.expect(queryBuilder.getQuery()).to.deep.equal(encodeURI('?fields[posts]=title'));
      });

      it('Dois Parametros', () => {
        queryBuilder.addFields({ posts: 'title,description' });

        chai.expect(queryBuilder.getQuery()).to.deep.equal(encodeURI('?fields[posts]=title,description'));
      });

      it('Duas invocações do fields(select) (Gera dois fileds na URL)', () => {
        queryBuilder.addFields({ posts: 'title' });
        queryBuilder.addFields({ posts: 'description' });

        chai.expect(queryBuilder.getQuery()).to.deep.equal(encodeURI('?fields[posts]=title&fields[posts]=description'));
      });
    });

    describe('Filters', () => {
      it('Um Parametro', () => {
        queryBuilder.addFilters({ title: 'Nome do Post' });

        chai.expect(queryBuilder.getQuery()).to.deep.equal(encodeURI('?filter[title]=Nome do Post'));
      });

      it('Dois Parametros', () => {
        queryBuilder.addFilters({ title: 'Nome do Post,Nome do Post 2' });

        chai.expect(queryBuilder.getQuery()).to.deep.equal(encodeURI('?filter[title]=Nome do Post,Nome do Post 2'));
      });

      it('Com grupo (Entidade relacionada)', () => {
        queryBuilder.addFilters({ 'author.name': 'Roberto,Rodrigo' });

        chai.expect(queryBuilder.getQuery()).to.deep.equal(encodeURI('?filter[author.name]=Roberto,Rodrigo'));
      });

      it('Duas invocações do filter (Gera dois filters na URL)', () => {
        queryBuilder.addFilters({ title: 'Nome do Post' });
        queryBuilder.addFilters({ active: 'true' });

        chai.expect(queryBuilder.getQuery()).to.deep.equal(encodeURI('?filter[title]=Nome do Post&filter[active]=true'));
      });
    });

    describe('Sort', () => {
      it('Um Parametro ASC', () => {
        queryBuilder.addSort(['title']);

        chai.expect(queryBuilder.getQuery()).to.deep.equal(encodeURI('?sort=title'));
      });

      it('Dois Parametros ASC', () => {
        queryBuilder.addSort(['title', 'description']);

        chai.expect(queryBuilder.getQuery()).to.deep.equal(encodeURI('?sort=title,description'));
      });

      it('Duas invocações da função ASC', () => {
        queryBuilder.addSort(['title']);
        queryBuilder.addSort(['description']);

        chai.expect(queryBuilder.getQuery()).to.deep.equal(encodeURI('?sort=title,description'));
      });

      it('Um Parametro Desc', () => {
        queryBuilder.addSort(['-title']);

        chai.expect(queryBuilder.getQuery()).to.deep.equal(encodeURI('?sort=-title'));
      });

      it('Dois Parametros Desc', () => {
        queryBuilder.addSort(['-title', '-description']);

        chai.expect(queryBuilder.getQuery()).to.deep.equal(encodeURI('?sort=-title,-description'));
      });

      it('Duas invocações da função Desc', () => {
        queryBuilder.addSort(['-title']);
        queryBuilder.addSort(['-description']);

        chai.expect(queryBuilder.getQuery()).to.deep.equal(encodeURI('?sort=-title,-description'));
      });

      it('Duas invocações da função - Uma ASC e outra DESC', () => {
        queryBuilder.addSort(['-title']);
        queryBuilder.addSort(['description']);

        chai.expect(queryBuilder.getQuery()).to.deep.equal(encodeURI('?sort=-title,description'));
      });

      it('Duas invocações do sort, com multiplos parametros - ASC e DESC', () => {
        queryBuilder.addSort(['-title', '-created_at']);
        queryBuilder.addSort(['description', 'name']);

        chai.expect(queryBuilder.getQuery()).to.deep.equal(encodeURI('?sort=-title,-created_at,description,name'));
      });
    });

    describe('Paginate', () => {
      it('Um Parametro', () => {
        queryBuilder.addPagination({ number: 1, size: 25 });

        chai.expect(queryBuilder.getQuery()).to.deep.equal(encodeURI('?page[size]=25&page[number]=1'));
      });

      it('Segunda invocações do paginate (A ultima invocação sobrepoem as iniciais)', () => {
        queryBuilder.addPagination({ number: 1, size: 25 });
        queryBuilder.addPagination({ number: 2, size: 50 });

        chai.expect(queryBuilder.getQuery()).to.deep.equal(encodeURI('?page[size]=50&page[number]=2'));
      });
    });

    describe('Invocações de multiplas funções', () => {
      it('Uma Paginação de 25 items, na pagina 1, com include de Autores, ordenado de forma decrescente por Data de Criação, filtrado pelo Titulo "Post Um" e selecionado apenas os campos id, titulo e data de criação', () => {
        queryBuilder.addPagination({ number: 1, size: 25 });
        queryBuilder.addIncludes(['author'])
        queryBuilder.addFields({ posts: 'id,title,created_at' })
        queryBuilder.addFilters({ title: 'Post Um' })
        queryBuilder.addSort(['-created_at'])

        chai.expect(queryBuilder.getQuery()).to.deep.equal(encodeURI('?include=author&fields[posts]=id,title,created_at&filter[title]=Post Um&page[size]=25&page[number]=1&sort=-created_at'));
      });
    });
  });

  describe('Reset Query', () => {
    it('Padrão', () => {
      queryBuilder.addIncludes(['company']);
      queryBuilder.addFields({ posts: 'title' });
      queryBuilder.addFilters({ title: 'melhor post' });
      queryBuilder.addPagination({number: 1, size: 25});
      queryBuilder.addSort(['created_at', 'updated_at']);

      chai.expect(queryBuilder).to.deep.equal({
        _fields: [{ posts: 'title' }],
        _filters: [{ title: 'melhor post' }],
        _includes: ['company'],
        _pagination: {
          number: 1,
          size: 25,
        },
        _query: '',
        _sort: ['created_at', 'updated_at'],
      });

      queryBuilder.resetQuery();

      chai.expect(queryBuilder).to.deep.equal({
        _fields: [],
        _filters: [],
        _includes: [],
        _pagination: {
          number: NaN,
          size: NaN,
        },
        _query: '',
        _sort: [],
      });
    });
  });
});
