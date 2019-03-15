const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const next = require('next')
const Micropub = require('micropub-helper')
const axios = require('axios')
require('dotenv').config()

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const micropub = new Micropub({
  clientId: `${process.env.URL}`,
  redirectUri: `${process.env.URL}/auth`,
  state: 'Super secret lolz', // TODO: generate proper state
})

app.prepare().then(() => {
  const server = express()
  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: true }))
  server.set('trust proxy', 1)
  server.use(
    session({
      secret: 'another very secret thing', // TODO: Move to .env and secure cookies
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
  )

  server.post('/login', async (req, res) => {
    const { url } = req.body
    if (!url) {
      return res.redirect('/error')
    }
    micropub.options.me = url
    try {
      const authUrl = await micropub.getAuthUrl()
      req.session.me = url
      req.session.tokenEndpoint = micropub.options.tokenEndpoint
      req.session.micropubEndpoint = micropub.options.micropubEndpoint
      return res.redirect(authUrl)
    } catch (err) {
      console.log('Error getting auth url', err)
      return res.redirect('/error')
    }
  })

  server.post('/login-manual', async (req, res) => {
    const { micropubEndpoint, token } = req.body
    if (!micropubEndpoint || !token) {
      return res.redirect('/error')
    }

    req.session.token = token
    req.session.micropubEndpoint = micropubEndpoint
    return res.redirect('/')
  })

  server.get('/auth', async (req, res) => {
    const { me, tokenEndpoint } = req.session
    const { code, state } = req.query
    micropub.options.me = me
    micropub.options.tokenEndpoint = tokenEndpoint
    if (state !== micropub.options.state) {
      console.log('Bad state')
      return res.redirect('/error')
    }
    try {
      const token = await micropub.getToken(code)
      req.session.token = token
      return res.redirect('/')
    } catch (err) {
      console.log('Error getting token url', err)
      return res.redirect('/error')
    }
  })

  server.post('/create', async (req, res) => {
    const { token, micropubEndpoint } = req.session
    micropub.options.token = token
    micropub.options.micropubEndpoint = micropubEndpoint
    try {
      const { post } = req.body
      const url = await micropub.create(post)
      return res.json({ url })
    } catch (err) {
      return res.status(500).json({ error: 'Error creating post' })
    }
  })

  server.get('/mf2', async (req, res) => {
    try {
      const { url } = req.query
      const response = await axios.get(
        `https://pin13.net/mf2/?url=${encodeURIComponent(url)}`
      )
      return res.json(response.data)
    } catch (err) {
      return res.status(500).json({ error: 'Error getting mf2' })
    }
  })

  server.get('*', (req, res) => handle(req, res))

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on ${process.env.URL}`)
  })
})
