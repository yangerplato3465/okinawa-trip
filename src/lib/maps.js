// Google Maps links for activities and hotels.
// A pasted share link wins; otherwise we fall back to a search for the name,
// so every place gets a working map link without any extra typing.

export function mapHref(name, url) {
  if (url) return url
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`
}

// Turns whatever was pasted into a usable link.
// Returns '' for empty input and null when it doesn't look like a link.
// Share sheets often paste "Place name https://maps.app.goo.gl/…", so we pull the URL out.
export function cleanMapUrl(input) {
  const text = input.trim()
  if (!text) return ''
  const found = text.match(/https?:\/\/\S+/i)
  if (found) return found[0]
  if (/^[\w-]+(\.[\w-]+)+\/\S*$/.test(text)) return `https://${text}`
  return null
}
