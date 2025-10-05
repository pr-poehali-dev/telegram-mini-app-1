import json
import os
import base64
import requests
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate AI photos using FLUX or Stable Diffusion models
    Args: event with httpMethod, body (model, prompt, image_url, style)
    Returns: HTTP response with generated image URL
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    fal_api_key = os.environ.get('FAL_API_KEY')
    if not fal_api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'FAL_API_KEY not configured'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    model = body_data.get('model', 'flux')
    prompt = body_data.get('prompt', '')
    image_base64 = body_data.get('image', '')
    style = body_data.get('style', '')
    
    if not prompt:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Prompt is required'})
        }
    
    full_prompt = f"{style}, {prompt}" if style else prompt
    
    if model == 'flux':
        endpoint = 'https://fal.run/fal-ai/flux-pro'
        payload = {
            'prompt': full_prompt,
            'image_size': 'square_hd',
            'num_inference_steps': 28,
            'guidance_scale': 3.5,
            'num_images': 1,
            'enable_safety_checker': True
        }
        
        if image_base64:
            payload['image_url'] = f"data:image/jpeg;base64,{image_base64}"
            payload['prompt'] = f"Transform this person: {full_prompt}"
    else:
        endpoint = 'https://fal.run/fal-ai/fast-sdxl'
        payload = {
            'prompt': full_prompt,
            'image_size': 'square_hd',
            'num_inference_steps': 25,
            'guidance_scale': 7.5,
            'num_images': 1
        }
        
        if image_base64:
            payload['image_url'] = f"data:image/jpeg;base64,{image_base64}"
    
    headers = {
        'Authorization': f'Key {fal_api_key}',
        'Content-Type': 'application/json'
    }
    
    response = requests.post(endpoint, json=payload, headers=headers, timeout=60)
    
    if response.status_code != 200:
        return {
            'statusCode': response.status_code,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Generation failed',
                'details': response.text
            })
        }
    
    result = response.json()
    image_url = result.get('images', [{}])[0].get('url', '')
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'image_url': image_url,
            'model': model,
            'prompt': full_prompt
        })
    }
