import React from 'react'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  })
)

export type ChannelFormProps = {
  id: string
  handleOnSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export const ChannelForm: React.FC<ChannelFormProps> = ({
  id,
  handleOnSubmit,
}) => {
  const classes = useStyles()

  return (
    <form
      id={id}
      className={classes.form}
      onSubmit={handleOnSubmit}
      noValidate
      autoComplete='off'
      data-testid='channel-form'
    >
      <TextField
        variant='outlined'
        required
        fullWidth
        id='message'
        label='Message'
        name='message'
        data-testid='channel-form-input-message'
      />

      <Button
        type='submit'
        fullWidth
        variant='contained'
        color='primary'
        className={classes.submit}
        data-testid='channel-form-input-button'
      >
        Send
      </Button>
    </form>
  )
}

export default ChannelForm
