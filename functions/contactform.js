const SECRET_KEY = '0x4AAAAAAAK0DzFiLnlD-tu_v4OFoL0pdJ0';

export async function onRequestPost({ request, env }){
	return await submitHandler({ request, env });
}

async function submitHandler({ request, env }) {
	const body = await request.formData();
	// Turnstile injects a token in "cf-turnstile-response".
	const token = body.get('cf-turnstile-response');
	const ip = request.headers.get('CF-Connecting-IP');

	console.log('nombre: ' + body.get('nombre'))
	console.log('email: ' + body.get('email'))
	console.log('telefono: ' + body.get('telefono'))
	console.log('empresa: ' + body.get('empresa'))
	console.log('mensaje: ' + body.get('mensaje'))

	// Validate the token by calling the
	// "/siteverify" API endpoint.
	let formData = new FormData();
	formData.append('secret', SECRET_KEY);
	formData.append('response', token);
	formData.append('remoteip', ip);

	const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
	const result = await fetch(url, {
		body: formData,
		method: 'POST'
	});

	const resultHeaders = new Headers(result.headers)
	resultHeaders.set('Access-Control-Allow-Origin', '*')
	return new Response(result.body, {
		headers: resultHeaders,
		status: result.status,
		statusText: result.statusText
	})
}
