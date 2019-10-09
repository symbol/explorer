import Vue from 'vue'
import format from './format'

Vue.filter('formatFee', format.formatFee)
Vue.filter('formatTimestamp', format.formatTimestamp)
Vue.filter('formatAddress', format.formatAddress)
Vue.filter('formatAge', format.formatAge)
