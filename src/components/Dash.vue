<template lang="pug">
  #dash(:class="{collapsed: collapsed}")
    label#toggle-label(for="toggle", v-text="collapsed? 'Expand' : 'Collapse'")
    input#toggle(v-model="collapsed", type="checkbox", style="display: none")
    #creator-wrap
      #brand {{ siteName }}
      #subtitle A revolutionary weight loss program for obese links
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
    font-family: chalk-font
    color: chalk-color
    font-size: brand-font-size
    text-align: center
    margin-top: l-space
  #subtitle
    text-align: center
    margin-bottom: m-space
    color: darken(chalk-color, 5%)
    font-size: s-font-size

#listing-wrap
  flex: 1
  #listing
    width: 100%
    height: 100vh
    background-color: red

#dash.collapsed
  #creator-wrap
    flex: 1
  #listing-wrap
    flex: 0
  
#toggle-label
  display: inline-block
  position: fixed
  padding: s-space
  border-radius: m-radius
  bottom: s-space
  left: s-space
  background-color: white

</style>