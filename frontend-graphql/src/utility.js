export const eqByKeys = (keys, x, y) => keys
    .every( key => x[key] === y[key] )

export function shallowEqual(x, y) {
    
    const xKeys = Object.keys(x)
    const yKeys = Object.keys(y)

    return xKeys.length === yKeys.length &&
	   xKeys.every( key => x[key] === y[key] )
}
