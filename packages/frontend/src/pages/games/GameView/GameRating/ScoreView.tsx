import styled from 'styled-components'

interface Props {
  score: number
  faded?: boolean
}

const starWidth = 24

const filled = '★'
// const stroke = '☆'

const Background = styled.div`
  position: relative;
  font-size: 25px;
  display: flex;
`

const StarBase = styled.div`
  width: ${starWidth}px;
  text-align: center;
`

const BgStar = styled(StarBase)`
  color: lightgray;
`

const Bright = styled(StarBase)`
  color: gold;
  color: ${({ score, faded }: { score: number; faded: boolean }) => getColor(score, faded)};
`

const Fill = styled.div<{ score: number }>`
  width: ${({ score }) => score * starWidth}px;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
`

const Inner = styled.div`
  position: absolute;
  display: flex;
`

export const ScoreViewWidth = 5 * starWidth

export default function ScoreViewImpl({ score, faded }: Props) {
  return (
    <Background>
      <BgStar>{filled}</BgStar>
      <BgStar>{filled}</BgStar>
      <BgStar>{filled}</BgStar>
      <BgStar>{filled}</BgStar>
      <BgStar>{filled}</BgStar>
      <Fill score={score}>
        <Inner>
          <Bright score={score} faded={!!faded}>
            {filled}
          </Bright>
          <Bright score={score} faded={!!faded}>
            {filled}
          </Bright>
          <Bright score={score} faded={!!faded}>
            {filled}
          </Bright>
          <Bright score={score} faded={!!faded}>
            {filled}
          </Bright>
          <Bright score={score} faded={!!faded}>
            {filled}
          </Bright>
        </Inner>
      </Fill>
    </Background>
  )
}

function getColor(score: number, faded: boolean) {
  const hue = (score < 2 ? 0 : score > 4 ? 50 : (score - 2) * 25) + (faded ? 180 : 0),
    saturation = faded ? 80 : 100,
    lightness = faded ? 75 : 50

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}
