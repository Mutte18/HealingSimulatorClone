import * as types from '../types';

const state = {
  hp: 100
};

const getters = {
  [types.HP]: state => {
    return state.hp;
  }
};

const mutations = {
  [types.MUTATE_INCREASE_HP]:
    (state, payload) => {
    state.hp += payload;
  },
  [types.MUTATE_DECREASE_HP]:
    (state, payload) => {
      state.hp -= payload;
    },
};

const actions = {
  [types.INCREASE_HP]:
    ({ commit }, payload) => {
    commit(types.MUTATE_INCREASE_HP, payload);
  },
  [types.DECREASE_HP]:
    ({ commit }, payload) => {
      commit(types.MUTATE_DECREASE_HP, payload);
      },

};

export default {
  state,
  mutations,
  actions,
  getters
}
