# 🌐 Internet-Controlled RC Car 
![Python](https://img.shields.io/badge/python-3.8%2B-blue)
![Flask](https://img.shields.io/badge/flask-2.0%2B-lightgrey)
![OpenCV](https://img.shields.io/badge/opencv-4.5%2B-orange)
![ESP32-CAM](https://img.shields.io/badge/ESP32--CAM-compatible-green)
![Raspberry Pi 4](https://img.shields.io/badge/Raspberry_Pi-compatible-green)
![Tailscale](https://img.shields.io/badge/Tailscale-Integrated-yellow)<br/><br/>

This project is a **remotely controllable RC car** powered by a **Raspberry Pi 4**. It uses a **Flask server** to host a control interface accessible from anywhere using **Tailscale VPN**. The car features real-time motor control, a live video stream, and a pan-tilt camera system for directional viewing.

---

## 🚗 Features

- ✅ Remote control over WAN using Flask and Tailscale IP
- 📹 Real-time video feed with camera pan and tilt control
- 🔋 Powered by 4x 3.7V Li-ion 18650 batteries 
- 🔌 USB 4G Dongle for mobile internet access
- 🎮 Motor control using **L298N motor driver**
- 🎥 Camera movement via dual **SG90 servo motors**
- 💻 Clean, responsive web interface for browser-based control
---

## 🛠️ Hardware Used

| Component              | Role                                                                 |
|------------------------|----------------------------------------------------------------------|
| Raspberry Pi 4B (4GB)  | Main controller (Flask server, GPIO control, video handling)         |
| 4G USB Dongle          | Internet connectivity on-the-go                                      |
| L298N Motor Driver     | Drives the car’s motors (forward, backward, left, right)             |
| SG90 Servo Motors (x2) | Controls pan and tilt angles of the camera                           |
| Pan-Tilt Bracket       | Mounts camera and allows directional control                         |
| 18650 Li-ion Batteries | Power source (x4, 3.7V each), stepped down for Pi using buck module  |
| Camera (Esp32 Cam)     | Live video stream feed                                               |

---

## 🧠 Software Stack

- **Backend**: Python, Flask, pigpio (for PWM + GPIO)
- **Frontend**: HTML, CSS, JavaScript
- **VPN Tunnel**: Tailscale (for secure remote access)
- **Video Stream**: Handled via ESP32-CAM or Pi camera module

---

## 🖥️ Web Interface

- **Motor Controls**: WASD keys or on-screen buttons
- **Camera Control**: Sliders or IJKL keys for pan/tilt
- **Emergency Stop**: Dedicated button to center and stop servo signals
- **Responsive Design**: Works across mobile and desktop browsers

![image](https://github.com/user-attachments/assets/fda3a06f-ff65-41b4-b187-67d8b5f2736b)
<br/>

## System Diagram
![image](https://github.com/user-attachments/assets/85a1c15e-3867-4c64-8ad9-d1e08e2dad2b)

---

## 🧩 File Structure
/static/ <br/>
├── styles.css # UI styling <br/>
├── script.js # Frontend logic for control and sliders <br/>
/templates/ <br/>
└── index.html # Main control page <br/>
app.py # Flask backend server <br/>

---

## 🚀 How It Works

1. **Control Server**:
   - Flask app running on Pi handles `/api/control` endpoints.
   - Accepts commands for movement and servo angles.

2. **Video Streaming**:
   - ESP32-CAM or Pi camera streams feed at `/stream`.

3. **Communication**:
   - Tailscale assigns a private VPN IP accessible from registered device.

4. **Hardware Control**:
   - pigpio controls GPIO pins for motors and PWM for servos.

---

## 🔧 Setup Guide

### 1. Hardware Wiring
- Connect motors to L298N IN1–IN4 and power supply.
- Attach servos to GPIO 12 (pan) and 13 (tilt).
- Use a buck converter to drop battery voltage to 5V for Raspberry Pi.

### 2. Software Installation (on Pi)
```bash
sudo apt update
sudo apt install pigpio python3-flask
sudo pigpiod
python3 app.py
```
for auto start up of pigpiod 
```bash
sudo systemctl enable pigpiod
```
### 3. Tailscale Setup
Install Tailscale: 

```bash
curl -fsSL https://tailscale.com/install.sh | sh
```
Authenticate and get Pi's Tailscale IP

Access: http://<tailscale-ip>:5000

Auto startup tailscale on boot 
```bash
sudo systemctl enable tailscaled
```

### 4. Run the Program
run the flask server `sudo python3 app.py`
enter `localhost:5000` on any web browser for interface
