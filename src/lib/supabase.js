import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xllgpvftjfalbgkergyp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_nzc7SMRHOGLu3h1ZvKVGkQ_zZPwndm3';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);