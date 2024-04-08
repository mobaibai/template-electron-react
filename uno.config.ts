import { defineConfig, presetUno, presetIcons, presetTypography, presetAttributify } from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons(), presetTypography()],
  shortcuts: [
    {
      'border-base': 'border border-gray-500_10',
      center: 'flex justify-center items-center'
    }
  ],
  theme: {
    colors: {}
  }
})
