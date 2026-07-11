export const SITE = {
  name: "Sinar",
  tagline: "ချစ်စရာ ဝတ်စုံလေးများ",
  facebookPageId: "61584569241849",
  facebookUrl: "https://www.facebook.com/profile.php?id=61584569241849",
  phone: "+959790543312",
  viber: "+959896208413",
  whatsapp: "+959790543312",
}

export function messengerUrl(productName: string) {
  const msg = encodeURIComponent(`မင်္ဂလာပါ! "${productName}" အကြောင်း မေးမြန်းချင်ပါတယ် 🛍️`)
  return `https://m.me/${SITE.facebookPageId}?text=${msg}`
}

// Viber deep-links via `viber://chat?number=` only work when the number is
// already saved in the visitor's contacts (otherwise Viber says "request
// unavailable"), and third-party redirectors like msng.link are unreliable.
// `viber://add?number=` opens Viber's Add Contact screen with the shop number
// pre-filled — works for everyone, one tap from there to chat.
export function viberLink() {
  const num = SITE.viber.replace(/\D/g, "")
  return `viber://add?number=${num}`
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function viberUrl(_productName?: string) {
  return viberLink()
}

export function whatsappUrl(productName: string) {
  const msg = encodeURIComponent(`မင်္ဂလာပါ! "${productName}" အကြောင်း မေးမြန်းချင်ပါတယ် 🛍️`)
  const num = SITE.whatsapp.replace(/\D/g, "")
  return `https://wa.me/${num}?text=${msg}`
}
