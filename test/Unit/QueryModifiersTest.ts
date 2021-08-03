import _ from 'lodash';
import chai from 'chai';
import { QueryModifier } from '../../src';

/** @type {*} */
let queryModifier: QueryModifier;

describe('Unit Tests - QueryModifiers', () => {
  before('Setup QueryModifier', () => {
    queryModifier = new QueryModifier();
  })

  describe('Include', () => {
    it('One attribute', () => {
      const includes = ['company']

      chai.expect(queryModifier.include(includes)).to.deep.equal([ 'company']);
    });

    it('Multiples attribute', () => {
      const includes = ['company', 'chief', 'type']

      chai.expect(queryModifier.include(includes)).to.deep.equal([ 'company', 'chief', 'type' ]);
    });

    it('Repeated company attribute', () => {
      const includes = ['company', 'company', 'chief', 'type']

      chai.expect(queryModifier.include(includes)).to.deep.equal([ 'company', 'chief', 'type' ]);
    });
  });

  describe('Select', () => {
    it('One attribute', () => {
      const selects = ['title']
  
      chai.expect(queryModifier.select('posts', selects)).to.deep.equal({ posts: 'title' });
    });

    it('Multiples attribute', () => {
      const selects = ['title', 'subtitle']
  
      chai.expect(queryModifier.select('posts', selects)).to.deep.equal({ posts: 'title,subtitle' });
    });
  });

  describe('Where (without group)', () => {
    it('One filter', () => {
      chai.expect(queryModifier.filter('name', 'Jose')).to.deep.equal({ name: 'Jose' });
    });
  });

  describe('Where (with group)', () => {
    it('One group filter', () => {
      chai.expect(queryModifier.filter('permission', 'Admin', 'user')).to.deep.equal({ 'user.permission': 'Admin' } );
    });
  });

  describe('Order By Asc', () => {
    it('One attribute', () => {
      const orders = ['created_at'];
  
      chai.expect(queryModifier.orderBy(orders, 'asc')).to.deep.equal(['created_at']);
    });

    it('Multiples attributes', () => {
      const orders = ['created_at', 'updated_at'];
  
      chai.expect(queryModifier.orderBy(orders, 'asc')).to.deep.equal(['created_at', 'updated_at']);
    });
  });

  describe('Order By Desc', () => {
    it('One attribute', () => {
      const orders = ['created_at'];
  
      chai.expect(queryModifier.orderBy(orders, 'desc')).to.deep.equal(['-created_at']);
    });

    it('Multiples attributes', () => {
      const orders = ['created_at', 'updated_at'];
  
      chai.expect(queryModifier.orderBy(orders, 'desc')).to.deep.equal(['-created_at','-updated_at']);
    });
  });
});
