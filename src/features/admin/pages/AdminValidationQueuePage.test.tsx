import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {MemoryRouter} from 'react-router-dom';
import {AdminValidationQueuePage} from './AdminValidationQueuePage';
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
it('distinguishes a failed validation queue from an empty queue and allows retry',async()=>{
 let failed=true;
 vi.stubGlobal('fetch',vi.fn(async()=>failed?new Response(JSON.stringify({detail:'Temporariamente indisponível'}),{status:503}):new Response('[]')));
 render(<MemoryRouter><AdminValidationQueuePage/></MemoryRouter>);
 expect(await screen.findByRole('alert')).toBeInTheDocument();
 expect(screen.queryByText('Nenhuma validação pendente')).not.toBeInTheDocument();
 failed=false;fireEvent.click(screen.getByRole('button',{name:'Tentar novamente'}));
 expect(await screen.findByText('Nenhuma validação pendente')).toBeInTheDocument();
 expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
