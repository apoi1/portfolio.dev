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

Estimación en tiempo real de frecuencia cardíaca y respiración a partir del **CSI de WiFi** — la información de estado del canal que un ESP32-S3 puede leer de las ondas de radio ordinarias. Sin wearables, sin cámaras: física de RF, DSP cuidadoso y muchas pruebas.

## El pipeline

1. **Firmware** — un ESP32-S3 captura las amplitudes CSI por subportadora a ~10 Hz sobre ESP-IDF y publica CSV compacto por MQTT.
2. **Broker** — Mosquitto en Docker conecta las placas con el backend a través de la LAN.
3. **Backend DSP** — un servicio en Python (paho-mqtt, SciPy) mantiene una ventana deslizante de 15 segundos por placa, elige la mejor subportadora por banda fisiológica (respiración 0.1–0.5 Hz, corazón 0.8–2.0 Hz), aplica filtro pasa-banda y ejecuta una FFT con ventana Hann, refinado cuadrático del pico y una compuerta de calidad por SNR.
4. **Interfaces** — una GUI de escritorio en PyQt5 (vitales, presencia, movimiento, espectrograma, mapa de subportadoras) más un visor web LAN sin instalación para cualquier navegador del teléfono.

## Por qué es interesante

- **Fusión multi-ESP32** — cada placa publica en `esp32/<id>/csi/raw`; el backend fusiona por banda con el mejor SNR, con failover de enlaces muertos en menos de 20 segundos.
- **Ingeniería que se demuestra sola** — 50 pruebas pytest headless, un protocolo de validación escrito (falsificación con sala vacía, respiración sincronizada con metrónomo), documentación del modelo de señal con procedencia por variable y un release etiquetado `v0.1.0`.
- **Portable por diseño** — kit de un clic para Windows (broker + visor), script de provisión por serial y un simulador sin hardware para pruebas en seco.

> Proyecto de investigación/educativo — no es un dispositivo médico.
