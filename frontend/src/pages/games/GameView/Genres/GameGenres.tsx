import compact from 'lodash/compact'
import { useMemo } from 'react'

import { useCachedData } from '../../../../common/CachedDataProvider'
import required from '../../../../common/required'
import ToggableEditable from '../../../../components/misc/TogglableEditable'
import { GameViewQuery, GenreAssociationType } from '../__generated__/GameViewQuery.graphql'
import GameGenreEditor from './GameGenreEditor'

type Genre = GameViewQuery['response']['game']['relatedGenres'][number]

interface AssociatedGenre {
  association: GenreAssociationType
  genre: Genre
}

export default function GameGenres() {
  const game = useCachedData('game')
  const toplevel = useMemo<AssociatedGenre[]>(() => {
    return game.game.genres.map((gameGenre) => ({
      association: gameGenre.association,
      genre: required(game.game.relatedGenres.find((rg) => rg.id === gameGenre.genre.id)),
    }))
  }, [game.game.genres, game.game.relatedGenres])
  const genres = flattenGenres(toplevel, game.game.relatedGenres)

  return (
    <>
      <h2>Genre(s)</h2>
      <ToggableEditable editor={<GameGenreEditor />}>
        {genres
          .filter((g) => g.association !== 'ExplicitNo' && g.association !== 'Expected')
          .map((genre) => (
            <div key={genre.genre.id}>
              <p>
                {genre.genre.name} {genre.association}
              </p>
            </div>
          ))}
      </ToggableEditable>
    </>
  )
}

function flattenGenres(toplevel: AssociatedGenre[], related: readonly Genre[]): AssociatedGenre[] {
  const additions: AssociatedGenre[] = []
  for (const genre of toplevel) {
    for (const subgenre of genre.genre.subgenres) {
      const sg = required(related.find((r) => r.id === subgenre.child.id))
      additions.push({ genre: sg, association: subgenre.association })
    }
  }

  const additionIds = new Set(additions.map((a) => a.genre.id))

  const finalAdditions = compact(
    Array.from(additionIds).map((genreId) => {
      if (toplevel.some((e) => e.genre.id === genreId)) return null // do not override from above
      const newOnes = additions.filter((a) => a.genre.id === genreId)
      if (newOnes.length === 1) return newOnes[0]
      const association = pickAssociation(newOnes.map((n) => n.association))
      return {
        association,
        genre: newOnes[0].genre,
      }
    })
  )

  if (finalAdditions.length === 0) return toplevel

  return [...toplevel, ...finalAdditions]
}

const priorities: GenreAssociationType[] = ['Expected', 'ExplicitNo', 'Partial', 'Full']

function pickAssociation(options: GenreAssociationType[]): GenreAssociationType {
  return options.sort((a, b) => priorities.indexOf(b) - priorities.indexOf(a))[0]
}
