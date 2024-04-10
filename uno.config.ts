import {
  defineConfig,
  presetUno,
  presetIcons,
  presetTypography,
  presetAttributify,
  toEscapedSelector
} from 'unocss'

export default defineConfig({
  rules: [
    [
      /^rainbow-(\w+)$/,
      ([, name], { rawSelector, currentSelector, variantHandlers, theme }) => {
        // console.log(name, rawSelector, currentSelector, variantHandlers)
        const selector = toEscapedSelector(rawSelector)
        const color = `var(--rb-brand${rawSelector.includes('dark:rainbow') ? '-dark' : ''})`
        if (name === 'text') {
          return `
            ${selector} {
              color: ${color};
            }
          `
        } else if (name === 'bgc') {
          return `
            ${selector} {
              background-color: ${color};
            }
          `
        } else if (name === 'a') {
          return `
            ${selector} a {
              color: ${color};
            }
          `
        }
      }
    ]
  ],
  presets: [presetUno(), presetAttributify(), presetIcons(), presetTypography()],
  shortcuts: [
    {
      center: 'flex justify-center items-center'
    }
  ],
  theme: {
    colors: {}
  }
})
