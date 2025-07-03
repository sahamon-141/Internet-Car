from flask import Flask, render_template, request, jsonify
import pigpio
import time

app = Flask(__name__)

# Initialize pigpio
pi = pigpio.pi()
if not pi.connected:
    raise Exception("Failed to connect to pigpio daemon!")

# L298N Motor Pins
IN1, IN2, IN3, IN4 = 17, 18, 22, 23
motor_pins = [IN1, IN2, IN3, IN4]

# SG90 Servo Pins
PAN_PIN, TILT_PIN = 12, 13
SERVO_MIN_PULSE = 500   # 0° (500µs pulse)
SERVO_MAX_PULSE = 2500  # 180° (2500µs pulse)

# Setup Motor Pins
for pin in motor_pins:
    pi.set_mode(pin, pigpio.OUTPUT)
    pi.write(pin, 0)

# Motor Control Functions
def stop_motors():
    for pin in motor_pins:
        pi.write(pin, 0)

def forward():
    pi.write(IN1, 0)
    pi.write(IN2, 1)
    pi.write(IN3, 0)
    pi.write(IN4, 1)

def backward():
    pi.write(IN1, 1)
    pi.write(IN2, 0)
    pi.write(IN3, 1)
    pi.write(IN4, 0)

def left():
    pi.write(IN1, 1)
    pi.write(IN2, 0)
    pi.write(IN3, 0)
    pi.write(IN4, 1)

def right():
    pi.write(IN1, 0)
    pi.write(IN2, 1)
    pi.write(IN3, 1)
    pi.write(IN4, 0)

# Servo Control (Angle: 0°-180°)
PAN_MIN, PAN_MAX = 30, 180  # Example: Limit to 30°-150°
TILT_MIN, TILT_MAX = 30, 130

def set_angle(pin, angle):
    if pin == PAN_PIN:
        angle = max(PAN_MIN, min(angle, PAN_MAX))  # Clamp value
    elif pin == TILT_PIN:
        angle = max(TILT_MIN, min(angle, TILT_MAX))
    
    pulse = int(500 + (angle / 180) * 2000)  # 500-2500µs
    pi.set_servo_pulsewidth(pin, pulse)

# Routes
@app.route('/')
def index():
    return render_template('index.html', video_stream_url="http://192.168.0.186:81/stream")

@app.route('/api/control', methods=['POST'])
def control():
    data = request.json
    command = data.get('command')
    
    if command == 'forward':
        forward()
    elif command == 'backward':
        backward()
    elif command == 'left':
        left()
    elif command == 'right':
        right()
    elif command == 'stop':
        stop_motors()
    elif command == 'pan_tilt':
        pan_angle = data.get('pan', 90)
        tilt_angle = data.get('tilt', 90)
        set_angle(PAN_PIN, pan_angle)
        set_angle(TILT_PIN, tilt_angle)
    if command == 'servo_emergency_stop':
        # Immediately stop PWM pulses
        pi.set_servo_pulsewidth(PAN_PIN, 0)
        pi.set_servo_pulsewidth(TILT_PIN, 0)
        time.sleep(4)  # Brief pause
        # Re-center servos (optional)
    
    return jsonify(status="success")

@app.route('/cleanup')
def cleanup():
    stop_motors()
    pi.set_servo_pulsewidth(PAN_PIN, 0)  # Stop servo pulses
    pi.set_servo_pulsewidth(TILT_PIN, 0)
    pi.stop()
    return "GPIO cleanup done."

if __name__ == '__main__':
    try:
        # Center servos on startup
        set_angle(PAN_PIN, 115)
        set_angle(TILT_PIN, 60)
        app.run(host='0.0.0.0', port=5000, debug=True)
    except KeyboardInterrupt:
        pi.set_servo_pulsewidth(PAN_PIN, 0)
        pi.set_servo_pulsewidth(TILT_PIN, 0)
        pi.stop()