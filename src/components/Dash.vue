<template lang="pug">
  #dash(:class="{collapsed: collapsed}")
    #creator-wrap
      header#dash-head
        #brand {{ siteName }}
        #tagline {{ siteTagline }}
        #user
          p 
            span Welcome, {{ username }}. 
            span(v-if="!isRegistered")
              a(href="#" @click.prevent="showLOS('login')") Log in
              |  or 
              a(href="#" @click.prevent="showLOS('signup')") sign up
              |  to manage links 
            span(v-if="isRegistered")
              a(href="#" @click.prevent="logout") Logout
          form#los(v-if="showLoginOrSignup")
            .wide
              input#username(type="text", v-model="LOSUsername", placeholder="username")
            .wide
              input#password(type="password", v-model="LOSPassword", placeholder="password")
            .slim
              button#los-btn(@click.prevent="submitLOS") {{ loginOrSignup }}
            .slim
              a(href="#")
                i.material-icons(@click="showLoginOrSignup=false") close
      creator(ref="Creator", @new="refreshDestIndex")
      about(:site-name="siteName", v-if="showAbout")
      .about-close(v-if="showAbout")
        a(href="#" @click.prevent="showAbout = false")
          i.material-icons close
      p.about-link
        a(href="#" @click.prevent="showAbout = true") what is this?
    #destindex-wrap
      DestIndex#destindex(ref="DestIndex", @refreshed="numDests = Number($event)")
</template>

<script>
import About from './About.vue'
import axios from 'axios'
import Creator from './Creator.vue'
import DestIndex from './DestIndex.vue'

export default {
  name: 'Dash',
  data () {
    return {
      numDests: 0,
      siteName: '',
      siteTagline: '',
      username: 'guest',
      isRegistered: false,
      showLoginOrSignup: false,
      loginOrSignup: 'login',
      LOSUsername: '',
      LOSPassword: '',
      showAbout: false
    }
  },
  methods: {
    showLOS (which) {
      this.showLoginOrSignup = true
      this.loginOrSignup = which
    },
    submitLOS () {
      var reqBody = {
        Username: this.LOSUsername,
        Password: this.LOSPassword
      }
      if (this.loginOrSignup === 'login') {
        axios.post('/api/user/login', reqBody).then(response => {
          if (response.data.success === 'true') {
            this.username = reqBody.Username
            this.isRegistered = true
            this.showLoginOrSignup = false
            this.LOSUsername = ''
            this.LOSPassword = ''
            this.$refs.Creator.reserveSlug()
            this.refreshDestIndex()
          } else console.log('login fail')
        }).catch(error => {
          console.log('login fail ' + error.response.data.msg + '\n')
        })
      } else if (this.loginOrSignup === 'signup') {
        axios.post('/api/user/create', reqBody).then(response => {
          this.username = reqBody.Username
          this.isRegistered = true
          this.showLoginOrSignup = false
          this.LOSUsername = ''
          this.LOSPassword = ''
          this.$refs.Creator.reserveSlug()
          this.refreshDestIndex()
        }).catch(error => {
          console.log('login fail ' + error.response.data.msg + '\n')
        })
      }
    },
    logout () {
      axios.get('/api/user/logout').then(response => {
        this.username = 'guest'
        this.isRegistered = false
        this.$refs.Creator.reserveSlug()
        this.refreshDestIndex()
      }).catch(error => {
        console.log('logout fail ' + error.response.data.msg + '\n')
      })
    },
    refreshDestIndex () {
      this.$refs.DestIndex.refreshList()
    }
  },
  created () {
    axios.get('/api/checkin').then(response => {
      this.siteName = response.data.site_name
      this.siteTagline = response.data.site_tagline
      this.username = (response.data.is_registered === 'true')
        ? response.data.username : 'guest'
      this.isRegistered = response.data.is_registered === 'true'
      bus.$emit('dash-checkin')
    }).catch(error => {
      console.log('session info fail ' + error.response.data.msg + '\n')
    })
  },
  computed: {
    collapsed () {
      return !(this.isRegistered || (this.numDests > 0))
    }
  },
  components: {
    Creator,
    DestIndex,
    About
  }
}
</script>

<style lang="stylus">
@require '../assets/settings.styl'

#dash
  display: flex
  margin: 0 auto
  max-width: dash-max-width

#creator-wrap, #destindex-wrap
  transition: flex 1s

#creator-wrap
  flex: 0
  padding: 0 m-space
  #dash-head
    color: chalk-color
    text-align: center
  #brand
    font-family: chalk-font
    font-size: brand-font-size
    margin-top: l-space
  #tagline
    color: darken(chalk-color, 5%)
    font-size: s-font-size
  #los
    margin: 0 auto
    max-width: creator-width
    display: flex
    input
      background-color: transparent
      border: none
      border-bottom: 1px solid faded-chalk-color
      width: 85%
      color: chalk-color
      padding: xs-space
      &::placeholder
        color: faded-chalk-color
    button
      background-color: darken(primary-color, 70%)
      border: none
      border-radius: 0
      padding: xs-space
      color: chalk-color
    .wide
      flex: 3
    .slim
      flex: 1
  #user
    margin: m-space 0
    font-size: s-font-size
    a, a:visited
      color: lighten(primary-color, 20%)
      text-decoration: none
    a:hover
      text-decoration: underline
    
#destindex-wrap
  flex: 1
  padding: 0 m-space
  overflow: hidden
  opacity: 1
  transition: opacity 1s

#dash.collapsed
  #creator-wrap
    flex: 1
  #destindex-wrap
    opacity: 0
    flex: 0
    
.about-link
  margin-top: m-space
  text-align: center
  
.about-close
  z-index: 12
  position: fixed
  top: 0
  right: 0
  padding-top: m-space
  padding-right: m-space
  i
    font-size: brand-font-size
    
@media (max-width: 1000px)
  #dash
    flex-direction: column
    
@media (max-width: 650px)
  #destindex
    .created-at, .clicks
      display: none
    
@media (max-width: 450px)
  #destindex
    .desc
      display: none

</style>