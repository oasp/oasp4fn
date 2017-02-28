import { error } from 'util';

import { expect } from 'chai'
import db from '../data-collector'

describe('table', () => {
    let good_test: any
    let error_test: any
     before(() => {
         good_test = db.table('employees')
         error_test = db.table('some_table')
     })
     it('The function should return a reference to the self object', () => {
         expect(good_test).to.be.an('object')
         expect(good_test).to.contain.all.keys(['table', 'where', 'orderBy', 'first', 'count', 'project', 'each', 'reduce', 'insert', 'delete', 'join', 'then'])
         expect(error_test).to.be.an('object')
         expect(error_test).to.contain.all.keys(['table', 'where', 'orderBy', 'first', 'count', 'project', 'each', 'reduce', 'insert', 'delete', 'join', 'then'])
     })
     it('If the table exist, the resolution promise should return an Array<Object>', () => {
         good_test.then((res: Array<Object>) => {
            expect(res).to.be.an('array')
            expect(res).to.have.lengthOf(4)
         })
     })
     it('If the table doesn\'t exist, the resoluton promise should return an Error', () => {
         error_test.then(null, (err: Error) => {
            expect(err).to.be.an('error')
         })
     })
     it('If an id is passed along with the name of the table, the corresponding item will be returned', () => {
         db.table('departments', '1')
             .then((res: Object) => {
                 expect(res).to.be.an('object')
                 expect(res).to.have.property('id', '1')
             })
     })
     it('If an array of id\'s is passed along with the name of the table, the corresponding list of items will be returned', () => {
         db.table('departments', ['1', '3', '4'])
             .then((res: Object) => {
                 expect(res).to.be.an('array')
                 expect(res).to.have.lengthOf(4)
             })
     })
})

