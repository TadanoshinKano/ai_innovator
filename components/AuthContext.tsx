// // components/AuthContext.tsx

// 'use client'

// import React, { createContext, useState, useEffect, useContext } from 'react'
// import { supabase } from '../app/lib/supabase'
// import { User } from '@supabase/supabase-js'

// type AuthContextType = {
//   user: User | null
//   loading: boolean
// }

// const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const getUser = async () => {
//       try {
//         const { data: { user } } = await supabase.auth.getUser()
//         setUser(user)
//       } catch (error) {
//         console.error("Error fetching user:", error)
//       } finally {
//         setLoading(false)
//       }
//     }
//     getUser()

//     const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
//       try {
//         setUser(session?.user ?? null)
//       } catch (error) {
//         console.error("Error in auth state change:", error)
//       } finally {
//         setLoading(false)
//       }
//     })

//     return () => {
//       authListener.subscription.unsubscribe()
//     }
//   }, [])

//   return (
//     <AuthContext.Provider value={{ user, loading }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => useContext(AuthContext)

