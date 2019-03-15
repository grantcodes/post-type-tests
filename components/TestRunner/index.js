import React, { Component, Fragment } from 'react'
import {
  Avatar,
  Card,
  CardHeader,
  CardActions,
  Button,
} from '@material-ui/core'
import Test from './Test'

class TestRunner extends Component {
  constructor(props) {
    super(props)
    this.state = {
      runAll: false,
    }
  }
  render() {
    const { runAll } = this.state
    const { me, micropubEndpoint, posts } = this.props

    return (
      <Fragment>
        <Card style={{ marginBottom: '1rem' }}>
          {me && micropubEndpoint && (
            <CardHeader
              title={`Logged in as ${me}`}
              subheader={`Micropub endpoint: ${micropubEndpoint}`}
            />
          )}
          <CardActions>
            <Button onClick={() => this.setState({ runAll: true })}>
              Run All
            </Button>
          </CardActions>
        </Card>
        {posts.map((post, i) => (
          <Test
            key={`test-${i}`}
            title={post.name}
            post={post.post}
            runTests={runAll}
          />
        ))}
      </Fragment>
    )
  }
}

export default TestRunner
