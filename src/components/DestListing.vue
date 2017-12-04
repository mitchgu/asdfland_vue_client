<template lang="pug">
  .destlisting.row
    .cell.slug
      .slug-entries
        .slug-entry(v-for="slug in destInfo.Slugs")
          span /
          input(:value="slug.Slug")
          .slug-delete
            i.material-icons delete
        .slug-entry(v-if="addSlug")
          span /
          input(placeholder="new slug")
          .slug-create
            i.material-icons check
      .slug-add(@click="addSlug = !addSlug")
        i.material-icons(v-if="!addSlug") add_circle
        i.material-icons(v-else) remove_circle
    .cell.dest
      input(:value="destInfo.Dest")
    .cell.desc
      input(:value="destInfo.Description")
    .cell.created-at
      span {{ createdAtReadable }}
    .cell.clicks
      span 0
    .cell.ops
      div.dest-edit
        a(:href="destInfo.Dest" target="_blank")
          i.material-icons open_in_new
      div.dest-open
        i.material-icons edit
      div.dest-delete
        i.material-icons delete

</template>

<script>
import moment from 'moment'
export default {
  name: 'DestListing',
  props: ['destInfo'],
  data () {
    return {
      addSlug: false
    }
  },
  computed: {
    createdAtReadable () {
      var d = moment(this.destInfo.CreatedAt)
      return d.fromNow()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../assets/settings.styl'

.slug, .ops
  display: flex
  flex-direction: row
 
.slug-entries
  flex: 6 
.slug-add
  flex: 1  

.ops div
  flex: 1
  
.slug-entry
  display: flex
  flex-direction: row
  input
    flex: 5
  .slug-delete
    border-bottom: 1px solid faded-chalk-color
    flex: 1
  .slug-create
    border-bottom: 1px solid faded-chalk-color
    flex: 1

i 
  color: faded-chalk-color
  font-size: m-font-size
  cursor: pointer
  &:hover
    color: chalk-color
  
input
  background-color: transparent
  border: none
  box-shadow: none
  font-family: base-font
  color: chalk-color
  text-align: center
  border-bottom: 1px solid faded-chalk-color
  width: 95%
  
input, span
  display: inline-block
  padding: 2px 0

.cell
  padding: s-space 0
  

</style>
