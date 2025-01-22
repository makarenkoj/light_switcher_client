// import logo from './logo.svg';
import './App.css';
import SignUpForm from './components/forms/signUpForm';
import LoginForm from './components/forms/loginForm';
import SendCode from './components/sendCode/sendCode';
import CodeForm from './components/forms/codeForm';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="service center">
          <div className="title degraded">
            Light Switcher
          </div>
          <div className="container">
            <SignUpForm />
            <LoginForm />
          </div>
          <div>
            <h1>Send Request Example</h1>
            <SendCode />
          </div>
          <div>
          <CodeForm />
          </div>
        </div>

      </header>
    </div>
  );
}

export default App;
