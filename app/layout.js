import './globals.css'

export const metadata = {
  title: '🇰🇷 Seoul Travel Spots',
  description: 'Seoul travel spots for May 1-6, 2026',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ colorScheme: 'light' }}>
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        <meta name="color-scheme" content="light" />
      </head>
      <body>{children}</body>
    </html>
  )
}