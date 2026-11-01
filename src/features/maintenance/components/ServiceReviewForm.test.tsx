import {cleanup,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import type {MaintenanceRecord} from '../../../lib/api/maintenance';
import {serviceRecord} from '../../../test/maintenance';
import {ServiceReviewForm} from './ServiceReviewForm';
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
it('prevents typing a comment before the current server review has loaded',async()=>{
 let complete!:(response:Response)=>void;
 vi.stubGlobal('fetch',vi.fn(()=>new Promise<Response>(resolve=>{complete=resolve;})));
 render(<ServiceReviewForm record={{...serviceRecord,visibility:'private'} as MaintenanceRecord}/>);
 expect(screen.getByLabelText('Comentário (opcional)')).toBeDisabled();
 complete(new Response(JSON.stringify({id:1,record_id:42,revision_id:8,stars:4,comment:'Avaliação anterior',comment_hidden:false,review_version:1})));
 expect(await screen.findByDisplayValue('Avaliação anterior')).toBeEnabled();
});
