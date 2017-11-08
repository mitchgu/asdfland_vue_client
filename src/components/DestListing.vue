<template lang="pug">
  .destlisting.row
    .cell.slug
      p(v-for="slug in destInfo.Slugs") /{{ slug.Slug }}
    .cell.dest
      a(:href="destInfo.Dest") {{ destInfo.Dest }}
    .cell.desc {{ destInfo.Description }}
    .cell.created-at {{ createdAtReadable }}
    .cell.clicks 0
</template>

<script>
export default {
  name: 'DestListing',
  props: ['destInfo'],
  computed: {
    createdAtReadable () {
      var d = new Date(this.destInfo.CreatedAt)
      return d.toLocaleString()
    }
  }
}
</script>

<style lang="stylus">
@import '../assets/settings.styl'

.slug p
  padding: 0
  margin: 0
  
.dest a
  color: primary-color

</style>
