import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
const code=await readFile(new URL('../site/contact.js',import.meta.url),'utf8');
function setup(fetchImpl, valid=true, honeypot='') {
 const button={disabled:true,textContent:''};
 const status={dataset:{},focus(){this.focused=true;}};
 let submit,reset=false; const events=[];
 const values={name:' Test Person ',email:' test@example.com ',phone:' 0123456789 ',message:' Test enquiry ',website:honeypot};
 const form={querySelector:s=>s==='[type="submit"]'?button:status,reportValidity:()=>valid,addEventListener:(name,fn)=>{submit=fn;},reset(){reset=true;}};
 const context={document:{querySelector:()=>form},window:{trackEnquiry:(...args)=>events.push(args)},FormData:class{get(k){return values[k]}},fetch:fetchImpl,AbortController,setTimeout,clearTimeout};
 runInNewContext(code,context);
 return {button,status,events,submit:()=>submit({preventDefault(){}}),wasReset:()=>reset};
}
test('successful enquiry retains the EmailJS contract and records a lead only after success',async()=>{
 let body;
 const state=setup(async(url,options)=>{assert.equal(url,'https://api.emailjs.com/api/v1.0/email/send'); body=JSON.parse(options.body); return {ok:true};});
 await state.submit();
 assert.equal(body.template_params.from_name,'Test Person');
 assert.equal(body.template_params.from_email,'test@example.com');
 assert.equal(body.template_params.phone,'0123456789');
 assert.equal(body.template_params.to_email,'partridgewoodprojects@gmail.com');
 assert.equal(state.status.dataset.state,'success'); assert.ok(state.wasReset());
 assert.deepEqual(state.events,[['generate_lead','contact_form']]); assert.equal(state.button.disabled,false);
});
for(const failure of ['http','network']) test(`${failure} failure preserves the enquiry and enables retry`,async()=>{
 const state=setup(async()=>{if(failure==='network') throw new Error('Offline'); return {ok:false};});
 await state.submit(); assert.equal(state.status.dataset.state,'error'); assert.ok(!state.wasReset()); assert.equal(state.button.disabled,false); assert.equal(state.events.length,0);
});
test('invalid input and honeypot do not contact the email provider',async()=>{
 for(const [valid,honeypot] of [[false,''],[true,'spam']]) {
  let calls=0; const state=setup(async()=>{calls++;return {ok:true};},valid,honeypot);
  await state.submit(); assert.equal(calls,0);
 }
});
test('repeated submit while a request is pending sends only once',async()=>{
 let resolve,calls=0;
 const state=setup(()=>{calls++;return new Promise(r=>{resolve=r;});});
 const pending=state.submit(); await state.submit(); assert.equal(calls,1); assert.equal(state.button.disabled,true);
 resolve({ok:true}); await pending; assert.equal(state.button.disabled,false);
});
