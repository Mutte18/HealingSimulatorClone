import Vue from 'vue';
import Vuex from 'vuex';
import healthPointsTest from './modules/healthPointsTest';

import actions from './actions.js';
import getters from './getters.js';
import mutations from './mutations.js';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    hp: 100
  },
  getters,
  mutations,
  actions,
  modules: {
    healthPointsTest
  }
});
