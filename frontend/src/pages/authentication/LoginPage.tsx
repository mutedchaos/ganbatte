import { useCallback, useReducer } from 'react'
import styled from 'styled-components'

import withPreventDefault from '../../common/withPreventDefault'
import { SubmitButton } from '../../components/buttons/SubmitButton'
import ValidatedButton from '../../components/buttons/ValidatedButton'
import Labeled from '../../components/form/Labeled'
import TextInput from '../../components/form/TextInput'
import { Validateable } from '../../contexts/Validation'
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

  const validatePassword = useCallback((pwd: string) => pwd.trim().length >= 8, [])

  return (
    <Validateable>
      <SimpleLayout heading={'Log In'}>
        <form>
          <Head>
            <h1>Log In</h1>
            {loginErrorMessage && <ErrorMessage>{loginErrorMessage}</ErrorMessage>}
          </Head>
          <Labeled label={'Username'}>
            <TextInput value={state.username} field="username" onUpdate={updateState} autoFocus required />
          </Labeled>
          <Labeled label={'Password'} required>
            <TextInput
              value={state.password}
              field="password"
              onUpdate={updateState}
              type={'password'}
              onValidate={validatePassword}
            />
          </Labeled>
          <SubmitButton validated onClick={login}>
            Log In
          </SubmitButton>
          <Register onClick={register}>
            or <ValidatedButton>Create a new account</ValidatedButton> with the details you just entered.
          </Register>{' '}
          {registerErrorMessage && <ErrorMessage>{registerErrorMessage}</ErrorMessage>}
        </form>
      </SimpleLayout>
    </Validateable>
  )
}
