import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {afterEach,expect,it,vi} from 'vitest';
import {SessionContext} from '../../../lib/auth/SessionContext';
import {participant} from '../../../test/fixtures';
import {PilotStatusPage} from './PilotStatusPage';
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
it('announces profile save failure as an error rather than a success status',async()=>{
 vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify({detail:'Indisponível'}),{status:503})));
 render(<MemoryRouter><SessionContext.Provider value={{user:{...participant,phone:'11999990000',participation_status:'pending'},status:'authenticated',error:null,refresh:vi.fn(async()=>null),logout:vi.fn()}}><PilotStatusPage/></SessionContext.Provider></MemoryRouter>);
 fireEvent.click(screen.getByRole('button',{name:'Salvar perfil'}));
 expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível atualizar o perfil.');
});
