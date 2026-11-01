import {cleanup,render,screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {afterEach,expect,it,vi} from 'vitest';
import {ManagedWorkshopsPage} from './ManagedWorkshopsPage';
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
it('does not claim the user has no approved workshops when loading fails',async()=>{
 vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify({detail:'Indisponível'}),{status:503})));
 render(<MemoryRouter><ManagedWorkshopsPage/></MemoryRouter>);
 expect(await screen.findByRole('alert')).toBeInTheDocument();
 expect(screen.queryByText('Nenhuma representação aprovada.')).not.toBeInTheDocument();
});
