const zips = [11104, 11209, 11214, 10019, 10013, 10003];

const ZipcodeList = () => (
  <div>
    Get results from:
    {' '}
    {zips.map(zip => <button>{zip}</button>)}
  </div>
)

export default ZipcodeList;