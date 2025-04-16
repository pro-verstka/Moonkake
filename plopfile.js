/**
 * Plop generator function
 * @param {import('plop').NodePlopAPI} plop - Plop API instance
 */
export default function (plop) {
	plop.setGenerator('page', {
		description: 'Create new page with scripts and styles (Pug)',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'Enter page name:',
			},
			{
				type: 'checkbox',
				name: 'assets',
				message: 'Add css and/or js for page?',
				choices: [
					{
						name: 'CSS',
						value: 'css',
						checked: true,
					},
					{
						name: 'JS',
						value: 'js',
						checked: true,
					},
				],
			},
		],
		actions: data => {
			const actions = []

			const isCSS = data.assets.includes('css')
			const isJS = data.assets.includes('js')

			actions.push({
				type: 'add',
				path: 'src/{{name}}.pug',
				template: `extends templates/layouts/layout

${
	isCSS
		? `block css
	link(rel="stylesheet" href="/styles/pages/{{name}}.scss")`
		: ''
}

${
	isJS
		? `block js
	script(type="module" src="/scripts/pages/{{name}}.js")`
		: ''
}

block main`,
			})

			if (isJS) {
				actions.push({
					type: 'add',
					path: 'src/scripts/pages/{{name}}.js',
					template: `console.log('hello from {{name}}.js')`,
				})
			}

			if (isCSS) {
				actions.push({
					type: 'add',
					path: 'src/styles/pages/{{name}}.scss',
					template: `@use '../mixins';`,
				})
			}

			return actions
		},
	})

	plop.setGenerator('page-twig', {
		description: 'Create new page with scripts and styles (Twig)',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'Enter page name:',
			},
			{
				type: 'checkbox',
				name: 'assets',
				message: 'Add css and/or js for page?',
				choices: [
					{
						name: 'CSS',
						value: 'css',
						checked: true,
					},
					{
						name: 'JS',
						value: 'js',
						checked: true,
					},
				],
			},
		],
		actions: data => {
			const actions = []

			const isCSS = data.assets.includes('css')
			const isJS = data.assets.includes('js')

			actions.push({
				type: 'add',
				path: 'src/{{name}}.twig',
				template: `{% extends 'templates-twig/layouts/layout.twig' %}

${
	isCSS
		? `{% block css %}
    <link rel="stylesheet" href="/styles/pages/{{name}}.scss">
{% endblock %}`
		: ''
}

${
	isJS
		? `{% block js %}
    <script type="module" src="/scripts/pages/{{name}}.js"></script>
{% endblock %}`
		: ''
}

{% block main %}
{% endblock %}`,
			})

			if (isJS) {
				actions.push({
					type: 'add',
					path: 'src/scripts/pages/{{name}}.js',
					template: `console.log('hello from {{name}}.js')`,
				})
			}

			if (isCSS) {
				actions.push({
					type: 'add',
					path: 'src/styles/pages/{{name}}.scss',
					template: `@use '../mixins';`,
				})
			}

			return actions
		},
	})
}
