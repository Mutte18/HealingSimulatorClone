import { shallowMount } from "@vue/test-utils";
import HealthBar from '../HealthBar.vue';

let wrapper;

/*beforeEach(() => {
  wrapper = shallowMount(HealthBar, {
    propsData: {
      healthPoints: 100,
      maxHealth: 100,
      isAlive: true,
      classification: 'TANK'
    }
  });
});*/
function setUpMount(propsData){
  return shallowMount(HealthBar, {
    propsData: {
      ...propsData
    }
  });
}


afterEach(() => {
  wrapper.destroy();
});

test('renders correctly when alive', () => {
  wrapper = setUpMount({
    healthPoints: 100,
    maxHealth: 100,
    isAlive: true,
    classification: 'TANK'
  });
  expect(wrapper).toMatchSnapshot();
});

test('renders correctly when dead', () => {
  wrapper = setUpMount({
    healthPoints: 100,
    maxHealth: 100,
    isAlive: false,
    classification: 'TANK'
  });
  expect(wrapper).toMatchSnapshot();
});

