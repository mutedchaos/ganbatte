import { DefaultTheme } from 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    button: {
      backgroundColor: string
      hoverBackgroundColor: string
      shadowColor: string
    }
  }
}

export const orangeTheme: DefaultTheme = {
  button: {
    backgroundColor: 'orange',
    hoverBackgroundColor: 'gold',
    shadowColor: '#ff940f70',
  },
}

export const redTheme: DefaultTheme = {
  button: {
    backgroundColor: '#ff6262',
    hoverBackgroundColor: '#ff7070',
    shadowColor: '#ff240f70',
  },
}
