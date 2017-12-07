<template lang="pug">
  div#app
    router-view
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="stylus">
@import 'assets/settings.styl'

#app 
  min-height: 100vh
  overflow: hidden
  background-color: bg-color
  font-family: base-font
  
ul
  list-style-type: none
  margin: 0
  padding: 0
  
a, a:visited
  text-decoration: none
  color: darken(chalk-color, 25%)
a:hover
  text-decoration: none
  color: chalk-color
  
input, select, option
  &:focus
    outline: none
</style>
