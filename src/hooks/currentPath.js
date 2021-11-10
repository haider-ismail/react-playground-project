import { useLocation } from 'react-router-dom'

const useCurrentPath = () => {
  const location = useLocation()
  
  return location.pathname
}

export default useCurrentPath;