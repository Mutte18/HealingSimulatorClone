import { shallowMount } from "@vue/test-utils";
import BossHealthBar from '../BossHealthBar.vue';

const factory = (propsData) => {
  return shallowMount(BossHealthBar, {
    propsData: {
      maxHealth: 100,
      bossName: 'test',
      ...propsData
    }
  })
};



test('renders correctly', () => {
  const wrapper = factory({
    healthPoints: 100,
  });
  expect(wrapper).toMatchSnapshot();
});

test('getHealthPointStyle with 0 hp', () => {
  const wrapper = factory({
    healthPoints: 0,
  });
  expect(wrapper).toMatchSnapshot();
})
