export default function (plop) {
	plop.setGenerator('page', {
		description: 'Create new page with scripts and styles',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'Enter page name:',
			},
		],
		actions: [
			{
				type: 'add',
				path: 'src/{{name}}.pug',
				template: `extends templates/layouts/layout

block css
	link(rel="stylesheet" href="/styles/pages/{{name}}.scss")

block js
	script(type="module" src="/scripts/pages/{{name}}.js")

block main
				`,
			},
			{
				type: 'add',
				path: 'src/scripts/pages/{{name}}.js',
				template: `console.log('hello from {{name}}.js')`,
			},
			{
				type: 'add',
				path: 'src/styles/pages/{{name}}.scss',
				template: `@use '../mixins';`,
			},
		],
	})
}
