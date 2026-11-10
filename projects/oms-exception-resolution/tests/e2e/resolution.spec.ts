import { expect, test } from '@playwright/test';

test('investigates, approves a $75 credit, executes, reviews the reply and closes EX-2048', async ({page}) => {
  const views = page.getByRole('navigation', {name: 'Case views'});
  const selectRole = async (name: string) => {
    await page.getByRole('combobox', {name: 'Active role'}).click();
    await page.getByRole('option', {name}).click();
  };
  await page.goto('/');
  await expect(page.getByRole('heading', {name: 'Exception queue'})).toBeVisible();
  await expect(page.getByRole('heading', {name: 'Registered cases'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'Open case EX-2050'})).toBeVisible();
  await expect(page.getByRole('row').filter({hasText: 'EX-2051'})).toContainText('Awaiting supervisor approval');
  await expect(page.getByRole('row').filter({hasText: 'EX-2052'})).toContainText('Review customer response');
  await expect(page.getByRole('link', {name: 'Open case EX-2053'})).toBeVisible();
  await expect(page.getByRole('row').filter({hasText: 'EX-2054'})).toContainText('Review AI recommendations');
  await expect(page.getByRole('row').filter({hasText: 'EX-2055'})).toContainText('Execute resolution');
  await expect(page.getByRole('row').filter({hasText: 'EX-2056'})).toContainText('Review case history');
  const search = page.getByRole('textbox', {name: 'Search exceptions'});
  await search.fill('missing');
  await expect(page.getByText('No cases match this search.')).toBeVisible();
  await page.getByRole('button', {name: 'Clear search'}).click();
  await expect(search).toHaveValue('');
  await search.fill('PB-10245');
  await page.getByRole('link', {name: 'Open case EX-2048'}).click();
  await expect(page.getByRole('heading', {name: 'Delivery delay', exact: true})).toBeVisible();
  await expect(page.getByText('Support phone call')).toBeVisible();
  const productImage = page.getByRole('img', {name: 'Natural oak extendable dining table'});
  await expect(productImage).toBeVisible();
  await expect.poll(() => productImage.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await page.getByRole('link', {name: 'View order details'}).click();
  await expect(page.getByText('Captured', {exact: true})).toBeVisible();
  await page.getByRole('navigation', {name: 'Breadcrumb'}).getByRole('link', {name: 'Exceptions'}).click();
  await expect(page.getByRole('heading', {name: 'Exception queue'})).toBeVisible();
  await expect(page.getByRole('heading', {name: 'Registered cases'})).toBeVisible();
  await page.getByRole('link', {name: 'Open case EX-2048'}).click();
  await expect(page.getByRole('navigation', {name: 'OMS modules'}).getByRole('link', {name: 'Orders', exact: true})).toBeVisible();
  await page.getByRole('button', {name: 'Start AI investigation'}).click();
  await expect(page.getByText('Warehouse fulfillment delay', {exact: true}).first()).toBeVisible();
  await expect(page.getByText('DELIVERY-001', {exact: true})).toBeVisible();
  await page.getByRole('link', {name: 'View investigation'}).click();
  await page.getByRole('button', {name: 'Mark recommendations reviewed'}).click();
  await page.getByText('Goodwill credit', {exact: true}).locator('xpath=../..').getByRole('link', {name: 'Select'}).click();
  await expect(page.getByRole('combobox', {name: 'Resolution action'})).toHaveText('Goodwill credit');
  await page.getByRole('spinbutton', {name: 'Credit amount (USD)'}).fill('75');
  await page.getByRole('textbox', {name: 'Resolution notes'}).fill('Missed original carrier appointment');
  await page.getByRole('button', {name: 'Validate action'}).click();
  await expect(page.getByText('Awaiting approval', {exact: true})).toBeVisible();
  await expect(page.getByRole('button', {name: 'Execute resolution'})).toHaveCount(0);
  await page.getByRole('link', {name: 'Open approval workflow'}).click();
  await expect(page.getByRole('alert')).toHaveText('Awaiting supervisor approval.');
  await selectRole('Supervisor · Marcus Lee');
  await page.getByRole('textbox', {name: 'Supervisor decision notes'}).fill('Approved for the documented delay');
  await page.getByRole('button', {name: 'Approve action'}).click();
  await expect(page.getByText('approved by Marcus Lee.', {exact: false})).toBeVisible();
  await views.getByRole('link', {name: 'Resolution Actions'}).click();
  await expect(page.getByRole('button', {name: 'Execute resolution'})).toBeDisabled();
  await selectRole('Agent · Sarah Chen');
  await page.getByRole('button', {name: 'Execute resolution'}).click();
  await expect(page.getByText('$75 goodwill credit issued', {exact: false})).toBeVisible();
  await page.getByRole('region', {name: 'Next step'}).getByRole('link', {name: 'Review customer response'}).click();
  await page.getByRole('button', {name: 'Generate AI draft'}).click();
  const editor = page.getByRole('textbox', {name: 'Customer message'});
  await expect(editor).toHaveValue(/\$75 goodwill credit issued/);
  await editor.fill('Hi Emma, your $75 goodwill credit has been issued. Thank you for your patience.');
  const send = page.getByRole('button', {name: 'Send to customer'});
  await expect(send).toBeDisabled();
  await page.getByRole('checkbox', {name: /I reviewed this message/}).check();
  await send.click();
  await expect(page.getByText('Message sent', {exact: false})).toBeVisible();
  await page.getByRole('button', {name: 'Close case'}).click();
  await expect(page.getByText('Exception case closed', {exact: true})).toBeVisible();
  await page.reload();
  await expect(page.getByText('Exception case closed', {exact: true})).toBeVisible();
  await expect(page.getByText('Supervisor approval granted', {exact: true})).toBeVisible();
  await expect(page.getByText('Customer notified', {exact: true})).toBeVisible();
  await page.getByRole('combobox', {name: 'Event filter'}).click();
  await page.getByRole('option', {name: 'Investigation only'}).click();
  await expect(page.getByText('AI investigation completed', {exact: true})).toBeVisible();
  await expect(page.getByText('Customer notified', {exact: true})).toHaveCount(0);
});

test('registers a support call and opens the new case for the agent who took it', async ({page}) => {
  await page.goto('/exceptions');
  await expect(page.getByRole('heading', {name: 'Registered cases'})).toBeVisible();
  await expect(page.getByText('PB-10254', {exact: true})).toHaveCount(0);
  await page.getByRole('link', {name: 'Register call'}).click();
  await expect(page.getByRole('heading', {name: 'Register a customer call'})).toBeVisible();
  const notes = 'Customer reported that the scheduled delivery window passed.';
  const search = page.getByRole('searchbox', {name: 'Order or customer'});
  await search.fill('liam.mitchell@example.com');
  await page.getByRole('button', {name: 'Search orders'}).click();
  await expect(page.getByRole('list', {name: 'Matching orders'}).getByRole('listitem')).toHaveCount(2);
  await page.getByRole('button', {name: 'Select order PB-10254'}).click();
  await expect(page.getByText('214 Cedar Lane', {exact: false})).toHaveCount(0);
  await page.getByRole('textbox', {name: /Street number/}).fill('215');
  await page.getByRole('textbox', {name: /ZIP code/}).fill('94114');
  const verify = page.getByRole('button', {name: 'Verify address'});
  await verify.click();
  await expect(page.getByRole('alert')).toContainText('do not match this order');
  await page.getByRole('textbox', {name: /Street number/}).fill('214');
  await verify.click();
  await expect(page.getByText('Address verified', {exact: true})).toBeVisible();
  await expect(page.getByText('214 Cedar Lane, San Francisco, CA 94114', {exact: true})).toBeVisible();
  const submit = page.getByRole('button', {name: 'Create exception case'});
  const name = page.getByRole('textbox', {name: /Customer name/});
  const email = page.getByRole('textbox', {name: /Email/});
  await expect(name).toHaveValue('Liam Mitchell');
  await expect(email).toHaveValue('liam.mitchell@example.com');
  await name.fill('Liam M.');
  await email.fill('liam.confirmed@example.com');
  await page.getByRole('textbox', {name: /Call notes/}).fill(notes);
  await submit.click();
  await expect(page).toHaveURL(/\/exceptions\/EX-2057$/);
  await expect(page.getByText('Call registered. You are handling this case.')).toBeVisible();
  await expect(page.getByText(notes).first()).toBeVisible();
  await page.reload();
  await expect(page.getByText(notes).first()).toBeVisible();
  await expect(page.getByText('Liam M.', {exact: true})).toBeVisible();
  await expect(page.getByText('liam.confirmed@example.com', {exact: true})).toBeVisible();
  await page.getByRole('button', {name: 'Start AI investigation'}).click();
  await expect(page.getByRole('link', {name: 'View investigation'})).toBeVisible();
  await page.getByRole('navigation', {name: 'Breadcrumb'}).getByRole('link', {name: 'Exceptions'}).click();
  const row = page.getByRole('row').filter({hasText: 'EX-2057'});
  await expect(row).toContainText('Sarah Chen');
  await expect(row.getByRole('link', {name: 'Open case EX-2057'})).toBeVisible();
  await page.getByRole('link', {name: 'Register call'}).click();
  await page.getByRole('searchbox', {name: 'Order or customer'}).fill('10254');
  await page.getByRole('button', {name: 'Search orders'}).click();
  await page.getByRole('button', {name: 'Select order PB-10254'}).click();
  await page.getByRole('textbox', {name: /Street number/}).fill('214');
  await page.getByRole('textbox', {name: /ZIP code/}).fill('94114');
  await page.getByRole('button', {name: 'Verify address'}).click();
  await expect(page.getByRole('link', {name: 'Open existing case · EX-2057'})).toBeVisible();
  await expect(page.getByRole('button', {name: 'Create exception case'})).toHaveCount(0);
});


test('opens independent operations panels and keeps case actions in Exceptions', async ({page}) => {
  await page.route('**/api/cases', route => route.abort());
  await page.goto('/dashboard');
  const nav = page.getByRole('navigation', {name: 'OMS modules'});
  for (const [label, title, content] of [
    ['Dashboard', 'Operations dashboard', 'Order volume'],
    ['Orders', 'Orders', 'Order records'],
    ['Inventory', 'Inventory', 'Stock by location'],
    ['Warehouse', 'Warehouse', 'Outbound work orders'],
    ['Delivery', 'Delivery', 'Shipment tracking'],
    ['Reports', 'Reports', 'Carrier performance'],
    ['Settings', 'Settings', 'Workspace profile'],
  ]) {
    const link = nav.getByRole('link', {name: label, exact: true});
    await link.click();
    await expect(link).toHaveAttribute('aria-current', 'page');
    await expect(page.getByRole('heading', {level: 1, name: title, exact: true})).toBeVisible();
    await expect(page.getByRole('heading', {name: content, exact: true})).toBeVisible();
    const main = page.getByRole('main');
    if (['Orders', 'Inventory', 'Warehouse', 'Delivery'].includes(label)) {
      const table = main.getByRole('table', {name: content});
      await expect(table.getByRole('row')).toHaveCount(26);
      await expect(main.getByText(/1–25 of [0-9,]+/)).toBeVisible();
      await main.getByRole('button', {name: /next page/i}).click();
      await expect(main.getByText(/26–50 of [0-9,]+/)).toBeVisible();
    } else {
      await expect(main.getByRole('button')).toHaveCount(0);
    }
    await expect(page.locator('body')).not.toContainText(/\bdemo\b|fiction/i);
  }
  await page.unroute('**/api/cases');
  await nav.getByRole('link', {name: 'Exceptions', exact: true}).click();
  await expect(page.getByRole('heading', {name: 'Exception queue'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'Register call'})).toBeVisible();
});

test('signs out of the local workspace and returns to the same page after signing in', async ({page}) => {
  await page.goto('/dashboard');
  const signOut = page.getByRole('button', {name: 'Sign out'});
  await signOut.click();

  const signIn = page.getByRole('button', {name: 'Sign in', exact: true});
  await expect(signIn).toBeVisible();
  await expect(page.getByRole('combobox', {name: 'Active role'})).toHaveCount(0);

  await page.reload();
  await expect(signIn).toBeVisible();
  await signIn.click();

  await expect(signOut).toBeVisible();
  await expect(page.getByRole('combobox', {name: 'Active role'})).toContainText('Agent · Sarah Chen');
  await expect(page).toHaveURL(/\/dashboard$/);
});
