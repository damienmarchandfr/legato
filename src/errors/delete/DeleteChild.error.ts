import { LegatoEntity } from '../../entity'
import { ObjectID } from 'mongodb'
import { DataStorageFielRelationValue } from '../..'
import { LegatoErrorAbstract } from '..'

export class LegatoErrorDeleteChild extends LegatoErrorAbstract {
	// Parent want to delete
	parentCollectionName: string
	parentMongoID: ObjectID | undefined
	parentClass: Function
	parentRelationKey: string
	parentRelationKeyValue: any
	parent: LegatoEntity

	// Child linked
	childCollectionName: string
	childMongoID: ObjectID | undefined
	childClass: Function
	childRelationKey: string
	childRelationKeyValue: any
	child: LegatoEntity

	constructor(
		parent: LegatoEntity,
		child: LegatoEntity,
		meta: DataStorageFielRelationValue
	) {
		const message = `Cannot delete ${child.getCollectionName()} with _id = ${
			child._id
		} because it's linked to his parent ${parent.getCollectionName()} with _id = ${
			parent._id
		}.`
		super(message, 'LEGATO_ERROR_4')

		// Parent informations
		this.parent = parent.toPlainObj()
		this.parentClass = parent.constructor
		this.parentCollectionName = parent.getCollectionName()
		this.parentMongoID = parent._id
		this.parentRelationKey = meta.key
		this.parentRelationKeyValue = (parent as any)[meta.key]

		// Child information
		this.child = child.toPlainObj()
		this.childClass = child.constructor
		this.childCollectionName = child.getCollectionName()
		this.childMongoID = child._id
		this.childRelationKey = meta.targetKey
		this.childRelationKeyValue = (child as any)[meta.targetKey]
	}

	toPlainObj() {
		const errorKey = ['message']
		const parentKeys = [
			'parentCollectionName',
			'parentMongoID',
			'parentClass',
			'parentRelationKey',
			'parentRelationKeyValue',
			'parent',
		]
		const childKeys = [
			'childCollectionName',
			'childMongoID',
			'childClass',
			'childRelationKey',
			'childRelationKeyValue',
			'child',
		]
		const toReturn: any = {}
		for (const key of errorKey.concat(parentKeys, childKeys)) {
			toReturn[key] = (this as any)[key]
		}
		return toReturn
	}
}