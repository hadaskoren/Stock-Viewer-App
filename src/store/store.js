'use strict';

import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    stocks: [],
    stocksInput: '',
    showData: false,
  },
  mutations: {
    updateInput (state, payload) {
      state.stocksInput = payload;
    },
    updateShowData (state, payload) {
      state.showData = payload;
    },
    addToStocks (state, payload) {
      state.stocks.push(payload);
    }
  },
  actions: {
    updateInput ({commit}, payload) {
      commit('updateInput', payload);
    },
    updateShowData ({commit}, payload) {
      commit('updateShowData', payload);
    },
    addToStocks ({commit}, payload) {
      commit('addToStocks', payload)
    }
  }
})