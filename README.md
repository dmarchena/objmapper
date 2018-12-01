# objmapper [![Build Status](https://travis-ci.org/dmarchena/objmapper.svg?branch=master)](https://travis-ci.org/dmarchena/objmapper) [![Test Coverage](https://api.codeclimate.com/v1/badges/64e4b3f27ae478d24a81/test_coverage)](https://codeclimate.com/github/dmarchena/objmapper/test_coverage) [![Maintainability](https://api.codeclimate.com/v1/badges/64e4b3f27ae478d24a81/maintainability)](https://codeclimate.com/github/dmarchena/objmapper/maintainability)
Create a function to transform an object into another one.

## Installation

Via npm:

```sh
npm i -S objmapper
```

## API

### objmapper(transformations)

Returns a function `(object) => transformedObject` which accepts an object as parameter and that will return a new one with the transformations applied.

#### transformations

Type: Object|Object[]

Transformation object format:

```js
{
  key: String|String[],
  transform: Function,
  keyout: String|String[],
}
```

* `key`: Key names to retrieve their values and pass them to transform function or directly to `keyout` (renaming).
* `transform` [optional]: Function to transform the values from specified keys.
* `keyout` [optional]: Keys where store the resulting values.

## Usage

This tool is written in ES2015, so you can import it as a standard module:

```js
import objmapper from 'objmapper';
```

### Renaming

```js
import objmapper from 'objmapper';

const om = objmapper({
  key: ['name', 'surname'],
  keyout: ['fistname', 'lastname'];
});

const result = om({
  name: 'Alice',
  surname: 'Cooper'
}); // { firstname: 'Alice', lastname: 'Cooper' }
```

### Transforming

```js
import objmapper from 'objmapper';

const om = objmapper([{
  key: 'name',
  transform: str => str.toLowerCase(),
}, {
  key: 'surname',
  transform: str => str.toUpperCase(),
}]);

const result = om({
  name: 'Alice',
  surname: 'Cooper'
}); // { name: 'alice', surname: 'COOPER' }
```

### Combining two keys into one

If you declare different `keyout`, original keys will be deleted.

```js
import objmapper from 'objmapper';

const om = objmapper([{
  key: ['name', 'surname'],
  transform: (name, sname) => `${name} ${sname}`,
  keyout: 'fullname',
}]);

const result = om({
  name: 'Alice',
  surname: 'Cooper'
}); // { fullname: 'Alice Cooper' }
```

## License

MIT © [David Marchena](https://github.com/dmarchena)
