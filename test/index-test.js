import assert from 'assert';
import { Stateful } from '../index';
describe('Stateful', () => {
  it('Is a function', function() {
    assert.equal(typeof Stateful, 'function');
  });

  it('light color test', () => {
    function TrafficLight() {
      this.state = new Stateful(this, "stop");
    }

    TrafficLight.States = {
      stop: {
        color: "red",
        time:  8,

        next: function() {
          this.state.transition("go");
        },

        onEnterState: function() {
          // Turn on traffic camera to see who crosses on a red light
        },

        onExitState: function() {
          // Turn off traffic camera
        }
      },

      go: {
        color: "green",
        time:  10,

        next: function() {
          this.state.transition("caution");
        }
      },

      caution: {
        color: "yellow",
        time:  2,

        next:  function() {
          this.state.transition("stop");
        }
      }
    }

    var light = new TrafficLight();
    assert.equal(light.color, 'red')
    light.next()
    assert.equal(light.color, 'green')
    light.next()
    assert.equal(light.color, 'yellow')
    light.next()
    assert.equal(light.color, 'red')
  });
});
