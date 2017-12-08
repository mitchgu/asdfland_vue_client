<template lang="pug">
.about
  .about-content
    .brand {{ siteName }}

    :markdown-it
      ## The only URL shortener you'll ever need.
      
      ## **3 link types** for 3 use cases
      
      ### **Random** (like bit.ly)
        * Generates a **short, completely random** link (high entropy) (Ex: `{{ baseUrl }}/wHRbxt`)
        * Good for **maximal shortness**, or making a long link that is astronomically **hard to guess** (effectively private)
        * Best for **sending electronically** in messages, email, documents to reduce clutter
      ### **Readable** (like shoutkey.com)
        * Generates a **readable** link composed of common words (Ex: `{{ baseUrl }}/ankle`)
        * Great for **sharing verbally** for an audience or nearby collaborators
      ### **Custom** (like bit.ly, tinyurl.com)
        * choose a **custom** link (Ex: `{{ baseUrl }}/XYZ.party.signup`)
        * Great for **memorable links** to put in publicity or to reinforce branding
        * Also good for creating a **personal library** of bookmarks that are named memorably (`{{ baseUrl }}/my_resume`, `{{ baseUrl }}/catgifs`)

      ## Endlessly parametrizable links
      Change everything about your link to your liking
      * length
      * word dictionary
      * expiration
      * custom slug
      * password protection
      * analytics

      ## **Live preview** links before creating them
      The link you see is the link you'll get. Tweak it until you like how it looks.

      ## **Manage links** in the dashboard (no account required)
        * **Edit** any existing link's slug or destination
        * **Associate** multiple shortlinks with one destination
        * **Annotate** links with descriptions
        * **Track** link visits over time
      ## **Open source** and **easily self-hostable** on a custom domain
        * Go backend: [https://github.com/mitchgu/asdfland](https://github.com/mitchgu/asdfland)
        * Vue.js frontend: [https://github.com/mitchg/asdfland_vue_client](https://github.com/mitchgu/asdfland_vue_client)
      ## **Ludicrously fast**: powered by **Go** and **Redis**

</template>

<script>
export default {
  name: 'About',
  props: ['siteName'],
  data () {
    return {
      baseUrl: window.location.href
    }
  },
  created () {

  }
}
</script>

<style lang="stylus" scoped>
@require '../assets/settings.styl'
.about
  position: absolute
  top: 0
  right: 0
  left: 0
  overflow: hidden
  background-color: darken(bg-color, 20%)
  z-index: 11
  min-height: 100vh
  .brand 
    font-family: chalk-font
    font-size: brand-font-size
    text-align: center
  .about-content
    max-width: 600px
    margin: 0 auto
    padding: l-space m-space
    color: darken(chalk-color, 10%)
  
  ul
    list-style-type: initial
    margin-left: m-space

</style>