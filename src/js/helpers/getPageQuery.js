export default function getPageQuery(key) {
	if (!window.location.search) return

	const query = {}

	let tmp
	let q = window.location.search
	q = q.slice(1)
	q = q.split('&')

	for (let i = 0; i < q.length; i += 1) {
		tmp = q[i].split('=')
		query[tmp[0]] = decodeURIComponent(tmp[1])
	}

	if (key) return query[key]

	return query
}