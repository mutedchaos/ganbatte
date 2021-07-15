import { useReducer } from 'react'
import styled from 'styled-components'

import withPreventDefault from '../../common/withPreventDefault'
import { SubmitButton } from '../../components/buttons/SubmitButton'
import Labeled from '../../components/form/Labeled'
import TextInput from '../../components/form/TextInput'
import SimpleLayout from '../../layouts/MainLayout/SimpleLayout'
import useLogin from './useLogin'
import useRegister from './useRegister'

type State = {
  username: string
  password: string
}

export type LoginState = State

const initialState: State = {
  username: '',
  password: '',
}

const Register = styled.p`
  font-size: 0.8em;
`

const ErrorMessage = styled.p`
  color: red;
`

const Head = styled.div`
  display: flex;
  align-items: flex-end;
  > * {
    margin-right: 30px;
  }
`

export default function LoginPage() {
  const [state, updateState] = useReducer(
    (state: State, update: Partial<State>) => ({ ...state, ...update }),
    initialState
  )
  const { login: loginImpl, errorMessage: loginErrorMessage } = useLogin(state)
  const { register: registerImpl, errorMessage: registerErrorMessage } = useRegister(state)
  const login = withPreventDefault(loginImpl)
  const register = withPreventDefault(registerImpl)

  return (
    <SimpleLayout heading={'Log In'}>
      <form>
        <Head>
          <h1>Log In</h1>
          {loginErrorMessage && <ErrorMessage>{loginErrorMessage}</ErrorMessage>}
        </Head>
        <Labeled label={'Username'}>
          <TextInput value={state.username} field="username" onUpdate={updateState} autoFocus />
        </Labeled>
        <Labeled label={'Password'}>
          <TextInput value={state.password} field="password" onUpdate={updateState} type={'password'} />
        </Labeled>
        <SubmitButton onClick={login}>Log In</SubmitButton>
        <Register onClick={register}>
          or <button>Create a new account</button> with the details you just entered.
        </Register>{' '}
        {registerErrorMessage && <ErrorMessage>{registerErrorMessage}</ErrorMessage>}
      </form>
    </SimpleLayout>
  )
}
