import Vue from 'vue'

const app=Vue.extend(require("./app.vue"))

new app({
    el: '#app'
})