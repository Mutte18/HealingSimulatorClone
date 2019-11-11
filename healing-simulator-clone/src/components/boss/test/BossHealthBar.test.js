import { shallowMount } from "@vue/test-utils";
import BossHealthBar from '../BossHealthBar.vue';

let wrapper;

beforeEach(() => {
  wrapper = shallowMount(BossHealthBar, {
    propsData: {
      healthPoints: 100,
      maxHealth: 100,
      bossName: 'test'
    }
  });
});

afterEach(() => {
  wrapper.destroy();
});

test('renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
