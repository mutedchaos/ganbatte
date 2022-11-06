import { Link } from 'react-router-dom'

import MainLayout from '../../layouts/MainLayout/MainLayout'

export default function MiscPage() {
  return (
    <MainLayout heading="Misc">
      <h1>Misc</h1>
      <ul>
        <li>
          <Link to="./addManyGames">Add multiple games</Link>
        </li>
      </ul>
    </MainLayout>
  )
}
