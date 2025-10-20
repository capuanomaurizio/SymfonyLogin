import './App.css'
import {Form, Input, Button, Flex, Card, message} from 'antd'
import {useRef} from "react";

function App() {

    const registrationFormRef = useRef(null)
    const loginFormRef = useRef(null)

    const handleRegister = async () => {
        try {
            const values = registrationFormRef.current.getFieldsValue()
            const response = await fetch('/api/registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            })
            const data = await response.json()
            if (response.ok) {
                message.success(data.message)
                //registrationFormRef.current.resetFields()
                window.location.href = data.redirect
            } else {
                message.error(data.error)
            }
        } catch (err) {
            message.error('Errore di connessione al server')
        }
    }

    // Funzione per login
    const handleLogin = async () => {
        try {
            const values = loginFormRef.current.getFieldsValue()
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            })
            const data = await response.json()
            console.log(data);
            if (response.ok) {
                message.success('Login effettuato!')
                //loginFormRef.current.resetFields()
                window.location.href = data.redirect
            } else {
                message.error(data.error || 'Credenziali errate')
            }
        } catch (err) {
            message.error('Errore di connessione al server')
        }
    }

  return (
    <Flex className="container" vertical>
      <div className="header">
        <h1>Symfony registration and login form</h1>
        <p>Esercizio di connessione e comunicazione con database Mongo sfruttando il PHP framework "Symfony"</p>
      </div>
      <Flex className='flexBox'  align='center'>
        <Flex className='formFlex' justify='center' align='flex-start'>
          <Card className='formCard' title="Register user" hoverable>
            <Form ref={registrationFormRef}>
              <Form.Item label="User Name" name="name">
                <Input placeholder='User name' />
              </Form.Item>
              <Form.Item label="User Surname" name="surname">
                <Input placeholder='User surname' />
              </Form.Item>
              <Form.Item label="User Email" name="email">
                <Input placeholder='Email' />
              </Form.Item>
              <Form.Item label="Password" name="plainPassword">
                <Input.Password placeholder='Password' />
              </Form.Item>
              <Form.Item>
                <Button block type='primary' onClick={handleRegister}>Register user</Button>
              </Form.Item>
            </Form>
          </Card>
        </Flex>
        <Flex className='formFlex' justify='center' align='flex-start'>
          <Card className='formCard' title="Login" hoverable>
            <Form ref={loginFormRef}>
              <Form.Item label="User Email" name="username">
                <Input placeholder='Email' />
              </Form.Item>
              <Form.Item label="Password" name="password">
                <Input.Password placeholder='Password' />
              </Form.Item>
              <Form.Item>
                <Button block type='primary' onClick={handleLogin}>Login</Button>
              </Form.Item>
            </Form>
          </Card>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default App;
