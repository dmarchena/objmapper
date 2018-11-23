import arrify from 'arrify';

const pipe = (...fns) => (param) => fns.reduce((res, f) => f(res), param);

const arrifyKeys = (mapping) => {
    const {
        key,
        keyout,
        transform = (val) => val,
    } = mapping;
    const keys = arrify(key);
    return {
        inputs: keys,
        outputs: (keyout !== undefined) ? arrify(keyout) : keys,
        transform,
    };
};

const mappingFunctions = (mapping) => arrify(mapping).map(
    (current) => {
        const {
            inputs,
            outputs,
            transform,
        } = arrifyKeys(current);
        return (obj) => {
            const valuesFrom = inputs.map((k) => {
                const val = obj[k];
                delete obj[k];
                return val;
            });
            const parsedValues = arrify(transform(...valuesFrom));
            parsedValues.map((val, i) => obj[outputs[i]] = val);
            return obj;
        };
    }
);

const objmapper = (mapping) => pipe(
    (obj) => JSON.parse(JSON.stringify(obj)),
    ...mappingFunctions(mapping)
);

export default objmapper;
