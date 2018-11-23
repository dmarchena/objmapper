import objmapper from '../index';

const obj = {
    name: 'Juan',
    surname: 'Munain',
    mobile: '655778899',
    phone: '945667788',
    parents: [
        {
            name: 'Martin',
            surname: 'Munain',
        },
        {
            name: 'Maitane',
            surname: 'Gamiz',
        },
    ],
};

describe('Object Mapper:', () => {

    describe('Simple transformations', () => {
        const m = objmapper({
            key: 'name',
            transform: (name) => 'noname',
        });

        it('should not mutate the param', () => {
            const res = m(obj);
            expect(obj.name).toBe('Juan');
            expect(obj).not.toBe(res);
        });

        it('should transform the property', () => {
            expect(m(obj).name).toBe('noname');
        });
    });

    describe('Various simple transformations', () => {
        const m = objmapper([
            {
                key: 'name',
                transform: (str) => str.toLowerCase(),
            }, {
                key: 'surname',
                transform: (str) => str.toUpperCase(),
            },
        ]);

        it('should transform various properties', () => {
            const res = m(obj);
            expect(res.name).not.toBe('Juan');
            expect(res.name).toBe('juan');
            expect(res.surname).not.toBe('Munain');
            expect(res.surname).toBe('MUNAIN');
        });
    });
    describe('Different key for transformation output', () => {
        const m = objmapper([
            {
                key: 'name',
                keyout: 'nombre',
            }, {
                key: 'surname',
                transform: (str) => str.toUpperCase(),
                keyout: 'apellido',
            },
        ]);

        it('should apply transformations (if are defined) and remove old keys', () => {
            const res = m(obj);
            expect(res.name).toBeUndefined();
            expect(res.surname).toBeUndefined();
            expect(res.nombre).toBe(obj.name); // Only changes property key
            expect(res.apellido).toBe('MUNAIN');
        });
    });

    describe('Join various key into one', () => {
        const m = objmapper([
            {
                key: ['name', 'surname'],
                transform: (name, surname) => `${name} ${surname}`,
                keyout: 'fullname',
            }, {
                key: ['mobile', 'phone'],
                transform: (mobile, phone) => {
                    return {
                        mobile: mobile,
                        home: phone,
                    };
                },
                keyout: 'phones',
            },
        ]);

        it('should apply transformations to new key and remove old ones', () => {
            const res = m(obj);
            expect(res.name).toBeUndefined();
            expect(res.surname).toBeUndefined();
            expect(res.fullname).toBe('Juan Munain');

            expect(res.mobile).toBeUndefined();
            expect(res.home).toBeUndefined();
            expect(res.phones.home).toBe('945667788');
            expect(res.phones.mobile).toBe('655778899');
        });
    });
    describe('Split a property into various properties', () => {
        const m = objmapper([
            {
                key: 'parents',
                transform: (parents) => parents.map((p) => `${p.name} ${p.surname}`),
                keyout: ['father', 'mother'],
            },
        ]);

        it('should apply transformations to new keys and remove old one', () => {
            // parents: [
            //   {
            //     name: 'Martin',
            //     surname: 'Munain',
            //   },
            //   {
            //     name: 'Maitane',
            //     surname: 'Gamiz',
            //   },
            // ],
            const res = m(obj);
            expect(res.parents).toBeUndefined();
            expect(res.father).toBe('Martin Munain');
            expect(res.mother).toBe('Maitane Gamiz');
        });
    });
});
