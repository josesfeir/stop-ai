# Bloqueador IA

Extensión para navegadores basados en Chromium (Chrome, Edge, Brave, Opera, Vivaldi) que bloquea el contenido generado por IA en:

- YouTube (incluye Shorts y la página del video)
- TikTok
- Facebook
- Instagram
- ReelShort
- X

## Cómo detecta

| Método | Descripción |
|---|---|
| Etiquetas oficiales | "Contenido alterado o sintético", "AI-generated", "Info de IA", "Made with AI", etc. |
| Hashtags | #ai, #aiart, #sora, #midjourney, #veo3, #klingai, #iagenerativa, etc. |
| Palabras clave | Lista propia editable desde el popup |
| Cuentas | Lista negra de canales y usuarios editable desde el popup |

El contenido de IA que no está etiquetado ni tiene esas señales no se detecta.

## Modos

- **Difuminar**: tapa el contenido con un aviso y un botón "Mostrar".
- **Ocultar**: lo elimina del feed. En feeds de video a pantalla completa (TikTok, Shorts, Reels) se difumina siempre.

Los videos bloqueados se pausan y no se reproducen solos.

## Instalación (modo desarrollador)

1. Descarga o clona este repositorio.
2. Abre la página de extensiones:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`
3. Activa **Modo de desarrollador**.
4. Pulsa **Cargar descomprimida** y elige la carpeta del repositorio.

## Estructura

```
manifest.json        Manifest V3
src/rules.js         Etiquetas, hashtags, selectores por plataforma y configuración por defecto
src/content.js       Motor de detección y bloqueo
src/content.css      Estilos del bloqueo
popup/               Interfaz de configuración
icons/               Íconos
```

Para añadir una plataforma o actualizar selectores cuando una red social cambia su diseño, edita `PLATFORMS` en `src/rules.js` y añade el dominio a `matches` en `manifest.json`.

## Publicación

| Tienda | Costo |
|---|---|
| Chrome Web Store | 5 USD (pago único) |
| Edge Add-ons | Gratis |

Opera, Brave y Vivaldi instalan desde la Chrome Web Store.

## Donaciones

Si te sirve, puedes apoyar el proyecto:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?logo=buymeacoffee&logoColor=000)](https://buymeacoffee.com/TU_USUARIO)

## Licencia

MIT
