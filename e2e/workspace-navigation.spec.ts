import {test,expect} from '@playwright/test';
import {asUser} from './helpers';
test('authenticated navigation fits all viewports and mobile menu supports keyboard',async({page})=>{
 await asUser(page,'admin@example.com','/admin/participantes');
 for(const width of [320,390,768,1024,1440]){
  await page.setViewportSize({width,height:900});
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  if(width<960){
   const trigger=page.getByRole('button',{name:'Abrir menu'});await trigger.click();
   const link=page.getByRole('navigation',{name:'Navegação admin'}).getByRole('link',{name:'Serviços',exact:true});
   await link.focus();await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
   await expect(trigger).toHaveAttribute('aria-expanded','false');
   await trigger.click();await link.click();await expect(page).toHaveURL(/\/admin\/servicos$/);
   await expect(trigger).toHaveAttribute('aria-expanded','false');
  }
 }
 await page.getByRole('button',{name:'Sair da conta'}).click();await expect(page).toHaveURL(/\/entrar$/);
 expect(await page.evaluate(()=>localStorage.getItem('nota_tecnica_token'))).toBeNull();
});
