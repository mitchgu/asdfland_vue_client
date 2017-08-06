<template lang="pug">
  #dash(:class="{collapsed: collapsed}")
    #toggle-div
      label collapsed
      input#toggle(v-model="collapsed",type="checkbox")
    #creator-wrap
      #brand {{ siteName }}
      creator
    #listing-wrap
      #listing
</template>

<script>
import Creator from './Creator.vue'
import CONST from '../constants.js'

export default {
  name: 'Dash',
  data () {
    return {
      collapsed: true,
      siteName: CONST.siteName
    }
  },
  methods: {
  },
  components: {
    Creator
  }
}
</script>

<style lang="stylus" scoped>
@require '../assets/settings.styl'

#dash
  display: flex
  margin: 0 auto
  max-width: dash-max-width

#creator-wrap, #listing-wrap
  transition: flex 1s

#creator-wrap
  flex: 0
  padding: 0 m-space
  #brand
    display: block
    font-family: chalk-font
    color: chalk-color
    font-size: brand-font-size
    text-align: center
    margin-top: l-space
    margin-bottom: s-space

#listing-wrap
  flex: 1
  #listing
    width: 100%
    height: 120vh
    background-color: red

#dash.collapsed
  #creator-wrap
    flex: 1
  #listing-wrap
    flex: 0
  
#toggle-div
  position: fixed
  padding: 10px
  bottom: 0
  left: 0
  background-color: white

</style>