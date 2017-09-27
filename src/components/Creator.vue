<template lang="pug">
  #creator(:class="{collapsed: collapsed}")
    input#dest(type="text", autofocus, v-model="dest", placeholder="paste your link here")
    section#link-type-selector
      span Link type:
      a(href="#"
        v-for="lt in linkTypes"
        :class="{active: linkType == lt}"
        @click.prevent="linkType = lt"
        ref="linkTypeToggles") {{ lt }}
    svg#mustache(height="18", width="300", ref="mustacheSVG")
      path(:d="`M${this.coords.underlineLeft} 0 L ${this.coords.underlineRight} 0`", stroke="#4a9e55", fill="transparent", stroke-width="3")
      path(d="M0 18 Q 5 13 20 13", stroke="#4a9e55", stroke-width="2" , fill="transparent")
      path(:d="`M20 13 h ${this.coords.mustacheCenter} l 5 -5 l 5 5 h ${250 - this.coords.mustacheCenter}`", stroke="#4a9e55", stroke-width="2" , fill="transparent")
      path(d="M280 13 Q 295 13 300 18", stroke="#4a9e55", stroke-width="2" , fill="transparent")
    
    #carousel-wrap(:style="{height: coords.carouselHeight + 'px'}")
      section#carousel(:style="{marginLeft: coords.carouselOffset + 'px', height: coords.carouselHeight + 'px'}")
        .panel(ref="random-panel")
          ul.fields
            li#random-length
              label Length
              input(type="range", min=4, max=32, v-model="randomLength")
              span.readout(v-text="randomLength")
        .panel(ref="readable-panel")
          ul.fields
            li#random-length
              label Dictionary
              select(v-model="dictionary")
                option(v-for="(dictvalue, dictkey) in dictionaries"
                       :value="dictkey") {{ dictvalue }}
            li#random-length
              label # Words
              input(type="range", min=1, max=5, v-model="readableWords")
              span.readout(v-text="readableWords")
            li#expiry
              label Expires in
              select(v-model="expires")
                option(v-for="(expirevalue, expirekey) in expireOptions"
                       :value="expirekey") {{ expirevalue }}
        .panel(ref="custom-panel")
          ul.fields
            li#random-length
              label asdf.land/
              input(type="text", v-model="customSlug", size="18")

    a#options-toggle(@click="collapsed = !collapsed"
                     v-text="`${collapsed ? '> show' : '- hide'} more options`")
    #options
      ul.fields
        li#description
          label Description
          input(type="text", v-model="description", size="18", placeholder="None")
        li#password
          label Password
          input(type="password", v-model="password", size="18", placeholder="None")
        li#public-analytics
          label Link analytics
          #analytics-radio
            input#disable(type="radio", v-model="analytics", value="disable")
            label(for="disable") disable
            input#enable(type="radio", v-model="analytics", value="enable")
            label(for="enable") enable

    button#create(@click="showLog = !showLog;") create shortlink

    textarea#log(:class="{'show-log': showLog}", v-text="log")
</template>

<script>
var TWEEN = require('@tweenjs/tween.js')

export default {
  name: 'Creator',
  data () {
    return {
      dest: '',
      collapsed: true,
      linkType: 'random',
      linkTypes: [
        'random',
        'readable',
        'custom'
      ],
      randomLength: 8,
      readableWords: 2,
      dictionaries: {
        hitchiker: 'Hitchiker\'s Guide',
        astronomy: 'Astronomy',
        elements: 'Elements',
        animals: 'Animals',
        countries: 'Countries',
        bands: 'Band names'
      },
      dictionary: 'hitchiker',
      analytics: 'enable',
      expires: '5',
      expireOptions: {
        '5': '5 minutes',
        '30': '30 minutes',
        '60': '1 hour',
        '360': '6 hours',
        '1440': '1 day'
      },
      customSlug: '',
      description: '',
      password: '',
      coords: {
        mustacheCenter: 0,
        underlineLeft: 0,
        underlineRight: 0,
        carouselOffset: 0,
        carouselHeight: 0
      },
      log: '',
      showLog: false,
      mountTime: new Date()
    }
  },
  watch: {
    linkType (newType, oldType) {
      this.logStateChange('linkType', oldType, newType)
      var coords = this.calcSVGCoords()
      function animate () {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }
      new TWEEN.Tween(this.$data.coords)
        .easing(TWEEN.Easing.Quartic.InOut)
        .to(coords, 400)
        .start()
      animate()
    },
    dest (newState, oldState) {
      this.logStateChange('dest', oldState, newState)
    },
    randomLength (newState, oldState) {
      this.logStateChange('randomLength', oldState, newState)
    },
    readableWords (newState, oldState) {
      this.logStateChange('readableWords', oldState, newState)
    },
    dictionary (newState, oldState) {
      this.logStateChange('dictionary', oldState, newState)
    },
    analytics (newState, oldState) {
      this.logStateChange('analytics', oldState, newState)
    },
    expires (newState, oldState) {
      this.logStateChange('expires', oldState, newState)
    },
    customSlug (newState, oldState) {
      this.logStateChange('customSlug', oldState, newState)
    },
    description (newState, oldState) {
      this.logStateChange('description', oldState, newState)
    },
    password (newState, oldState) {
      this.logStateChange('password', oldState, newState)
    }
  },
  methods: {
    calcSVGCoords () {
      var index = this.linkTypes.indexOf(this.linkType)
      var toggle = this.$refs.linkTypeToggles[index]
      var panel = this.$refs[this.linkType + '-panel']
      var svg = this.$refs.mustacheSVG
      var toggleBounds = toggle.getBoundingClientRect()
      var svgBounds = svg.getBoundingClientRect()
      var toggleCenter = (toggleBounds.left + toggleBounds.right) / 2.0
      return {
        mustacheCenter: toggleCenter - svgBounds.left - 25,
        underlineLeft: toggleBounds.left - svgBounds.left,
        underlineRight: toggleBounds.right - svgBounds.left,
        carouselOffset: -340 * index,
        carouselHeight: panel.clientHeight
      }
    },
    logStateChange (name, oldState, newState) {
      var now = new Date()
      var dt = Math.round((now - this.mountTime) / 100) / 10.0
      this.log += `T${dt}: '${name}' changed from '${oldState}' to '${newState}'\n`
    }
  },
  computed: {
  },
  mounted () {
    this.coords = this.calcSVGCoords()
    var now = new Date()
    this.mountTime = now
    this.log = 'T0.0: mounted\n'
  }
}
</script>

