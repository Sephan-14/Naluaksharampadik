import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kkmqsbyvwrmpopveavrs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrbXFzYnl2d3JtcG9wdmVhdnJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MTg5MjQsImV4cCI6MjA4Mzk5NDkyNH0.jCEYLvGY1aSi8p5tBBNqMWOu5FqbJrSmo8tFwgpp9Yg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
