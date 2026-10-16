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

Real-time heart-rate and breathing estimation from **WiFi CSI** — the channel state information an ESP32-S3 can read from ordinary radio waves. No wearables, no cameras: just RF physics, careful DSP, and a lot of tests.

## The pipeline

1. **Firmware** — an ESP32-S3 captures per-subcarrier CSI amplitudes at ~10 Hz on ESP-IDF and publishes compact CSV over MQTT.
2. **Broker** — Mosquitto in Docker links the boards to the backend over the LAN.
3. **DSP backend** — a Python service (paho-mqtt, SciPy) keeps a 15-second sliding window per board, selects the best subcarrier per physiological band (respiration 0.1–0.5 Hz, heart 0.8–2.0 Hz), bandpass-filters it and runs a Hann-windowed FFT with quadratic peak refinement and an SNR quality gate.
4. **Interfaces** — a PyQt5 desktop GUI (vitals, presence, motion, spectrogram, subcarrier heatmap) plus a zero-install LAN web viewer for any phone browser.

## Why it's interesting

- **Multi-ESP32 fusion** — every board publishes to `esp32/<id>/csi/raw`; the backend fuses per band by best in-band SNR, with dead-link failover inside 20 seconds.
- **Prove-it engineering** — 50 headless pytest cases, a written validation protocol (empty-room falsification, metronome-locked breathing), signal-model documentation with per-variable provenance, and a tagged `v0.1.0` release.
- **Portable by design** — one-click Windows kit (broker + viewer), serial provisioning script, and a hardware-free simulator for dry runs.

> Research/educational project — not a medical device.
