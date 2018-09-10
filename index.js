export function selectorize(fn) {
	let prevValue;
  const caches = [],
  	createHandler = i => ({
      get(target, property) {
        caches[i][property] = target[property];
        return target[property];
      },
      set() { throw new Error('Selectors should be immutable'); }
    });
	return function memo() {
  	let changed = false;
  	for (let i = 0; i < arguments.length; i += 1) {
    	if (arguments[i] instanceof Object) {
        let keys = (caches[i] && Object.keys(caches[i])) || [];
          changed = changed || !keys.length;
        for (let j = 0; j < keys.length; j += 1) {
          const key = keys[j];
          if (caches[i][key] !== arguments[i][key]) {
            changed = true;
            break;
          }
        }
      } else if (caches[i] !== arguments[i]) changed = true;
      if (changed) break;
    }
    if (!changed) return prevValue;
    const args = [];
    for (i = 0; i < arguments.length; i += 1) {
    	if (arguments[i] instanceof Object) {
    		args.push(new Proxy(arguments[i], createHandler(i)));
      	caches[i] = {}
      } else args.push(caches[i] = arguments[i]);
    }
  	return prevValue = fn.apply(this, args);
  }
}
