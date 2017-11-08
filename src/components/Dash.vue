<template lang="pug">
  #dash(:class="{collapsed: !isRegistered}")
    label#toggle-label(for="toggle", v-text="collapsed? 'Expand' : 'Collapse'")
    input#toggle(v-model="collapsed", type="checkbox", style="display: none")
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
              input#password(type="text", v-model="LOSPassword", placeholder="password")
              button#los-btn(@click.prevent="submitLOS") {{ loginOrSignup }}
              a(href="#")
                i.material-icons(@click="showLoginOrSignup=false") close
      creator
    #listing-wrap
      #listing
</template>

<script>
import Creator from './Creator.vue'
import CONST from '../constants.js'
import axios from 'axios'

export default {
  name: 'Dash',
  data () {
    return {
      collapsed: true,
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
        }).catch(error => {
          console.log('login fail ' + error.response.data.msg + '\n')
        })
      }
    },
    logout () {
      axios.get('/api/user/logout').then(response => {
        this.username = 'guest'
        this.isRegistered = false
      }).catch(error => {
        console.log('logout fail ' + error.response.data.msg + '\n')
      })
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
  components: {
    Creator
  }
}
</script>

<style lang="stylus" scoped>
@require '../assets/settings.styl'

#dash
  display: flex
  margin: 0 auto
  max-width: dash-max-width

#creator-wrap, #listing-wrap
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
    
#listing-wrap
  flex: 1
  #listing
    width: 100%
    height: 100vh
    background-color: red

#dash.collapsed
  #creator-wrap
    flex: 1
  #listing-wrap
    flex: 0
  
#toggle-label
  display: inline-block
  position: fixed
  padding: s-space
  border-radius: m-radius
  bottom: s-space
  left: s-space
  background-color: white

</style>