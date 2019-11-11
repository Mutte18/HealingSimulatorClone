import { shallowMount } from "@vue/test-utils";
import BossInfo from '../BossInfo.vue';
import BossModel from "../BossModel";

let wrapper;

beforeEach(() => {
  wrapper = shallowMount(BossInfo, {
    propsData: {
      bossModel: new BossModel()
    }
  });
});

afterEach(() => {
  wrapper.destroy();
});

test('renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
