import { createContext, useContext } from 'react'

import Theme from '../types/theme'

const ThemeContext = createContext<{ theme: Theme | null, setTheme: (theme: Theme) => void }>({ theme: null, setTheme: (theme: Theme) => { } })

export const useThemeContext = () => useContext(ThemeContext);

export default ThemeContext