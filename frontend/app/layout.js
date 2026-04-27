import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'Helper4U – Trusted Domestic Help',
  description: 'Find verified maids, nannies, and babysitters near you',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'DM Sans, sans-serif', fontSize: '14px' } }} />
      </body>
    </html>
  )
}
