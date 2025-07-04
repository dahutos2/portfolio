import { darkTheme, lightTheme, type GlobalThemeOverrides } from 'naive-ui'
import { usePreferredDark } from '@vueuse/core'

export const useNaiveTheme = () => {
  const isDark = usePreferredDark()
  const brand = '#00ADA0'
  const overrides: GlobalThemeOverrides = {
    common: { primaryColor: brand },
    Card:   { borderRadius: '12px' },
    Button: { borderRadius: '8px' }
  }
  return { theme: isDark.value ? darkTheme : lightTheme, overrides }
}
