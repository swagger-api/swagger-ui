/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

// WCAG 2.x AA minimum for normal-size text (SC 1.4.3)
const MIN_CONTRAST = 4.5

test.describe("#9585: Request body schema text color contrast", () => {
  test("data type, format and example text should meet WCAG AA contrast", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("/?url=/documents/bugs/9585.yaml")
    await swaggerUi.toggleOperation("#operations-default-addPet")
    const requestBody = page.locator(".opblock-section-request-body")
    await requestBody.locator("button.tablinks[data-name=model]").click()

    const modelBox = requestBody.locator(".model-box").first()
    // expand the model and each of its properties
    for (let i = 0; i < 10; i++) {
      const collapsed = modelBox.locator("[aria-expanded=false]")
      if ((await collapsed.count()) === 0) break
      await collapsed.first().click()
    }

    const selectors = [
      ".prop-type",
      ".prop-format",
      ".property.primitive",
      ".property:not(.primitive)",
    ]

    for (const selector of selectors) {
      const element = modelBox.locator(selector).first()
      await expect(element, selector).toBeVisible()

      const ratio = await element.evaluate((el) => {
        type RGBA = [number, number, number, number]
        const parse = (value: string): RGBA => {
          const [r, g, b, a = 1] = (value.match(/[\d.]+/g) ?? []).map(Number)
          return [r, g, b, a]
        }
        const over = (top: RGBA, bottom: RGBA): RGBA => [
          top[0] * top[3] + bottom[0] * (1 - top[3]),
          top[1] * top[3] + bottom[1] * (1 - top[3]),
          top[2] * top[3] + bottom[2] * (1 - top[3]),
          1,
        ]
        const luminance = ([r, g, b]: RGBA) => {
          const channel = (c: number) => {
            const s = c / 255
            return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
          }
          return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
        }

        // composite every ancestor's (often translucent) background onto white
        const backgrounds: RGBA[] = []
        for (let node: Element | null = el; node; node = node.parentElement) {
          backgrounds.unshift(parse(getComputedStyle(node).backgroundColor))
        }
        const background = backgrounds.reduce<RGBA>(
          (bottom, top) => over(top, bottom),
          [255, 255, 255, 1]
        )
        const foreground = over(parse(getComputedStyle(el).color), background)

        const [lighter, darker] = [
          luminance(foreground),
          luminance(background),
        ].sort((a, b) => b - a)
        return (lighter + 0.05) / (darker + 0.05)
      })

      expect(ratio, selector).toBeGreaterThanOrEqual(MIN_CONTRAST)
    }
  })
})
