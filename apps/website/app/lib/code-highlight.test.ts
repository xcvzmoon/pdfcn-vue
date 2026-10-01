import { codeToHtml } from 'shiki/bundle/web';
import { expect, test } from 'vite-plus/test';

test('escapes untrusted markup before code is inserted as HTML', async () => {
  const html = await codeToHtml('<script>alert("x")</script><img src=x onerror=alert(1)>', {
    lang: 'vue',
    theme: 'github-light',
  });
  expect(html).not.toContain('<script>');
  expect(html).not.toContain('<img ');
  expect(html).toMatch(/&(?:lt|#x3c|#60);/i);
});
