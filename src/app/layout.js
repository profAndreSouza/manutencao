import "./globals.css";

export const metadata = {
  title: "UniSENAI - Gestão de Manutenção e Incidentes",
  description: "Sistema Integrado de Registro de Incidentes e Solicitações de Manutenção para Salas, Equipamentos e Notebooks - UniSENAI Sorocaba",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-red-700 selection:text-white">
        {children}
      </body>
    </html>
  );
}
