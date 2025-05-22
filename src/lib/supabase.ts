import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ujkwoccjfnbfunddfvra.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqa3dvY2NqZm5iZnVuZGRmdnJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3ODA4NzEsImV4cCI6MjA2MzM1Njg3MX0.rqhedCpJKJqdRrAEQm4g_3VfUDOss8e0ZbRFa-Lw6J8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY); 