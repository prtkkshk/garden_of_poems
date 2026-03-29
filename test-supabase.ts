import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://stwmdjbajgppbsipnalo.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0d21kamJhamdwcGJzaXBuYWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2ODY5NDUsImV4cCI6MjA5MDI2Mjk0NX0.Etv7Y2l86R53Vcf6QPTtYxcTAqmIN0_Vn0FfQ888-wQ'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('Testing Supabase connection...')
  try {
    const { data, error } = await supabase.from('poems').select('*').limit(1)
    if (error) {
      console.error('Supabase error:', error.message)
      console.error('Details:', error)
    } else {
      console.log('Connection successful! Data:', data)
    }
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

testConnection()
