import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const supabase = url && key ? createClient(url, key) : null;

export async function signInWithGoogle() {
  if (!supabase) throw new Error('Sign-in is not configured yet.');
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  if (error) throw error;
}

export async function sendMagicLink(email) {
  if (!supabase) throw new Error('Sign-in is not configured yet.');
  const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
  if (error) throw error;
}

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user || null;
}

export async function bootstrapProfile({ fullName, department, level }) {
  if (!supabase) throw new Error('Sign-in is not configured yet.');
  const { error } = await supabase.rpc('bootstrap_student_profile', { profile_name: fullName, profile_college: 'Lagos State University', profile_campus: 'Ikeja Campus', profile_department: department, profile_level: level });
  if (error) throw error;
}

export async function getOrganizationsAndSubscriptions() {
  if (!supabase) return { organizations: [], subscriptions: [] };
  const user = await getCurrentUser();
  if (!user) return { organizations: [], subscriptions: [] };
  const [{ data: organizations, error: organizationsError }, { data: subscriptions, error: subscriptionsError }] = await Promise.all([supabase.from('organizations').select('id,name,category,type,default_for_all').order('name'), supabase.from('organization_subscriptions').select('organization_id,automatic')]);
  if (organizationsError || subscriptionsError) throw organizationsError || subscriptionsError;
  return { organizations: organizations || [], subscriptions: subscriptions || [] };
}

export async function updateSubscription(organizationId, subscribed) {
  const user = await getCurrentUser();
  if (!supabase || !user) throw new Error('Sign in to manage subscriptions.');
  if (subscribed) { const { error } = await supabase.from('organization_subscriptions').insert({ user_id: user.id, organization_id: organizationId, automatic: false }); if (error && error.code !== '23505') throw error; return; }
  const { error } = await supabase.from('organization_subscriptions').delete().eq('user_id', user.id).eq('organization_id', organizationId).eq('automatic', false); if (error) throw error;
}
