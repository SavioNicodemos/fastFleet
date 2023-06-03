import { Realm } from '@realm/react';

export class Historic extends Realm.Object<Historic> {
  static generate() {
    return {
      id: Math.floor(Math.random() * 999999),
      date: new Date(),
      value: 0,
      type: 'in',
    };
  }

  static schema = {
    name: 'Historic',
    primaryKey: '_id',

    properties: {
      _id: 'uuid',
      user_id: {
        type: 'string',
        indexed: true,
      },
      license_plate: 'string',
      description: 'string',
      status: 'string',
      created_at: 'date',
      updated_at: 'date',
    },
  };
}
