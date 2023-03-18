import sass from 'sass'
import postcss from 'postcss'

function isBlockIgnored(ruleOrDeclaration) {
	const rule = ruleOrDeclaration.selector ? ruleOrDeclaration : ruleOrDeclaration.parent
	return /(!\s*)?postcss-custom-properties:\s*off\b/i.test(rule.toString())
}

const htmlSelectorRegExp = /^html$/i
const rootSelectorRegExp = /^:root$/i
const customPropertyRegExp = /^--[A-z][\w-]*$/ // whether the node is an html or :root rule
const isHtmlRule = node => node.type === 'rule' && htmlSelectorRegExp.test(node.selector) && Object(node.nodes).length
const isRootRule = node => node.type === 'rule' && rootSelectorRegExp.test(node.selector) && Object(node.nodes).length // whether the node is an custom property
const isCustomDecl = node => node.type === 'decl' && customPropertyRegExp.test(node.prop) // whether the node is a parent without children
const isEmptyParent = node => Object(node.nodes).length === 0

function getCustomPropertiesFromRoot(root, opts = {}) {
	// initialize custom selectors
	const customPropertiesFromHtmlElement = {}
	const customPropertiesFromRootPseudo = {} // for each html or :root rule

	root.nodes.slice().forEach(rule => {
		const customPropertiesObject = isHtmlRule(rule)
			? customPropertiesFromHtmlElement
			: isRootRule(rule)
			? customPropertiesFromRootPseudo
			: null // for each custom property

		if (customPropertiesObject) {
			rule.nodes.slice().forEach(decl => {
				if (isCustomDecl(decl) && !isBlockIgnored(decl)) {
					// customPropertiesObject[decl.prop] = parse(decl.value).nodes // conditionally remove the custom property declaration
					customPropertiesObject[decl.prop] = decl.value

					if (!opts.preserve) {
						decl.remove()
					}
				}
			}) // conditionally remove the empty html or :root rule

			if (!opts.preserve && isEmptyParent(rule) && !isBlockIgnored(rule)) {
				rule.remove()
			}
		}
	}) // return all custom properties, preferring :root properties over html properties

	return Object.assign({}, customPropertiesFromHtmlElement, customPropertiesFromRootPseudo)
}

export const parseSassToObject = file => {
	const raw = sass.renderSync({
		file
	})

	const node = postcss.parse(raw.css.toString())

	return getCustomPropertiesFromRoot(node)
}
