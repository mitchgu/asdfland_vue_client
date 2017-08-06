<template lang="pug">
  #creator
    h1 Destination
    input#dest(type="text", autofocus, v-model="dest")
    h1 Link type
    section#link-type-selector
      a(href="#"
        v-for="lt in linkTypes"
        :class="{active: linkType == lt}"
        @click.prevent="linkType = lt"
        ref="linkTypeToggles") {{ lt }}
    svg#mustache(height="25", width="280", ref="mustacheSVG")
      path(:d="`M${this.coords.underlineLeft} 0 L ${this.coords.underlineRight} 0`", stroke="#4a9e55", fill="transparent", stroke-width="3")
      path(d="M0 25 Q 0 18 20 18", stroke="#4a9e55", stroke-width="2" , fill="transparent")
      path(:d="`M20 18 h ${this.coords.mustacheCenter} l 5 -8 l 5 8 h ${230 - this.coords.mustacheCenter}`", stroke="#4a9e55", stroke-width="2" , fill="transparent")
      path(d="M260 18 Q 280 18 280 25", stroke="#4a9e55", stroke-width="2" , fill="transparent")
    
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
        .panel(ref="build-your-own-panel")
          ul.fields
            li#random-length
              label asdf.land/
              input(type="text", size="18")
    ul.fields
      li#description
        label Description
        input(type="text", size="18", placeholder="Optional")
      li#password
        label Password
        input(type="password", size="18", placeholder="None")
      li#public-stats
        label Stats page
        #stats-radio
          input#disable(type="radio", v-model="stats", value="disable")
          label(for="disable") disable
          input#enable(type="radio", v-model="stats", value="enable")
          label(for="enable") enable

    button#create CREATE
</template>

<script>
var TWEEN = require('@tweenjs/tween.js')

export default {
  name: 'Creator',
  data () {
    return {
      dest: '',
      linkType: 'random',
      linkTypes: [
        'random',
        'readable',
        'build-your-own'
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
      stats: 'enable',
      coords: {
        mustacheCenter: 0,
        underlineLeft: 0,
        underlineRight: 0,
        carouselOffset: 0,
        carouselHeight: 0
      }
    }
  },
  watch: {
    linkType (newType) {
      var coords = this.calcSVGCoords()
      function animate () {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }
      new TWEEN.Tween(this.$data.coords)
        .easing(TWEEN.Easing.Quartic.InOut)
        .to(coords, 500)
        .start()
      animate()
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
        carouselOffset: -320 * index,
        carouselHeight: panel.clientHeight
      }
    }
  },
  computed: {
  },
  mounted () {
    this.coords = this.calcSVGCoords()
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
  padding: s-space m-space
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
    a
      display: inline-block
      text-decoration: none
      color: faded-chalk-color
      padding: xxs-space 0 0
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
    
    #stats-radio
      flex: 6
      display: flex
      label
        @extend .shaded
        flex: 1
        color: chalk-color
        text-align: center
        
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
    background-color: #E6E6E6
    color: darken(primary-color, 25%)
    border: none
    outline: none
    margin: s-space 0 m-space
    border-radius: m-radius
    padding: s-space 0
    letter-spacing: 1px
    font-family: base-font
    font-weight: bold
    transition: background-color .25s, margin .1s, box-shadow .1s
    box-shadow: 0 xs-space #AAAAAA
    
    &:hover
      background-color: chalk-color
      
    &:active
      background-color: primary-color
      color: chalk-color
      box-shadow: 0 xxs-space darken(primary-color, 40%)
      margin: (s-space + xxs-space) 0 (m-space - xxs-space)

</style>