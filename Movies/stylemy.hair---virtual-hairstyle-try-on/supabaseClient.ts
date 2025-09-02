import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace with your project's URL and Anon Key
const supabaseUrl = 'https://nnegorxextteqoyzwzsi.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uZWdvcnhleHR0ZXFveXp3enNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1MzQzNzYsImV4cCI6MjA3MjExMDM3Nn0.guu7T0NUn6kofufe1xcpg3saTc2_dAKwjin4ZVyyx98';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are required.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
