export function generateTemplate(templates) {
	let html = ''

	for (const [index, tpl] of templates) {
		const [name] = tpl.split('.')
		html += `<li><a href="${name}.html">${String(index + 1).padStart(2, '0')}. ${name}</a></li>`
	}

	return `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width,initial-scale=1">
		<style>
			* {
				margin: 0; padding: 0;
			}

			body {
				background: #fafafa;
				font-size: 1.2rem;
				font-family: Arial, Helvetica, sans-serif;
				font-variant-numeric: tabular-nums;
			}

			a {
				padding: 1rem 1.2rem;
				display: block;
				color: #4846FE;
				text-decoration: none;
				border-bottom: 1px solid #f0f0f0;
				text-transform: capitalize;
			}

			a:visited {
				color: #333;
			}

			a:hover {
				background: #4846FE;
				color: #fff;
			}
		</style>
	</head>
	<body>
		<ul>${html}</ul>
	</body>
</html>`
}
