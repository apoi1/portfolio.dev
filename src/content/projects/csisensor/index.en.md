---
title: 'csisensor — WiFi-CSI Vital Signs'
tagline: 'Real-time heart rate & breathing from plain WiFi signals — ESP32-S3 firmware all the way to a PyQt5 GUI.'
description: 'An experimental real-time vital-signs monitor that reads heart rate and respiration from WiFi CSI captured by ESP32-S3 boards — firmware, MQTT broker, Python DSP backend, desktop GUI and LAN web viewer.'
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

Real-time heart-rate and breathing estimation from **WiFi CSI** — the channel state information an ESP32-S3 can read from ordinary radio waves. No wearables, no cameras: RF physics, careful DSP, and 50 tests that keep the whole thing honest.

## The pipeline, stage by stage

1. **Firmware** — an ESP32-S3 captures per-subcarrier CSI amplitudes at ~10 Hz on ESP-IDF (the `CONFIG_ESP_WIFI_CSI_ENABLED` pin in `sdkconfig.defaults` exists because I hit the boot loop without it) and publishes compact CSV over MQTT. Credentials are read from **NVS at boot** with a serial provisioning protocol — one flash, then any network changes run through a 30-second pyserial script instead of a rebuild.
2. **Broker** — Mosquitto in Docker, with the config baked into the image at build time so `docker compose up` works from PowerShell over the `\\wsl.localhost` share.
3. **DSP backend** — a Python service (paho-mqtt + SciPy) keeps a 15-second sliding window per board, selects the strongest subcarrier per physiological band (respiration 0.1–0.5 Hz, heart 0.8–2.0 Hz), bandpass-filters it, and runs a Hann-windowed FFT with quadratic peak refinement and an SNR quality gate. Motion presence (Absent / Still / Moving) comes from mean-amplitude statistics, and RSSI feeds a calibratable log-distance estimate.
4. **Interfaces** — a PyQt5 GUI with physics panels (subcarrier heatmap, spectrogram with band markers, motion energy) plus an aiohttp LAN viewer any phone can open — no install, no CDN.

## The engineering that makes it defensible

- **Multi-ESP32 fusion** — every board publishes to `esp32/<id>/csi/raw`; the backend fuses per band by best in-band SNR, with a 16-link registry cap and dead-link failover inside 20 seconds (the polled primary expires too — that was a review finding I fixed).
- **50 headless pytest cases** covering the estimator, packet parser, motion analyzer, link manager and web pipeline.
- **An empirical validation protocol** written down: empty-room falsification (the negative control), metronome-locked breathing at 6 and 12 breaths/min, movement response, and a repeatability log. If the sensor says "person" in an empty room, the answer is the geometry, not a person.
- **Documentation as a first-class artifact** — signal model with per-variable provenance, a from-RF-to-pixel methodological framework, and a state-aware zombie-mode guide for bringing the whole thing up on a random Tuesday.
- **Portable kit** — PyInstaller one-file viewer + official Mosquitto binaries + one-click `start-system.bat`, so the full pipeline runs on Windows PCs with no Python and no Docker.

The honest limits are documented too: amplitude-only CSI from a single antenna can't give coordinates or angle, and this is a research/educational project — **not a medical device**.
