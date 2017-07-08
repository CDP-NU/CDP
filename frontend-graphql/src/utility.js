export const eqByKeys = (keys, x, y) => keys
    .every( key => x[key] === y[key] )
