import Vue from 'vue';
import App from './App.vue';

export const EventBus = new Vue();

document.addEventListener('DOMContentLoaded', () => {
  const el = document.body.appendChild(document.createElement('app'))
  const app = new Vue({
    el,
    render: h => h(App)
  })
});
