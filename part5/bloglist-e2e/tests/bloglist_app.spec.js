const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'password'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Arto Hellas',
        username: 'hellas',
        password: 'password2'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('testuser')
      await page.getByTestId('password').fill('password')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('testuser')
      await page.getByTestId('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('invalid username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('testuser')
      await page.getByTestId('password').fill('password')
      await page.getByRole('button', { name: 'login' }).click()
    })
  
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('Comment configurer et utiliser efficacement l’historique bash')
      await page.getByTestId('author').fill('Alexis Madrzejewski')
      await page.getByTestId('url').fill('https://blog.madrzejewski.com/astuce-historique-bash-linux')
      await page.getByRole('button', { name: 'create' }).click()
      
      await expect(page.locator('div').filter({ hasText: 'Comment configurer et' }).nth(2)).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title').fill('Comment configurer et utiliser efficacement l’historique bash')
        await page.getByTestId('author').fill('Alexis Madrzejewski')
        await page.getByTestId('url').fill('https://blog.madrzejewski.com/astuce-historique-bash-linux')
        await page.getByRole('button', { name: 'create' }).click()
        await expect(page.locator('div').filter({ hasText: 'Comment configurer et' }).nth(2)).toBeVisible()
      })
  
      test('blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('blog can be deleted by the user who added it', async ({ page }) => {
        page.on('dialog', async (dialog) => {
          expect(dialog.message()).toContain('Remove blog Comment configurer et utiliser efficacement l’historique bash by Alexis Madrzejewski?')
          await dialog.accept()
        })

        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.locator('div').filter({ hasText: 'Comment configurer et' }).nth(2)).not.toBeVisible()
      })

      test('a user that did not add the blog cannot see the remove button', async ({ page }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        await page.getByTestId('username').fill('hellas')
        await page.getByTestId('password').fill('password2')
        await page.getByRole('button', { name: 'login' }).click()
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })

      test('blogs are sorted according to the number of likes', async ({ page }) => {
        await page.getByTestId('title').fill('React patterns')
        await page.getByTestId('author').fill('Michael Chan')
        await page.getByTestId('url').fill('http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html')
        await page.getByRole('button', { name: 'create' }).click()
        await expect(page.getByText('React patterns Michael Chan')).toBeVisible()

        const viewButtons = await page.getByRole('button', { name: 'view' }).all()
        expect(viewButtons.length).toBe(2)

        await viewButtons[0].click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
        await page.getByRole('button', { name: 'hide' }).click()
        let blogTitles = await page.locator('.blog-title').allTextContents()
        expect(blogTitles[0]).toContain('Comment configurer et utiliser efficacement l’historique bash')
        expect(blogTitles[1]).toContain('React patterns')

        await viewButtons[1].click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 2')).toBeVisible()
        await page.getByRole('button', { name: 'hide' }).click()
        blogTitles = await page.locator('.blog-title').allTextContents()
        expect(blogTitles[0]).toContain('React patterns')
        expect(blogTitles[1]).toContain('Comment configurer et utiliser efficacement l’historique bash')
      })
    })
  })
})