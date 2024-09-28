const Notification = ({ message }) => {
    if (message === null)
        return null

    const style = {
        color: message.success ? 'green' : 'red'
    }

    return (
        <div className='notification' style={style}>
            {message.text}
        </div>
    )
}

export default Notification