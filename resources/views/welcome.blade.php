<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>ØUTSIDER ★ Flor D Asfalto ♱༺༒︎⊰‿̩͙</title>

        <meta property="og:title" content="ØUTSIDER ★ Flor D Asfalto" />
        <meta property="og:description" content="Outsider࣪ ִֶָ☾.݁ᛪ༙ es un colectivo de independientes enfocado en la documentación y realizacion de eventos alternativos, espacio de cultura, arte y sonido desde la periferia." />
        <meta property="og:image" content="{{ asset('img/og-share.jpg') }}" />
        <meta property="og:url" content="{{ url()->current() }}" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ØUTSIDER ★ Flor D Asfalto" />
        <meta name="twitter:description" content="Outsider࣪ ִֶָ☾.݁ᛪ༙ es un colectivo de independientes enfocado en la documentación y realizacion de eventos alternativos, espacio de cultura, arte y sonido desde la periferia." />
        <meta name="twitter:image" content="{{ asset('img/og-share.jpg') }}" />

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        
        @viteReactRefresh
        @vite('resources/js/app.jsx') 
        
        <script src="https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js" crossorigin></script>
        <script src="https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js" crossorigin></script>
        <script src="https://cdn.jsdelivr.net/npm/react-bootstrap@next/dist/react-bootstrap.min.js" crossorigin></script>
        <script>var Alert = ReactBootstrap.Alert;</script>
    </head>
    <body>
        <div id="app"></div>
    </body>
</html>
