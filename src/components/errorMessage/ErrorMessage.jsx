import img from './error.gif';

const ErrorMessage = ({message}) => {
  return (
    <div >
      <img style={{ display: 'block', width: '150px', height: '150px', objectFit: 'contain', margin: '0 auto' }}src={img} alt="error" />
      <div style={{ textAlign: 'center', fontSize: '20px', color: 'red' }}>
        {message}
      </div>
    </div>
  )
}

export default ErrorMessage;
