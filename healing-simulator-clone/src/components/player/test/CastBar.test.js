import {createLocalVue, shallowMount} from "@vue/test-utils";
import CastBar from '../CastBar';
import Vue from 'vue';

const EventBus = new Vue();

const GlobalPlugins = {
  install(v) {
    // Event bus
    v.prototype.$bus = EventBus;
  },
};

// create a local instance of the global bus
const localVue = createLocalVue();
localVue.use(GlobalPlugins);

let wrapper;

let spellObject = {
};

beforeEach(() => {
  wrapper = shallowMount(CastBar, {
    localVue,
    data() {
      return {
        isCasting: false,
      }
    }
  });
});

afterEach(() => {
  wrapper.destroy();
});

test('renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('starts spellCast on event received', () => {
  const startSpellCast = jest.fn();
  wrapper.vm.setMethods(startSpellCast);
  wrapper.vm.startSpellCast(1000);
  expect(wrapper.vm.startSpellCast).toBeCalled();

  wrapper.vm.$emit('startSpellCast');
  /*wrapper.vm.$bus.$emit('startSpellCast');
  const kalle = expect(wrapper.vm.$bus.emitted('startSpellCast').toBeTruthy());*/
  let peter = "hej";
})
