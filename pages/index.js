import React, { Component } from 'react'
import axios from 'axios'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import { CssBaseline, Grid, Typography } from '@material-ui/core'
import Head from '../components/head'
import Login from '../components/Login'
import TestRunner from '../components/TestRunner'

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: '#E1BEE7',
      light: 'rgb(231, 203, 235)',
      dark: 'rgb(157, 133, 161)',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    type: 'dark',
    primary: {
      main: '#7E57C2',
      light: 'rgb(151, 120, 206)',
      dark: 'rgb(88, 60, 135)',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen-Sans', 'Ubuntu', 'Cantarell', 'Helvetica Neue', sans-serif`,
  },
})

class Home extends Component {
  static async getInitialProps({ req }) {
    if (req.session) {
      const { me, token, micropubEndpoint } = req.session
      const loggedIn = token && micropubEndpoint
      let posts = []
      if (loggedIn) {
        try {
          const res = await axios.get(
            'http://examples.tpxl.io/feeds/allposts.json'
          )
          posts = res.data
        } catch (err) {
          console.log('Error getting posts', err)
        }
      }
      return { me, micropubEndpoint, posts, loggedIn }
    }
    return {}
  }

  render() {
    const { me, loggedIn, micropubEndpoint, posts } = this.props

    return (
      <MuiThemeProvider theme={theme}>
        <Head title="Home" />
        <CssBaseline />
        <Typography component="h1" variant="h2" style={{ padding: '1rem' }}>
          Post Type Tests
        </Typography>

        <Grid
          container
          justify="flex-start"
          alignItems="stretch"
          style={{ padding: '1rem' }}
        >
          <Grid item>
            {loggedIn ? (
              <TestRunner
                me={me}
                micropubEndpoint={micropubEndpoint}
                posts={posts}
              />
            ) : (
              <Login />
            )}
          </Grid>
        </Grid>
      </MuiThemeProvider>
    )
  }
}

export default Home
