import React, { Component, Fragment } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Typography,
  Link,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import axios from 'axios'

class TestRunner extends Component {
  constructor(props) {
    super(props)
    this.state = {
      url: null,
      posting: false,
      checkingMf2: false,
    }
  }

  componentDidMount() {
    if (this.props.runTests) {
      this.runTest()
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.runTests === true &&
      !prevProps.runTests &&
      !this.state.url &&
      !this.state.posting &&
      !this.state.error
    ) {
      this.runTest()
    }
  }

  runTest = async (e = null) => {
    if (e && e.preventDefault) {
      e.preventDefault()
    }

    const { post } = this.props
    this.setState({ posting: true })
    try {
      const res = await axios.post('/create', { post })
      if (res.data && res.data.url) {
        this.setState({ url: res.data.url })
      }
      this.checkMicroformats()
    } catch (err) {
      console.log('Error posting', err)
      this.setState({
        error:
          err.response && err.response.data && err.response.data.error
            ? err.response.data
            : err,
      })
    }
    this.setState({ posting: false })
  }

  checkMicroformats = async (e = null) => {
    if (e && e.preventDefault) {
      e.preventDefault()
    }
    const { url } = this.state
    this.setState({ checkingMf2: true })
    try {
      const { post } = this.props
      const res = await axios.get('/mf2?url=' + encodeURIComponent(url))
      const mf2 = res.data.items[0]
      const missing = []
      for (const key in post.properties) {
        if (!mf2.properties.hasOwnProperty(key)) {
          missing.push(key)
        }
      }
      this.setState({ mf2Missing: missing })
    } catch (err) {
      console.log('Error checking mf2', err)
      this.setState({
        error:
          err.response && err.response.data && err.response.data.error
            ? err.response.data
            : err,
      })
    }
    this.setState({ checkingMf2: false })
  }

  render() {
    const { title } = this.props
    const { url, posting, error, mf2Missing, checkingMf2 } = this.state

    let cardTitle = title
    if (url) {
      cardTitle = '✅ ' + cardTitle
    } else if (error) {
      cardTitle = '❌ ' + cardTitle
    }

    return (
      <Fragment>
        <Card style={{ marginBottom: '1rem' }}>
          <CardHeader
            title={cardTitle}
            subheader={
              posting ? (
                'Posting...'
              ) : url ? (
                <Link href={url} target="_blank">
                  {url}
                </Link>
              ) : null
            }
          />
          <CardContent>
            {!!error && <Typography>Uh oh... Something went wrong</Typography>}
            {mf2Missing &&
              (mf2Missing.length ? (
                <Fragment>
                  <Typography>
                    ❌ Some Microformats properties seem to be missing:
                  </Typography>
                  <ul>
                    {mf2Missing.map((missing, i) => (
                      <li key={`missing-${i}`}>
                        <Typography>{missing}</Typography>
                      </li>
                    ))}
                  </ul>
                </Fragment>
              ) : (
                <Typography>✅ No Microformats missing</Typography>
              ))}
          </CardContent>
          {!!url && (
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Show Iframe Preview</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <iframe style={{ width: '100%', height: 500 }} src={url} />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )}
          <CardActions>
            {!url && !posting && <Button onClick={this.runTest}>Post</Button>}
            {!!url && !checkingMf2 && !mf2Missing && (
              <Button onClick={this.checkMicroformats}>
                Check Microformats
              </Button>
            )}
          </CardActions>
        </Card>
      </Fragment>
    )
  }
}

export default TestRunner
