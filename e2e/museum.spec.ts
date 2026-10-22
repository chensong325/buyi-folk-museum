import { expect, test } from '@playwright/test'

const routes = [
  '/', '/craft/process', '/craft/patterns', '/craft/costume', '/craft/collage',
  '/stage/instruments', '/stage/opera', '/stage/songs', '/stage/chabai',
  '/season/liuyueliu', '/season/food', '/season/courtship', '/season/geography',
  '/creative', '/copyright',
]

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('buyi:intro-seen', '1'))
})

test('all fifteen routes render without broken images or horizontal overflow', async ({ page }) => {
  for (const route of routes) {
    await page.goto(`/#${route}`)
    await expect(page.locator('h1')).toBeVisible()
    const result = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      broken: [...document.images].filter((img) => img.complete && img.naturalWidth === 0).length,
    }))
    expect(result.overflow, route).toBeLessThanOrEqual(1)
    expect(result.broken, route).toBe(0)
  }
})

test('entry starts the persistent background track and supports pause and resume', async ({ page }) => {
  await page.addInitScript(() => localStorage.removeItem('buyi:intro-seen'))
  await page.goto('/')
  await page.getByRole('button', { name: '进入展馆' }).click()
  await expect(page.locator('.splash')).toBeHidden()
  await expect.poll(() => page.locator('audio').evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(false)
  await page.locator('.audio-toggle').click()
  await expect.poll(() => page.locator('audio').evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(true)
  await page.goto('/#/creative')
  await expect.poll(() => page.locator('audio').evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(true)
  await page.locator('.audio-toggle').click()
  await expect.poll(() => page.locator('audio').evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(false)
})

test('pattern modal, costume hotspots and timeline interactions work', async ({ page }) => {
  await page.goto('/#/craft/patterns')
  await page.locator('.pattern-card').first().click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()

  await page.goto('/#/craft/costume')
  await page.getByRole('tab', { name: /围腰/ }).click()
  await expect(page.locator('.costume-detail-copy h3')).toHaveText('围腰')

  await page.goto('/#/season/liuyueliu')
  await page.getByRole('tab', { name: /丢花包/ }).click()
  await expect(page.locator('.festival-detail h3')).toHaveText('丢花包')
})

test('collage exports a PNG and restores saved work', async ({ page }) => {
  await page.goto('/#/craft/collage')
  await page.locator('.palette-item').nth(0).click()
  await page.locator('.palette-item').nth(1).click()
  await page.locator('.palette-item').nth(2).click()
  await expect(page.locator('.collage-object')).toHaveCount(3)
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: '保存纹样卡' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('我的布依纹样卡.png')
  await page.reload()
  await expect(page.locator('.collage-object')).toHaveCount(3)
})

