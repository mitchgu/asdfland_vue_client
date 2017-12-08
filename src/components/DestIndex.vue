<template lang="pug">
  div#destindex
    .row#header-row
      .cell.slug Slug(s)
      .cell.dest Destination
      .cell.desc Description
      .cell.created-at Created
      .cell.clicks Clicks
      .cell.ops Modify
    template(v-for="dest in destList")
      DestListing(:destInfo="dest")
</template>

<script>
import axios from 'axios'
import bus from '../bus.js'
import DestListing from './DestListing.vue'

export default {
  name: 'DestIndex',
  data () {
    return {
      destList: []
    }
  },
  methods: {
    refreshList () {
      axios.get('/api/dest').then(response => {
        if (response.data == null) {
          this.destList = []
        } else {
          this.destList = response.data
        }
        bus.$emit('destindex-refresh', this.destList.length)
      }).catch(error => {
        console.log('destindex fail: ' + error.response.data.msg)
      })
    }
  },
  created () {
    bus.$once('dash-checkin', this.refreshList)
    bus.$on('dash-login', this.refreshList)
    bus.$on('dash-logout', this.refreshList)
    bus.$on('creator-created', this.refreshList)
  },
  components: {
    DestListing
  }
}
</script>

<style lang="stylus">
@import '../assets/settings.styl'

#destindex
  background-color: blackboard-color
  color: chalk-color
  font-family: base-font
  margin: l-space 0
  box-shadow: 0px 0px l-radius darken(blackboard-color, 60%)
  border-radius: m-radius
  #header-row
    font-size: m-font-size
    border-bottom: 1px solid primary-color
  .row
    font-size: s-font-size
    display: flex
    flex-direction: horizontal
    padding: 0 s-space
    .cell
      flex: 3
      text-align: center
      padding: s-space xs-space
    .slug
      flex: 2
    .created-at
      flex: 2
    .clicks
      flex: 1
    .ops
      flex: 1
    // border-bottom: 1px solid lighten(blackboard-color, 25%)
    &:nth-child(even)
      background-color: lighten(blackboard-color, 5%)
    &:hover
      background-color: darken(desaturate(primary-color, 45%), 45%)

</style>
