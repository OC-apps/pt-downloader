# PT Downloader

Prototipo Android/Expo con identidad visual Prestige Tracks.

## Incluye

- Entrada para enlaces autorizados o enlaces directos.
- Modo de video individual o playlist.
- Salida MP4 o MP3.
- Velocidad variable de 50% a 150%, con accesos rápidos.
- Conservación opcional del tono al cambiar velocidad.
- Cambio de tono de −12 a +12 semitonos.
- Opción de separación vocal.
- Cola visual y consentimiento de derechos.

## Ejecutar

```bash
npm install
npm run start
```

Abre el proyecto con Expo Go o ejecuta `npm run android` con Android Studio/SDK configurado.

## APK privado

Cada envío a `main` ejecuta **Construir APK Android** en GitHub Actions. Al terminar, el archivo instalable aparece como artefacto `PT-Downloader-Android`.

> Estado actual: este APK permite revisar la interfaz y crear solicitudes locales. La obtención y transformación multimedia real todavía requiere integrar el motor Android nativo. No debe presentarse como la versión funcional final.

## Procesamiento real

La interfaz está terminada; el botón crea la solicitud local. Para descargar y transformar archivos reales hay que conectar un servicio propio/autorizado en `app.json` (`extra.apiUrl`). Ese servicio debe aceptar solo contenido propio, de dominio público, con licencia o enlaces directos que permitan descarga. No debe evadir DRM, autenticación ni restricciones de plataformas.

Contrato sugerido:

```json
POST /jobs
{
  "url": "https://...",
  "playlist": false,
  "format": "mp4",
  "speed": 0.75,
  "preservePitch": true,
  "semitones": -2,
  "removeVocals": true
}
```

Para procesamiento autorizado, el backend puede usar FFmpeg para tempo/tono y Demucs para separación vocal. La separación se recomienda en servidor por consumo de memoria y batería.
