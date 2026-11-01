import {cleanup,render,screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {afterEach,expect,it,vi} from 'vitest';
import {ServiceDisputesPage} from './ServiceDisputesPage';
import {ServiceReviewsPage} from './ServiceReviewsPage';
import {ServiceAssociationsPage} from './ServiceAssociationsPage';
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
it.each([[ServiceDisputesPage,'Nenhuma contestação aberta.'],[ServiceReviewsPage,'Nenhum comentário para análise.'],[ServiceAssociationsPage,'Nenhuma associação pendente.']] as const)('does not report an empty moderation queue after a failed request (%s)',async(Component,empty)=>{
 vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify({detail:'Fila indisponível'}),{status:503})));
 render(<MemoryRouter><Component/></MemoryRouter>);
 expect(await screen.findByRole('alert')).toBeInTheDocument();
 expect(screen.queryByText(empty)).not.toBeInTheDocument();
});
