import styled from 'styled-components'

const zips = [11104, 11209, 11214, 10019, 10013, 10003];

const Button = styled.button`
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
    background-color: #006deb;
    color: white;
  }
`

const ZipcodeList = () => (
  <>
    <p>Get results from:<br />
    {' '}
    {zips.map(zip => <Button>{zip}</Button>)}
    </p>
  </>
)

export default ZipcodeList;