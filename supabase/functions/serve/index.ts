import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    let filePath = url.pathname

    // Serve index.html for all routes (SPA)
    if (filePath === '/' || !filePath.includes('.')) {
      filePath = '/index.html'
    }

    // Remove leading slash
    filePath = filePath.substring(1)

    // Try to serve the file from the dist directory
    const file = await Deno.readFile(`./dist${filePath}`)
    
    // Determine content type
    const contentType = getContentType(filePath)
    
    return new Response(file, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
      },
    })
  } catch (error) {
    // If file not found, serve index.html for SPA routing
    try {
      const indexFile = await Deno.readFile('./dist/index.html')
      return new Response(indexFile, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html',
        },
      })
    } catch {
      return new Response('Not Found', { 
        status: 404,
        headers: corsHeaders,
      })
    }
  }
})

function getContentType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase()
  
  switch (ext) {
    case 'html':
      return 'text/html'
    case 'css':
      return 'text/css'
    case 'js':
      return 'application/javascript'
    case 'json':
      return 'application/json'
    case 'png':
      return 'image/png'
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'gif':
      return 'image/gif'
    case 'svg':
      return 'image/svg+xml'
    case 'ico':
      return 'image/x-icon'
    case 'woff':
      return 'font/woff'
    case 'woff2':
      return 'font/woff2'
    case 'ttf':
      return 'font/ttf'
    case 'eot':
      return 'application/vnd.ms-fontobject'
    default:
      return 'text/plain'
  }
} 