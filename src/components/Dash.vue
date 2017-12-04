<template lang="pug">
  #dash(:class="{collapsed: collapsed}")
    #creator-wrap
      header#dash-head
        #brand {{ siteName }}
        #subtitle A revolutionary weight loss program for obese links
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
            form#hi(v-if="showLoginOrSignup")
              input#username(type="text", v-model="LOSUsername", placeholder="username")
              input#password(type="password", v-model="LOSPassword", placeholder="password")
              button#los-btn(@click.prevent="submitLOS") {{ loginOrSignup }}
              a(href="#")
                i.material-icons(@click="showLoginOrSignup=false") close
      creator(ref="Creator", @new="refreshDestIndex")
    #destindex-wrap
      DestIndex#destindex(ref="DestIndex", @refreshed="numDests = Number($event)")
</template>

<script>
import Creator from './Creator.vue'
import DestIndex from './DestIndex.vue'
import CONST from '../constants.js'
import axios from 'axios'

export default {
  name: 'Dash',
  data () {
    return {
      numDests: 0,
      username: 'guest',
      isRegistered: false,
      showLoginOrSignup: false,
      loginOrSignup: 'login',
      siteName: CONST.siteName,
      LOSUsername: '',
      LOSPassword: ''
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
    axios.get('/api/session').then(response => {
      if (response.data.IsRegistered === 'true') {
        this.username = response.data.Username
      } else {
        this.username = 'guest'
      }
      this.isRegistered = response.data.IsRegistered === 'true'
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
    DestIndex
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
  #subtitle
    color: darken(chalk-color, 5%)
    font-size: s-font-size
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