<style lang="stylus" scoped>
@require '../assets/settings.styl'

.shaded
  background-color: shaded-color

#creator
  width: creator-width
  margin: 0 auto
  padding: 1.5*m-space
  display: flex
  flex-direction: column
  box-shadow: 0px 0px 5px #0A2309
  border-radius: m-radius
  background-color: blackboard-color
  color: chalk-color
  font-family: base-font
  
  h1 
    font-size: l-font-size
    font-weight: normal
    text-transform: uppercase
    text-align: center
    margin: m-space 0 s-space
    
  #dest
    font-size: m-font-size
    padding: s-space
    border-radius: m-radius
    
  #options-toggle
    cursor: pointer
    padding: s-space 0 s-space;
    color: faded-chalk-color
    font-size: s-font-size
    
  #options
    overflow: hidden
    transition: max-height .4s
    max-height: 130px
    margin-top: - xs-space
    >h1 
      margin-bottom: xs-space

  &.collapsed #options
    max-height: 0px
    
  input[type="text"], input[type="password"]
    @extend .shaded
    border: none
    border-bottom: 2px solid darken(primary-color, 25%)
    color: chalk-color
    font-family: base-font
    text-align: center
    &::placeholder
      color: faded-chalk-color
    
  #link-type-selector
    display: flex
    justify-content: space-between
    margin-top: s-space
    margin-bottom: -1px
    a, span
      display: inline-block
      padding: xs-space 0 0
    a
      text-decoration: none
      color: faded-chalk-color
      transition: color .7s
      &.active
        color: primary-color
    
  .fields
    li 
      margin: s-space 0
      display: flex
    label
      font-size: m-font-size
      display: inline-block
      padding: xs-space 0
      flex: 4
    input[type="range"]
      padding: xs-space s-space
      flex: 5
      background: transparent
      -webkit-appearance: none
      border: none
      
      thumb()
        background-color: primary-color
        width: m-font-size
        height: m-font-size
        border-radius: (m-font-size/2)
        cursor: pointer
        margin-top: -8px
        box-shadow: none
        border: none
        
      track()
        width: 100%
        cursor: pointer
        height: 2px
        background-color: chalk-color
        margin-right: xs-space
        margin-bottom: 1px
      
      &::-webkit-slider-thumb
        -webkit-appearance: none
        thumb()
      
      &::-moz-range-thumb
        -moz-appearance: none
        thumb()
        
      &::-ms-thumb
        thumb()
        margin-top: 0
      
      &::-webkit-slider-runnable-track
        track()
      
      &::-moz-range-track
        -moz-appearance: none
        track()
        
      &::-ms-track
        track()
        background: transparent;
        border-color: transparent
        color: transparent
        
      &::-ms-fill-lower
        background-color: chalk-color
        
      &::-ms-fill-upper
        background-color: chalk-color

    select
      @extend .shaded
      -webkit-appearance: none
      -moz-appearance: none
      flex: 6
      border: 0
      border-radius: 0
      color: chalk-color
      font-family: base-font
      text-align-last: center
      
    #random-length .readout
      @extend .shaded
      display: inline-block
      flex: 1
      border-radius: s-radius
      padding: xs-space 0
      text-align: center
      
    input[type="text"], input[type="password"]
      flex: 6
    
    #analytics-radio
      flex: 6
      display: flex
      label
        @extend .shaded
        flex: 1
        color: chalk-color
        text-align: center
        font-size: s-font-size
        line-height: m-space
        
      input[type="radio"]:checked + label
        background-color: primary-color

      input[type="radio"]
        display: none       
      
  #carousel-wrap
    height: min-content
    margin-bottom: - s-space
    overflow-x: hidden
    
  #carousel
    display: block
    width: 3*creator-width + 4*m-space
    overflow: hidden
    .panel
      float: left
      li
        width: creator-width
      &:not(:first-child)
        margin-left: 2*m-space
    
  #create
    font-size: m-font-size
    background-color: chalk-color
    color: darken(primary-color, 25%)
    border: none
    outline: none
    margin: s-space 0 0
    border-radius: m-radius
    padding: s-space 0
    letter-spacing: 1px
    font-family: base-font
    font-weight: bold
    transition: background-color .25s, margin .1s, box-shadow .1s
    box-shadow: 0 xs-space #AAAAAA
    
    &:hover
      background-color: #FFF
      
    &:active
      background-color: primary-color
      color: chalk-color
      box-shadow: 0 (xs-space - xxs-space) darken(primary-color, 40%)
      margin: (s-space + xxs-space) 0 ( - xxs-space)

  #log
    display: none
    position: fixed
    left: 0
    right: 0
    bottom: 0
    height: 15vh
    padding: m-space
    margin: 0
    background-color: #333
    // overflow: scroll
    width: 100vw
    border: none
    font-size: s-font-size
    font-family: monospace
    color: chalk-color
    
  #log.show-log
    display: block

</style>