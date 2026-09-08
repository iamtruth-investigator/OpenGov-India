const SUPABASE_URL = 'https://xtlunrelrirjmwrvqlhz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_RFrH8h6wZbQk7_Cq_zeTRw_IaruRJhF';
let supabaseClient = null;

function initSupabase(){
  if(!window.supabase)return null;
  if(!supabaseClient)supabaseClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
  return supabaseClient;
}
function authMessage(message,type='info'){
  const el=document.getElementById('authMessage');
  if(!el)return;
  el.textContent=message;
  el.className=`auth-message ${type}`;
}
function setBusy(busy){
  document.querySelectorAll('[data-auth-submit]').forEach(btn=>{
    btn.disabled=busy;
    btn.dataset.originalText ||= btn.textContent;
    btn.textContent=busy?'Please wait…':btn.dataset.originalText;
  });
}
function safeNext(){
  const next=new URLSearchParams(location.search).get('next');
  return next && /^\/[A-Za-z0-9._/-]+$/.test(next) ? next : 'dashboard.html';
}
async function signIn(){
  const client=initSupabase(),email=document.getElementById('email')?.value.trim(),password=document.getElementById('password')?.value;
  if(!client)return authMessage('Authentication service could not load. Please try again.','error');
  if(!email||!password)return authMessage('Enter your email and password.','error');
  setBusy(true); const {error}=await client.auth.signInWithPassword({email,password}); setBusy(false);
  if(error)return authMessage(error.message,'error');
  location.href=safeNext();
}
async function signUp(){
  const client=initSupabase(),email=document.getElementById('email')?.value.trim(),password=document.getElementById('password')?.value;
  if(!client)return authMessage('Authentication service could not load. Please try again.','error');
  if(!email||!password)return authMessage('Enter an email and password first.','error');
  if(password.length<8)return authMessage('Password must be at least 8 characters.','error');
  setBusy(true); const {data,error}=await client.auth.signUp({email,password}); setBusy(false);
  if(error)return authMessage(error.message,'error');
  if(data.session){location.href='dashboard.html';}
  else authMessage('Account created. Check your email to confirm your account, then sign in.','success');
}
async function resetPassword(){
  const client=initSupabase(),email=document.getElementById('email')?.value.trim();
  if(!client)return authMessage('Authentication service could not load. Please try again.','error');
  if(!email)return authMessage('Enter your email first.','error');
  setBusy(true); const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:`${location.origin}/login.html?reset=1`}); setBusy(false);
  if(error)return authMessage(error.message,'error');
  authMessage('Password reset email sent. Check your inbox.','success');
}
async function updatePassword(){
  const client=initSupabase(),password=document.getElementById('newPassword')?.value,confirm=document.getElementById('confirmPassword')?.value;
  if(!client)return authMessage('Authentication service could not load. Please try again.','error');
  if(!password||password.length<8)return authMessage('New password must be at least 8 characters.','error');
  if(password!==confirm)return authMessage('Passwords do not match.','error');
  setBusy(true); const {error}=await client.auth.updateUser({password}); setBusy(false);
  if(error)return authMessage(error.message,'error');
  await client.auth.signOut();
  authMessage('Password updated. You can now sign in with your new password.','success');
  document.getElementById('resetForm')?.classList.add('hidden');
  document.getElementById('loginForm')?.classList.remove('hidden');
}
async function signOut(){const client=initSupabase();if(client)await client.auth.signOut();location.href='login.html';}
async function requireAuth(){
  const client=initSupabase(); if(!client)return false;
  const {data:{session}}=await client.auth.getSession();
  if(!session){location.href=`login.html?next=${encodeURIComponent(location.pathname.split('/').pop()||'dashboard.html')}`;return false;}
  const {data:roleRow}=await client.from('opengov_user_roles').select('role,department').eq('user_id',session.user.id).maybeSingle();
  const role=roleRow?.role||'citizen';
  document.querySelectorAll('[data-user-email]').forEach(el=>el.textContent=session.user.email||'Signed-in user');
  document.querySelectorAll('[data-user-role]').forEach(el=>el.textContent=role);
  const protectedView=document.body.dataset.authRoleRequired==='true';
  if(protectedView&&!['reviewer','officer','admin'].includes(role)){
    const box=document.getElementById('accessDenied');
    if(box)box.hidden=false;
    document.querySelector('main section')?.setAttribute('aria-hidden','true');
    return false;
  }
  return true;
}
async function initLogin(){
  const client=initSupabase(); if(!client)return authMessage('Authentication service could not load. Please try again.','error');
  const params=new URLSearchParams(location.search),reset=params.has('reset');
  const {data:{session}}=await client.auth.getSession();
  if(reset&&session){showResetMode();authMessage('Enter a new password for your account.','info');return;}
  if(session&&!reset){location.href=safeNext();return;}
  if(reset)authMessage('Open the reset link from your email to continue.','info');
  client.auth.onAuthStateChange((event)=>{if(event==='PASSWORD_RECOVERY')showResetMode();});
}
function showResetMode(){
  document.getElementById('loginForm')?.classList.add('hidden');
  document.getElementById('resetForm')?.classList.remove('hidden');
  document.getElementById('authTitle')?.replaceChildren(document.createTextNode('Set a new password'));
}
window.signIn=signIn;window.signUp=signUp;window.resetPassword=resetPassword;window.updatePassword=updatePassword;window.signOut=signOut;window.requireAuth=requireAuth;window.initLogin=initLogin;
document.addEventListener('DOMContentLoaded',()=>{if(document.body.dataset.authPage==='login')initLogin();});
