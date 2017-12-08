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
      path(d="M0 18 Q 5 13 20 13", stroke="#4a9e55", stroke-width="2" , fill="transparent")
      path(:d="`M20 13 h ${this.coords.mustacheCenter} l 5 -8 l 5 8 h ${250 - this.coords.mustacheCenter}`", stroke="#4a9e55", stroke-width="2" , fill="transparent")
      path(d="M280 13 Q 295 13 300 18", stroke="#4a9e55", stroke-width="2" , fill="transparent")
    
    #carousel-wrap(:style="{height: coords.carouselHeight + 'px'}")
      section#carousel(:style="{marginLeft: coords.carouselOffset + 'px', height: coords.carouselHeight + 'px'}")
        .panel(ref="random-panel")
          ul.fields
            li#random-length
              label Length
              input(type="range", min=6, max=18, v-model="randomLength")
              span.readout(v-text="randomLength")
        .panel(ref="readable-panel")
          ul.fields
            li#random-length
              label Wordlist
              select(v-model="wordlist")
                option(v-for="(wlcaption, wlname) in wordlists"
                       :value="wlname") {{ wlcaption }}
            li#random-length
              label # Words
              input(type="range", min=1, max=6, v-model="readableWords")
              span.readout(v-text="readableWords")
            li#expiry
              label Expires in
              select(v-model="expires")
                option(v-for="(expirevalue, expirekey) in expireOptions"
                       :value="expirekey") {{ expirevalue }}
        .panel(ref="custom-panel")
          ul.fields
            li#random-length
              label {{ this.URLBASE }}
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
            input#disable(type="radio", v-model="analytics", value="false")
            label(for="disable") disable
            input#enable(type="radio", v-model="analytics", value="true")
            label(for="enable") enable

    #preview-wrap(:class="[reserveState]")
      label link preview
      input#preview(type="text", :value="linkPreview", placeholder="link preview")
      i.material-icons(@click="reserveSlug" v-if="linkType != 'custom'") autorenew

    button#create(@click="createSlugDest") create shortlink
</template>

<script>
var TWEEN = require('@tweenjs/tween.js')
import _ from 'lodash'
import axios from 'axios'
import bus from '../bus.js'

export default {
  name: 'Creator',
  data () {
    return {
      dest: '',
      previewSlug: '',
      collapsed: true,
      linkType: 'random',
      linkTypes: [
        'random',
        'readable',
        'custom'
      ],
      randomLength: 6,
      readableWords: 1,
      wordlists: {
        eff_short_1: 'EFF (short)',
        eff_short_2: 'EFF (medium)',
        eff_large: 'EFF (large)',
        pgp: 'PGP word list'
      },
      wordlist: 'eff_short_1',
      customSlug: '',
      description: '',
      password: '',
      analytics: 'true',
      expires: '0',
      reserveState: 'DEBOUNCING',
      expireOptions: {
        '0': 'Never',
        '5': '5 minutes',
        '30': '30 minutes',
        '60': '1 hour',
        '360': '6 hours',
        '1440': '1 day'
      },
      coords: {
        mustacheCenter: 0,
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
      new TWEEN.Tween(this.coords)
        .easing(TWEEN.Easing.Quartic.InOut)
        .to(coords, 400)
        .start()
      animate()
      if (newType === 'custom' && this.customSlug === '') {
        this.customSlug = this.previewSlug
      }
      this.reserveSlug()
    },
    randomLength (newVal) { this.reserveState = 'DEBOUNCING'; this.reserveSlugDebounced() },
    readableWords (newVal) { this.reserveState = 'DEBOUNCING'; this.reserveSlugDebounced() },
    wordlist (newVal) { this.reserveSlug() },
    customSlug (newVal) { this.reserveState = 'DEBOUNCING'; this.reserveSlugDebounced() }
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
        carouselOffset: -340 * index,
        carouselHeight: panel.clientHeight
      }
    },
    reserveSlugDebounced: _.debounce(function () { this.reserveSlug() }, 250),
    reserveSlug () {
      this.reserveState = 'RESERVING'
      var reqBody = {Type: this.linkType}
      switch (this.linkType) {
        case 'random':
          reqBody.Length = Number(this.randomLength)
          break
        case 'readable':
          reqBody.Length = Number(this.readableWords)
          reqBody.Wordlist = this.wordlist
          break
        case 'custom':
          reqBody.CustomSlug = this.customSlug
          break
      }
      axios.post('/api/slug/reserve', reqBody).then(response => {
        this.previewSlug = response.data.slug
        this.reserveState = 'RESERVED'
      }).catch(error => {
        console.log(error)
        if (this.linkType === 'custom') this.previewSlug = this.customSlug
        this.reserveState = 'UNAVAILABLE'
      })
    },
    createSlugDest () {
      if (this.dest === '' || this.linkPreview === '') {
        // display a warning message
        return
      }
      var reqBody = {
        Slug: this.previewSlug,
        Dest: this.dest,
        Expire: Number(this.expires),
        Description: this.description,
        Password: this.password,
        EnableAnalytics: this.analytics === 'true'
      }
      axios.post('/api/slugdest', reqBody).then(response => {
        this.dest = ''
        if (this.linkType !== 'custom') this.reserveSlug()
        bus.$emit('creator-created')
      }).catch(error => {
        console.log(error)
        // display an error message
      })
    }
  },
  computed: {
    linkPreview () { return this.URLBASE + this.previewSlug }
  },
  mounted () {
    this.coords = this.calcSVGCoords()
  },
  created () {
    this.URLBASE = window.location.href.replace(/https?:\/\//, '')
    bus.$once('dash-checkin', this.reserveSlug)
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
  box-shadow: 0px 0px l-radius darken(blackboard-color, 60%)
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
    
  #dest, #preview
    font-size: m-font-size
    padding: s-space
    border-radius: m-radius
  
  #preview-wrap
    margin: s-space 0
    width: 100%
    display: flex
    flex-direction: column
    position: relative
    label
      content: "link preview"
      display: block
      text-align: center
      background-color: darken(primary-color, 25%)
      border-radius: m-radius m-radius 0 0
      padding: xs-space 0 s-space
      margin-bottom: - m-radius
      transition: background-color .3s
    #preview
      flex: 1
      border-radius: 0 0 m-radius m-radius
      font-size: s-font-size
      transition: border .2s
    i
      display: inline-block
      position: absolute
      right: xs-space
      bottom: xs-space*1.5
      cursor: pointer
      z-index: 1
      color: chalk-color
      transition: color 0.2s
      &:hover
        color: darken(chalk-color, 20%)
      &:active
        color: primary-color
    &.DEBOUNCING
      label
        background-color: desaturate(darken(primary-color, 25%), 100%)
      #preview
        border-bottom: 2px solid desaturate(darken(primary-color, 25%), 100%)
    &.RESERVING
      label
        background-color: desaturate(darken(primary-color, 25%), 50%)
      #preview
        border-bottom: 2px solid desaturate(darken(primary-color, 25%), 50%)
    &.UNAVAILABLE
      label
        background-color: darken(red, 25%)
      #preview
        border-bottom: 2px solid darken(red, 25%)
    
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
    margin-top: m-space
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
    margin: s-space*1.5 0 m-space
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

  #created-pile
    margin: m-space 0 0 
    height: 150px
    background-color: lighten(blackboard-color, 10%)
    color: chalk-color
    font-family: monospace
    font-size: s-font-size*0.8
    padding: s-space
    overflow: scroll

</style>