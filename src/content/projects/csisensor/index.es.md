---
title: 'csisensor — signos vitales por WiFi CSI'
tagline: 'Frecuencia cardíaca y respiración en tiempo real a partir de señales WiFi — del firmware ESP32-S3 a la GUI PyQt5.'
description: 'Monitor experimental de signos vitales en tiempo real que estima frecuencia cardíaca y respiración a partir del CSI de WiFi capturado por placas ESP32-S3: firmware, broker MQTT, backend DSP en Python, GUI de escritorio y visor web LAN.'
tech: ['C++ · ESP-IDF', 'Python', 'MQTT', 'SciPy · FFT', 'PyQt5', 'Docker', 'pytest']
year: 2026
status: active
order: 1
featured: true
links:
  repo: https://github.com/apoi1/csisensor
cover: ./cover.svg
gallery: []
---

Estimación en tiempo real de frecuencia cardíaca y respiración a partir del **CSI de WiFi** — la información de estado del canal que un ESP32-S3 puede leer de las ondas de radio ordinarias. Sin wearables, sin cámaras: física de RF, DSP cuidadoso y 50 pruebas que mantienen honesto todo el sistema.

## El pipeline, etapa por etapa

1. **Firmware** — un ESP32-S3 captura las amplitudes CSI por subportadora a ~10 Hz sobre ESP-IDF (el pin `CONFIG_ESP_WIFI_CSI_ENABLED` existe en `sdkconfig.defaults` porque sin él me comí un boot loop) y publica CSV compacto por MQTT. Las credenciales se leen de **NVS al arrancar** con un protocolo de provisión por serial: un solo flash, y cualquier cambio de red se hace con un script pyserial de 30 segundos en vez de recompilar.
2. **Broker** — Mosquitto en Docker, con la configuración horneada en la imagen al buildear, para que `docker compose up` funcione desde PowerShell sobre el share `\\wsl.localhost`.
3. **Backend DSP** — un servicio en Python (paho-mqtt + SciPy) mantiene una ventana deslizante de 15 segundos por placa, elige la subportadora más fuerte por banda fisiológica (respiración 0.1–0.5 Hz, corazón 0.8–2.0 Hz), aplica filtro pasa-banda y corre una FFT con ventana Hann, refinado cuadrático del pico y compuerta de calidad por SNR. La presencia de movimiento (Ausente / Quieto / Movimiento) sale de estadísticas de amplitud media, y el RSSI alimenta un estimador calibrable de distancia logarítmica.
4. **Interfaces** — una GUI PyQt5 con paneles de física (mapa de subportadoras, espectrograma con marcas de banda, energía de movimiento) más un visor aiohttp LAN que cualquier teléfono abre — sin instalar nada, sin CDN.

## La ingeniería que lo hace defendible

- **Fusión multi-ESP32** — cada placa publica en `esp32/<id>/csi/raw`; el backend fusiona por banda con el mejor SNR en banda, con tope de registro de 16 enlaces y failover de enlaces muertos en menos de 20 segundos (el primario sondeado también expira — eso fue un hallazgo de review que corregí).
- **50 casos pytest headless** cubriendo el estimador, el parser de paquetes, el analizador de movimiento, el gestor de enlaces y el pipeline web.
- **Un protocolo de validación empírica escrito**: falsificación con sala vacía (el control negativo), respiración bloqueada a metrónomo a 6 y 12 respiraciones/min, respuesta al movimiento y un registro de repetibilidad. Si el sensor dice "persona" en una sala vacía, la respuesta es la geometría, no una persona.
- **Documentación como artefacto de primera clase** — modelo de señal con procedencia por variable, un marco metodológico de la RF al píxel y una guía zombie state-aware para levantar todo un martes cualquiera.
- **Kit portable** — visor PyInstaller one-file + binarios oficiales de Mosquitto + `start-system.bat` de un clic, para que el pipeline completo corra en PCs con Windows sin Python y sin Docker.

Los límites honestos también están documentados: el CSI de solo amplitud con una antena no da coordenadas ni ángulo, y esto es un proyecto de investigación/educativo — **no es un dispositivo médico**.
