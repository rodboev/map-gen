import { useState } from 'react';
import styled from 'styled-components'

const StyledButton = styled.button`
  border: 2px solid #3376d2;
	border-radius: 3px;
	cursor: pointer;
	font-size: 80%;
	padding: 0 20pt;
	background: white;
	color: #3376d2;
  height: 22pt;
  margin: 0.25em;
  &:hover {
    color: white;
    background-color: rgba(0, 109, 235, 0.75);
    border-color: transparent;
  }
  &.selected, &.selected:hover {
    color: white;
    background-color: rgba(0, 109, 235);
  }
`

const Button = ({children, boros, currentBoros, setCurrentBoros, filter, setFilter}) => {
  const [selected, setSelected] = useState(false);

  return (
    <StyledButton
      className={ selected ? 'selected' : '' }
      onClick={() => {
        const isSelected = !selected;
        let selectedBoros;

        const getZips = selectedBoros => boros
          .map(boro => selectedBoros.includes(boro.name) && boro.zips)
          .filter(Boolean)
          .flat()

        if (isSelected) {
          selectedBoros = currentBoros.concat(boros.filter(x => x.name === children)[0].name)
          setCurrentBoros(selectedBoros)
          setFilter({
            ...filter,
            boros: selectedBoros,
            zips: getZips(selectedBoros)
          })
        }
        else {
          selectedBoros = currentBoros.filter(currentBoro => currentBoro !== children)
          setCurrentBoros(selectedBoros)
          setFilter({
            ...filter,
            boros: selectedBoros,
            zips: getZips(selectedBoros)
          })
        }
      
        setSelected(isSelected)
       }}
    >
      {children}
    </StyledButton>
  )
}

const Filter = ({ boros, filter, setFilter }) => {
  const [currentBoros, setCurrentBoros] = useState([]);

  return (
    <p>
      Filter:
      { ' ' }
      { boros.map(boro =>
        <Button
          boros={boros}
          currentBoros={currentBoros}
          setCurrentBoros={setCurrentBoros}
          filter={filter}
          setFilter={setFilter}
        >
            {boro.name}
        </Button>
      )}
    </p>
  )
}

export default Filter;