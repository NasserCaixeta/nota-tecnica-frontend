import {expect,test,type Page} from '@playwright/test';
import {asUser} from './helpers';
import {adminRoutes,uiFixtures} from './fixtures/admin-ui';
test.use({locale:'pt-BR',timezoneId:'UTC'});
async function fixtures(page:Page,overrides:Record<string,unknown>={}) {
 const data={...uiFixtures,...overrides};const unexpected:string[]=[];
 await page.route('**/api/v1/**',async route=>{
  const path=new URL(route.request().url()).pathname.replace('/api/v1','');
  if(route.request().method()!=='GET'||!(path in data)){
   unexpected.push(route.request().method()+' '+path);
   await route.fulfill({status:404,json:{detail:'Fixture não definida'}});return;
  }
  await route.fulfill({json:data[path]});
 });
 await asUser(page,'admin@example.com','/admin/participantes');
 return unexpected;
}
const sentinels=[['nova-oficina','/app/oficinas/nova'],['garagem','/app/garagem'],['conta','/app/conta'],['landing','/'],['documentos','/app/garagem/11/documentos'],['reivindicacao','/app/oficinas/reivindicar']] as const;
for(const [width,height] of [[320,800],[390,844],[768,1024],[1024,768],[1440,1000]]){
 test(`populated visual matrix at ${width}px`,async({page},info)=>{
  test.setTimeout(90000);await page.setViewportSize({width,height});
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  const unexpected=await fixtures(page);
  for(const [name,path] of [...adminRoutes,...sentinels]){
   await page.goto(path,{waitUntil:"networkidle"});await expect(page.getByRole('heading',{level:1})).toBeVisible();
   await expect(page.getByText('Verificando sua sessão...')).toHaveCount(0);
   await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   await expect(page.getByRole('alert')).toHaveCount(0);
   await page.screenshot({path:info.outputPath(`${name}-${width}.png`),fullPage:true});
   expect(unexpected,'unconfigured API requests').toEqual([]);
   expect(errors,'browser errors including React reconciliation warnings').toEqual([]);
  }
 });
}
test('a failed queue can recover to an empty state without claiming an empty result first',async({page},info)=>{
 await fixtures(page);
 await page.route('**/api/v1/admin/garage/vehicle-links/pending',route=>route.fulfill({status:503,json:{detail:'Indisponível'}}));
 await page.goto('/admin/validacoes');await expect(page.getByRole('alert')).toBeVisible();
 await expect(page.getByText('Nenhuma validação pendente')).toHaveCount(0);
 await page.screenshot({path:info.outputPath('error.png'),fullPage:true});
 await page.unroute('**/api/v1/admin/garage/vehicle-links/pending');
 await page.route('**/api/v1/admin/garage/vehicle-links/pending',route=>route.fulfill({json:[]}));
 await page.getByRole('button',{name:'Tentar novamente'}).click();
 await expect(page.getByText('Nenhuma validação pendente')).toBeVisible();
 await page.screenshot({path:info.outputPath('empty.png'),fullPage:true});
});
test('a document detail announces loading until the current request completes',async({page},info)=>{
 await fixtures(page);let finish!:()=>void;const gate=new Promise<void>(resolve=>{finish=resolve;});
 await page.route('**/api/v1/admin/garage/vehicle-links/11',async route=>{await gate;await route.fulfill({json:uiFixtures['/admin/garage/vehicle-links/11']});});
 await page.goto('/admin/validacoes/11');
 try {await expect(page.getByRole('status')).toContainText('Carregando validação');await page.screenshot({path:info.outputPath('loading.png'),fullPage:true});}
 finally {finish();}
 await expect(page.getByRole('heading',{name:'Análise do vínculo veicular'})).toBeVisible();
});
test('a busy decision cannot be repeated and conflict asks for a refresh',async({page},info)=>{
 await fixtures(page);let finish!:()=>void;let writes=0;const gate=new Promise<void>(resolve=>{finish=resolve;});
 await page.route('**/api/v1/admin/participants/2/review',async route=>{writes++;await gate;await route.fulfill({status:409,json:{detail:'A versão foi alterada por outro administrador. Atualize a fila.'}});});
 const label='Justificativa para '+uiFixtures['/admin/participants'][0].full_name;
 await page.getByLabel(label).fill('Documentação de testes conferida');
 const approve=page.getByRole('button',{name:'Aprovar '+uiFixtures['/admin/participants'][0].full_name,exact:true});
 await approve.click();await expect(approve).toBeDisabled();
 await approve.evaluate(node=>(node as HTMLButtonElement).click());
 await page.screenshot({path:info.outputPath('busy.png'),fullPage:true});finish();
 await expect(page.getByRole('alert')).toContainText('A versão foi alterada');expect(writes).toBe(1);
 await expect(page.getByRole('button',{name:'Atualizar fila'})).toBeVisible();
 await page.screenshot({path:info.outputPath('conflict.png'),fullPage:true});
});
test('disabled payments and expired order present no active purchase or history benefit',async({page})=>{
 await fixtures(page);await page.goto('/app/assinatura');
 await expect(page.getByText('Checkout de testes indisponível: configuração pendente.')).toBeVisible();
 await expect(page.getByRole('button',{name:'Iniciar assinatura de testes'})).toHaveCount(0);
 await page.goto('/app/compras/visual-order');await expect(page.getByText('O período deste benefício terminou ou não está disponível. Consulte seu acesso atual.')).toBeVisible();
 await expect(page.getByRole('link',{name:'Ver histórico',exact:true})).toHaveCount(0);
});
test('keyboard focus and 200 percent equivalent reflow remain usable',async({page},info)=>{
 await fixtures(page);await page.setViewportSize({width:720,height:500});await page.goto('/admin/participantes');
 const filter=page.getByRole('combobox',{name:'Situação'});await filter.focus();
 const focus=await filter.evaluate(el=>({width:parseFloat(getComputedStyle(el).outlineWidth),style:getComputedStyle(el).outlineStyle}));
 expect(focus.width).toBeGreaterThanOrEqual(2);expect(focus.style).not.toBe('none');
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:info.outputPath('reflow-720.png'),fullPage:true});
});
test('short mobile pages begin immediately below navigation',async({page})=>{
 await fixtures(page);await page.setViewportSize({width:768,height:1024});await page.goto('/admin/associacoes');
 await expect(page.getByRole('heading',{name:'Associações de atendimentos'})).toBeVisible();
 const header=await page.getByRole('banner').boundingBox();const main=await page.getByRole('main').boundingBox();
 expect(main!.y-header!.y-header!.height,'unintended blank space before content').toBeLessThanOrEqual(1);
});
