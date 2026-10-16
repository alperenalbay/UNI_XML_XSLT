import { test, expect } from '@playwright/test';

/**
 * Playwright Test Agents (planner/generator/healer) için başlangıç noktası.
 *
 * Planner ajanı bu testi çalıştırıp uygulamayı "kullanılabilir" hale
 * getirir, sonra buradan keşfe başlar. Boş bırakılırsa ajan uygulamayı
 * tanımadan plan üretmeye çalışır ve ilk adımda kaybolur.
 *
 * Uygulama açılışta "karşılama ekranı" ile gelir; bir şablon yüklenmeden
 * önizleme yoktur. Bu yüzden seed, örnek XML + standart XSLT yükleyip
 * önizlemeyi ayağa kaldırır — ajanların keşfedeceği gerçek çalışma
 * durumu budur.
 */
test.describe('Uygulama açılışı', () => {
  test('seed: şablon yükler ve önizlemeyi hazır hale getirir', async ({ page }) => {
    await page.goto('/');

    // Uygulama karşılama ekranıyla açılır: düzenleyici sekmeleri henüz yok.
    // (Aynı metin hem üstteki kütüphane düğmesinde hem aşağıdaki kartta var.)
    await expect(
      page.getByRole('button', { name: /Şablonum Yok \(Varsayılanı Yükle\)/ }).first(),
    ).toBeVisible();

    // Hazır şablonlardan birini yükle. (Düzenleyici sekmeleri ve önizleme
    // ancak bundan sonra görünür.)
    await page.getByRole('button', { name: / Yükle$/ }).first().click();

    await expect(page.getByText('Sistem Hazır')).toBeVisible();
    await expect(page.getByRole('button', { name: /Görsel Tasarımcı/ })).toBeVisible();

    // Önizleme iframe'i bir belge basıyor.
    const preview = page.frameLocator('iframe[title="Fatura Canlı Önizleme"]');
    await expect(preview.locator('body')).toBeVisible();

    // Artık ajanlar bu sayfadan keşfedip test planı çıkarabilir.
  });
});
