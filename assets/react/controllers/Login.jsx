import '../../styles/Login.css'
import {authRequest} from '../utils'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import {Form, Input, Button, Flex, Card} from 'antd'
import {useRef} from "react";

function Login() {

    const registrationFormRef = useRef(null)
    const loginFormRef = useRef(null)

    const handleRegister = async () => {
        await authRequest('registration', registrationFormRef.current.getFieldsValue());
    }

    const handleLogin = async () => {
        await authRequest('login', loginFormRef.current.getFieldsValue());
    }

  return (
    <Flex className="container" vertical>
      <div className="header">
        <h1>Form di registrazione e login con Symfony</h1>
        <p>Esercizio di connessione e comunicazione con database Mongo sfruttando il PHP framework "Symfony"</p>
      </div>
      <Flex className='flexBox' align='center'>
        <Flex className='formFlex' justify='center' align='flex-start'>
          <Card className='formCard' title="Registra utente" hoverable>
            <Form ref={registrationFormRef} onFinish={handleRegister}>
              <Form.Item label="Nome" name="name" rules={[{ required: true, message: 'Inserisci il nome!' }]}>
                <Input placeholder='Nome utente' />
              </Form.Item>
              <Form.Item label="Cognome" name="surname" rules={[{ required: true, message: 'Inserisci il cognome!' }]}>
                <Input placeholder='Cognome utente' />
              </Form.Item>
              <Form.Item label="Email" name="email" rules={[{ required: true, message: "Inserisci l'indirizzo email!" }]}>
                <Input type="email" placeholder='Email' />
              </Form.Item>
              <Form.Item  label="Password" name="plainPassword" rules={[{ required: true, message: 'Inserisci la password!' }]}>
                <Input.Password placeholder='Password' />
              </Form.Item>
              <Form.Item>
                <Button block type='primary' htmlType="submit">Registrati</Button>
              </Form.Item>
            </Form>
          </Card>
        </Flex>
        <Flex className='formFlex' justify='center' align='flex-start'>
          <Card className='formCard' title="Login utente" hoverable>
            <Form ref={loginFormRef} onFinish={handleLogin}>
              <Form.Item label="Email" name="username" rules={[{ required: true, message: "Inserisci l'indirizzo email!" }]}>
                <Input prefix={<UserOutlined />} type="email" placeholder='Email' />
              </Form.Item>
              <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Inserisci la password!' }]}>
                <Input.Password prefix={<LockOutlined />} placeholder='Password' />
              </Form.Item>
              <Form.Item>
                <Button block type='primary' htmlType="submit">Login</Button>
              </Form.Item>
            </Form>
          </Card>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Login;
