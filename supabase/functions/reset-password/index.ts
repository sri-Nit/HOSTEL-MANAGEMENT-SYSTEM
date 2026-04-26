import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, securityAnswer, newPassword } = await req.json()

    // Initialize Supabase client with Service Role Key for admin access
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // 1. Find the user by email to get their ID
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers()
    if (userError) throw userError

    const user = userData.users.find(u => u.email === email)
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 2. Check if the security answer matches in the profiles table
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('security_answer')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (profile.security_answer?.toLowerCase() !== securityAnswer?.toLowerCase()) {
      return new Response(JSON.stringify({ error: 'Incorrect security answer' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 3. Update the user's password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    )

    if (updateError) throw updateError

    return new Response(JSON.stringify({ message: 'Password reset successful' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})