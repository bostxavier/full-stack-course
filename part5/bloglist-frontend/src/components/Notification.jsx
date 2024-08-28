import PropTypes from 'prop-types'

const Notification = ({ info }) => {
  if (!info.message) {
    return
  }

  const style = {
    color: info.type ==='error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div style={style}>
      {info.message}
    </div>
  )
}

Notification.propTypes = {
  info: PropTypes
    .exact({
      type: PropTypes.string,
      message: PropTypes.string
    })
}

export default Notification