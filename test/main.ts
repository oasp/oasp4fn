import { error } from 'util';

import { expect } from 'chai'
import db from '../src/data-collector'

describe('table', () => {
  
     it('The function should return a reference to the self object', () => {
         expect(db.table('employees')).to.be.an('object')
         expect(db.table('employees')).to.contain.all.keys(['table', 'where', 'orderBy', 'first', 'count', 'project', 'each', 'reduce', 'insert', 'delete', 'join', 'then'])
     })
     it('If the table exist, the resolution promise should return an Array<Object>', () => {
        db.table('employees').then((res: Array<Object>) => {
            expect(res).to.be.an('array')
            expect(res).to.have.lengthOf(4)
         })
     })
     it('If the table doesn\'t exist, the resoluton promise should return an Error', () => {
         db.table('some_table').then(null, (err: Error) => {
            expect(err).to.be.a('string')
         })
     })
     it('If an id is passed along with the name of the table, the corresponding item will be returned', () => {
         db.table('departments', '1')
             .then((res: Object) => {
                 expect(res).to.be.an('object')
                 expect(res).to.have.property('id', '1')
             })
     })
     it('If an array of id\'s is passed along with the name of the table, the corresponding list of items will be returned', (done: Function) => {
             db.table('departments', ['1', '3', '4'])
                 .then((res: Object) => {
                    try {
                        expect(res).to.be.an('array')
                        expect(res).to.have.lengthOf(3)
                        done()
                    }
                    catch (err){
                        done(err)
                    }
                 }, (err: Error) => {
                     try {
                         expect(err).to.be.undefined
                         done()
                     }
                     catch (err) {
                         done(err)
                     }
                 })
     })
     it('If an id passed doesn\'t have an item in the table, an error will be returned', (done: Function) => {
         db.table('departments', '7')
             .then(null, (err: Error) => {
                 try {
                     expect(err).to.be.a('string')
                     done()
                 }
                 catch (err) {
                     done(err)
                 }
             })
        db.table('departments',  ['1', '6', '4'])
            .then((res: Array<Object>) => {
                    
                }, (err: Error) => {
                try {
                    expect(err).to.be.a('string')
                    done()
                }
                catch (err) {
                    done(err)
                }
            })
     })
})

