import { Link } from '@reach/router'
import styled from 'styled-components'
import { OrangeButtonVisual } from './OrangeButton'

const Button = OrangeButtonVisual
const StyledLink = styled(Link)`
  text-decoration: none;
`

function Plus() {
  return <span>+</span>
}

export default function CreateNewButton() {
  return (
    <StyledLink to="./-/create">
      <Button>
        <Plus />
        Create New
      </Button>
    </StyledLink>
  )
}
