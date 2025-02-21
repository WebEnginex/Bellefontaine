import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')

interface EmailRequest {
  to: string
  templateId: string
  dynamicTemplateData: {
    to_name: string
    message: string
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, templateId, dynamicTemplateData } = await req.json() as EmailRequest

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }],
          dynamic_template_data: dynamicTemplateData,
        }],
        from: { email: 'contact@circuitdebellefontaine.fr' },
        template_id: templateId,
      }),
    })

    if (!response.ok) {
      throw new Error(`SendGrid API error: ${response.statusText}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
