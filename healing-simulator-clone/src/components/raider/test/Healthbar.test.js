import { shallowMount } from "@vue/test-utils";
import HealthBar from '../HealthBar.vue';

function setUpMount(propsData){
  return shallowMount(HealthBar, {
    propsData: {
      ...propsData
    }
  });
}

test.each([
  [[true, 'TANK']],
  [[false, 'TANK']],
  [[true, 'HEALER']],
  [[true, 'DPS']],
  [[true, 'YOU']]]
)('render healthbar colours correctly based on dead/alive and role', (input) => {
  const wrapper = setUpMount({
    healthPoints: 100,
    maxHealth: 100,
    isAlive: input[0],
    classification: input[1]
  });
  expect(wrapper).toMatchSnapshot();
});

