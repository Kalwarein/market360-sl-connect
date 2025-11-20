import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface VerifyOtpRequest {
  user_id: string;
  otp_code: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, otp_code }: VerifyOtpRequest = await req.json();

    if (!user_id || !otp_code) {
      throw new Error('User ID and OTP code are required');
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get stored OTP and expiration
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('phone_verification_code, phone_verification_expires_at, phone')
      .eq('id', user_id)
      .single();

    if (fetchError || !profile) {
      throw new Error('User profile not found');
    }

    // Check if OTP has expired
    const expiresAt = new Date(profile.phone_verification_expires_at);
    const now = new Date();

    if (now > expiresAt) {
      return new Response(
        JSON.stringify({ success: false, error: 'OTP has expired. Please request a new code.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Verify OTP code
    if (profile.phone_verification_code !== otp_code) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid verification code' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Mark phone as verified and clear OTP data
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        phone_verified: true,
        phone_verification_code: null,
        phone_verification_expires_at: null
      })
      .eq('id', user_id);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw new Error('Failed to verify phone number');
    }

    console.log('Phone verified successfully for user:', user_id);

    return new Response(
      JSON.stringify({ success: true, message: 'Phone number verified successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error in verify-otp function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
