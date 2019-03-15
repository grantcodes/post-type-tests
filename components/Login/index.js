import React from 'react'
import {
  Button,
  FormControl,
  Input,
  InputLabel,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@material-ui/core'

const Login = () => {
  return (
    <Dialog open={true}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <form method="post" action="/login" onSubmit={e => true}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="url">Your url</InputLabel>
            <Input id="url" name="url" autoFocus type="url" />
          </FormControl>

          <Button type="submit" fullWidth variant="contained" color="primary">
            Sign in
          </Button>
        </form>
        <Typography style={{ margin: '1rem 0', textAlign: 'center' }}>
          Or manually set a micropub endpoint and token
        </Typography>
        <form method="post" action="/login-manual" onSubmit={e => true}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="micropubEndpoint">
              Micropub endpoint
            </InputLabel>
            <Input id="micropubEndpoint" name="micropubEndpoint" type="url" />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="token">Token</InputLabel>
            <Input id="token" name="token" type="tezt" />
          </FormControl>

          <Button type="submit" fullWidth variant="contained" color="primary">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default Login
