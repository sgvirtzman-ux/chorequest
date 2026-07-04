import { expect, test, type Page } from '@playwright/test'

/**
 * End-to-end smoke: the full family flow against the seeded sample data.
 * Each test gets a fresh browser context, so localStorage starts clean.
 */

async function enterPin(page: Page, pin = '1234') {
  for (const digit of pin.split('')) {
    await page.getByRole('button', { name: digit, exact: true }).click()
  }
}

async function selectPlayer(page: Page, name: string) {
  await page.getByRole('button', { name: /press start/i }).click()
  await page.getByRole('button', { name: new RegExp(name, 'i') }).click()
}

test('full flow: claim → approve → points → redeem → leaderboard → export', async ({
  page,
}) => {
  await page.goto('/')

  // title screen
  await expect(page.getByAltText('ChoreQuest')).toBeVisible()

  // pick Nova (seeded with 120 pts and 3 weekly chores)
  await selectPlayer(page, 'Nova')
  await expect(page.getByText('Scrub the Bathroom')).toBeVisible()
  await expect(page.locator('[title="points bank"]')).toHaveText(/120/)

  // claim a chore -> goes to pending
  await page.getByRole('button', { name: /Scrub the Bathroom/i }).click()
  await page.getByRole('button', { name: /I did it/i }).click()
  await expect(page.getByText(/awaiting approval/i)).toBeVisible()

  // parent approves it in the admin area
  await page.getByRole('button', { name: /switch/i }).click()
  await page.getByRole('button', { name: /parents/i }).click()
  await enterPin(page)
  await expect(page.getByText('Nova · Scrub the Bathroom')).toBeVisible()
  await page.getByRole('button', { name: /approve/i }).click()
  await expect(page.getByText(/all clear, commander/i)).toBeVisible()

  // player sees the points (120 + 25 = 145) and the done state
  await page.getByRole('button', { name: /exit/i }).click()
  await selectPlayer(page, 'Nova')
  await expect(page.locator('[title="points bank"]')).toHaveText(/145/)
  await expect(page.getByText(/Done! \+25/i)).toBeVisible()

  // redeem a prize (Pocket Change, 25 pts) -> bank back to 120, loot pending
  await page.getByRole('button', { name: /prize shop/i }).click()
  await page
    .locator('div')
    .filter({ hasText: /^Pocket Change/ })
    .getByRole('button', { name: /cash in/i })
    .first()
    .click()
  await page.getByRole('dialog').getByRole('button', { name: /cash in/i }).click()
  await expect(page.locator('[title="points bank"]')).toHaveText(/120/)
  await expect(page.getByText(/waiting for a parent/i)).toBeVisible()

  // leaderboard: Nova leads with this week's 25 approved points
  await page.getByRole('button', { name: /back/i }).click()
  await page.getByRole('button', { name: /leaderboard/i }).click()
  await expect(page.getByAltText('week leader')).toBeVisible()
  const novaRow = page.locator('div').filter({ hasText: /^1.*NOVA/i }).first()
  await expect(novaRow).toContainText('25')

  // settings: export produces a backup download
  await page.getByRole('button', { name: /back/i }).click() // -> dashboard
  await page.getByRole('button', { name: /switch/i }).click() // -> title
  await page.getByRole('button', { name: /parents/i }).click()
  await enterPin(page)
  await page.getByRole('button', { name: 'Settings', exact: true }).click()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /export backup/i }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toMatch(/^chorequest-backup-.*\.json$/)
})

test('wrong PIN does not unlock the parent zone', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /parents/i }).click()
  await enterPin(page, '9999')
  await expect(page.getByRole('button', { name: 'Approvals' })).not.toBeVisible()
  // keypad still shown
  await expect(page.getByRole('button', { name: '5', exact: true })).toBeVisible()
})

test('state survives a reload', async ({ page }) => {
  await page.goto('/')
  await selectPlayer(page, 'Zane')
  await page.getByRole('button', { name: /Take Out the Trash/i }).click()
  await page.getByRole('button', { name: /I did it/i }).click()
  await expect(page.getByText(/awaiting approval/i)).toBeVisible()

  await page.reload()
  // app reopens on the title screen; the pending claim must persist
  await selectPlayer(page, 'Zane')
  await expect(page.getByText(/awaiting approval/i)).toBeVisible()
})

const VIEWPORTS = [
  { name: 'phone', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
]

test('responsive screenshots of every screen', async ({ page }) => {
  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height })
    await page.goto('/')
    await page.waitForTimeout(250)
    await page.screenshot({ path: `e2e/screenshots/title-${vp.name}.png` })

    await selectPlayer(page, 'Nova')
    await page.waitForTimeout(250)
    await page.screenshot({ path: `e2e/screenshots/dashboard-${vp.name}.png` })

    await page.getByRole('button', { name: /prize shop/i }).click()
    await page.waitForTimeout(250)
    await page.screenshot({ path: `e2e/screenshots/shop-${vp.name}.png` })

    await page.getByRole('button', { name: /back/i }).click()
    await page.getByRole('button', { name: /leaderboard/i }).click()
    await page.waitForTimeout(250)
    await page.screenshot({ path: `e2e/screenshots/leaderboard-${vp.name}.png` })
  }
})
