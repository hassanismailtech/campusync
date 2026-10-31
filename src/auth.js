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
