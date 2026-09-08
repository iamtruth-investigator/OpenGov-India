const SUPABASE_URL = 'https://xtlunrelrirjmwrvqlhz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_RFrH8h6wZbQk7_Cq_zeTRw_IaruRJhF';

let supabaseClient = null;

function initSupabase() {
  if (!window.supabase) return null;
  if (!supabaseClient) supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  return supabaseClient;
}

function authMessage(message, type='info') {
  const el = document.getElementById('authMessage');
  if (!el) return;
  el.textContent = message;
  el.className = `auth-message ${type}`;
}

function setBusy(busy) {
  document.querySelectorAll('[data-auth-submit]').forEach(btn => {
    btn.disabled = busy;
    btn.dataset.originalText ||= btn.textContent;
    btn.textContent = busy ? 'Please wait…' : btn.dataset.originalText;
  });
}

async function signIn() {
  const client = initSupabase();
  const email = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value;
  if (!client) return authMessage('Authentication service could not load. Please try again.', 'error');
  if (!email || !password) return authMessage('Enter your email and password.', 'error');
  setBusy(true);
  const { error } = await client.auth.signInWithPassword({ email, password });
  setBusy(false);
  if (error) return authMessage(error.message, 'error');
  const next = new URLSearchParams(location.search).get('next');
  location.href = next && next.startsWith('/') ? next : 'dashboard.html';
}

async function signUp() {
  const client = initSupabase();
  const email = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value;
  if (!client) return authMessage('Authentication service could not load. Please try again.', 'error');
  if (!email || !password) return authMessage('Enter an email and password first.', 'error');
  if (password.length < 6) return authMessage('Password must be at least 6 characters.', 'error');
  setBusy(true);
  const { data, error } = await client.auth.signUp({ email, password });
  setBusy(false);
  if (error) return authMessage(error.message, 'error');
  if (data.session) {
    authMessage('Account created. Signing you in…', 'success');
    location.href = 'dashboard.html';
  } else {
    authMessage('Account created. Check your email to confirm your account, then sign in.', 'success');
  }
}

async function resetPassword() {
  const client = initSupabase();
  const email = document.getElementById('email')?.value.trim();
  if (!client) return authMessage('Authentication service could not load. Please try again.', 'error');
  if (!email) return authMessage('Enter your email first.', 'error');
  setBusy(true);
  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: `${location.origin}/login.html?reset=1`
  });
  setBusy(false);
  if (error) return authMessage(error.message, 'error');
  authMessage('Password reset email sent. Check your inbox.', 'success');
}

async function signOut() {
  const client = initSupabase();
  if (client) await client.auth.signOut();
  location.href = 'login.html';
}

async function requireAuth() {
  const client = initSupabase();
  if (!client) return false;
  const { data: { session } } = await client.auth.getSession();
  if (!session) {
    location.href = `login.html?next=${encodeURIComponent(location.pathname.split('/').pop() || 'dashboard.html')}`;
    return false;
  }
  const email = session.user.email || 'Signed-in user';
  document.querySelectorAll('[data-user-email]').forEach(el => el.textContent = email);
  return true;
}

async function initLogin() {
  const client = initSupabase();
  if (!client) return authMessage('Authentication service could not load. Please try again.', 'error');
  const { data: { session } } = await client.auth.getSession();
  if (session && !new URLSearchParams(location.search).has('reset')) {
    location.href = 'dashboard.html';
    return;
  }
  if (new URLSearchParams(location.search).has('reset')) {
    authMessage('If you requested a reset, check your email for the next step.', 'info');
  }
}

window.signIn = signIn;
window.signUp = signUp;
window.resetPassword = resetPassword;
window.signOut = signOut;
window.requireAuth = requireAuth;

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.authPage === 'login') initLogin();
});
