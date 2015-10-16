
// from https://gist.github.com/foca/3462441

//* @class */
export function Stateful(object, initialState, interfaces, onInitialize) {
  let currentState;
  this.interfaces = interfaces = interfaces || object.constructor.States;

  if (typeof interfaces == 'undefined') {
    throw 'An object with the set of interfaces for each state is required';
  }

  function trigger() {
    if (typeof object.trigger == 'function') {
      object.trigger.apply(object, arguments);
    }
  }

  function applyState(state) {
    let previousInterface = interfaces[currentState];
    let newInterface = interfaces[state];

    if (typeof newInterface == 'undefined') {
      throw 'Invalid state: ' + state;
    }

    if (previousInterface) {
      trigger('state:exit', currentState);

      if (typeof previousInterface.onExitState == 'function') {
        object.onExitState();
      }
      var property;
      for (property in previousInterface) {
        delete object[property];
      }
      delete object.onEnterState;
      delete object.onExitState;

      trigger('state:exited', currentState);
    }

    trigger('state:enter', state);

    for (let newProperty in newInterface) {
      object[newProperty] = newInterface[newProperty];
    }

    if (typeof newInterface.onEnterState == 'function') {
      object.onEnterState();
    }

    trigger('state:entered', state);
  }

  function transitionTo(state) {
    applyState(state);
    currentState = state;
    trigger('state:change');
  }

  function isCurrentState(state) {
    // console.log(currentState);
    return currentState === state;
  }

  if (typeof onInitialize == 'function') {
    onInitialize(this, object);
  }

  transitionTo(initialState || 'default');

  return {
    is: isCurrentState,
    transition: transitionTo
  };
}
