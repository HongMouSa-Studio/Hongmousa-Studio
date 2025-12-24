/* body.is-auth (Kui ê bāng-chām teng-ji̍p chōng-thài it-tì) */
import { supabase } from './auth.js'

supabase.auth.onAuthStateChange((_event, session) => {
  if (session) {
    document.body.classList.add('is-auth')
  } else {
    document.body.classList.remove('is-auth')
  }
})
