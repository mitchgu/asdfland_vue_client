<template lang="pug">
  div#destindex
    .row#header-row
      .cell.slug Slug(s)
      .cell.dest Destination
      .cell.desc Description
      .cell.created-at Creation Date
      .cell.clicks Clicks
    template(v-for="dest in destList")
      DestListing(:destInfo="dest")
</template>

<script>
import axios from 'axios'
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
        this.$emit('refreshed', this.destList.length)
      }).catch(error => {
        console.log('destindex fail: ' + error.response.data.msg)
      })
    }
  },
  created () {
    this.refreshList()
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
  font-vamily: base-font
  margin: l-space 0
  box-shadow: 0px 0px 5px #0A2309
  border-radius: m-radius
  #header-row
    font-size: m-font-size
    border-bottom: 1px solid primary-color
  .row
    font-size: s-font-size
    display: flex
    flex-direction: horizontal
    .cell
      flex:1
      text-align: center
      padding: 1.5*s-space 0
    border-bottom: 1px solid lighten(blackboard-color, 25%)
    &:hover
      background-color: lighten(blackboard-color, 10%)

</style>
