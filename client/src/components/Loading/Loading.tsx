import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import LinearProgress, {
  LinearProgressProps,
} from '@material-ui/core/LinearProgress'
import Box from '@material-ui/core/Box'

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box display='flex' alignItems='center'>
      <Box width='100%'>
        <LinearProgress color='secondary' variant='indeterminate' {...props} />
      </Box>
    </Box>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: 'flex-start',
    position: 'fixed',
    zIndex: theme.zIndex.appBar + 1,
    width: '100%',
  },
}))

export const LinearWithValueLabel = () => {
  const classes = useStyles()
  const [progress, setProgress] = React.useState(10)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 10 : prevProgress + 10
      )
    }, 800)
    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div className={classes.root} data-testid='loading-container'>
      <LinearProgressWithLabel
        value={progress}
        data-testid='loading-animation'
      />
    </div>
  )
}
