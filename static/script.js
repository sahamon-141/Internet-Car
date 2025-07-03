document.addEventListener('DOMContentLoaded', () => {
    // Current pan/tilt angles (initialized to center)
    let panAngle = 90;
    let tiltAngle = 90;
    const STEP_SIZE = 5; // Degrees to move per keypress

    // Slider Elements
    const panSlider = document.getElementById('pan-slider');
    const tiltSlider = document.getElementById('tilt-slider');
    const panValue = document.getElementById('pan-value');
    const tiltValue = document.getElementById('tilt-value');

    // Send commands to Flask
    function sendCommand(command, data = {}) {
        fetch('/api/control', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command, ...data })
        });
    }

    // Slider Event Listeners
    panSlider.addEventListener('input', () => {
        panAngle = parseInt(panSlider.value);
        panValue.textContent = `${panAngle}°`;
        sendCommand('pan_tilt', { pan: panAngle, tilt: tiltAngle });
    });

    tiltSlider.addEventListener('input', () => {
        tiltAngle = parseInt(tiltSlider.value);
        tiltValue.textContent = `${tiltAngle}°`;
        sendCommand('pan_tilt', { pan: panAngle, tilt: tiltAngle });
    });

    // Keyboard Controls (IJKL)
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        
        // Motor Controls (WSAD)
        if (['w', 's', 'a', 'd'].includes(key)) {
            sendCommand(key === 'w' ? 'forward' :
                       key === 's' ? 'backward' :
                       key === 'a' ? 'left' : 'right');
        }
        
        // Pan-Tilt Controls (IJKL)
        if (['i', 'j', 'k', 'l'].includes(key)) {
            switch(key) {
                case 'i': tiltAngle = Math.min(tiltAngle + STEP_SIZE, 180); break; // Tilt Up
                case 'k': tiltAngle = Math.max(tiltAngle - STEP_SIZE, 0); break;    // Tilt Down
                case 'j': panAngle = Math.max(panAngle - STEP_SIZE, 0); break;      // Pan Left
                case 'l': panAngle = Math.min(panAngle + STEP_SIZE, 180); break;    // Pan Right
            }
            
            // Update sliders and send command
            panSlider.value = panAngle;
            tiltSlider.value = tiltAngle;
            panValue.textContent = `${panAngle}°`;
            tiltValue.textContent = `${tiltAngle}°`;
            sendCommand('pan_tilt', { pan: panAngle, tilt: tiltAngle });
        }
    });
    
    // Add this to your existing script
document.getElementById('servo_stop').addEventListener('click', () => {
    // Immediately center servos and stop PWM signals
    panAngle = 90;
    tiltAngle = 90;
    
    // Update UI
    panSlider.value = 90;
    tiltSlider.value = 90;
    panValue.textContent = "90°";
    tiltValue.textContent = "90°";
    
    // Send emergency stop command
    sendCommand('servo_emergency_stop');
    
    // Visual feedback
    const btn = document.getElementById('servo_stop');
    btn.textContent = "✅ SERVO STOPPED";
    btn.style.background = "#00aa00";
    btn.style.borderColor = "#008800";
    
    // Reset button after 3 seconds
    setTimeout(() => {
        btn.textContent = "🛑 SERVO EMERGENCY STOP";
        btn.style.background = "#ff0000";
        btn.style.borderColor = "#cc0000";
    }, 3000);
});

    // Stop motors on keyup
    document.addEventListener('keyup', (e) => {
        if (['w', 's', 'a', 'd'].includes(e.key.toLowerCase())) {
            sendCommand('stop');
        }
    });


    // Button Controls (existing)
    const controls = ['forward', 'backward', 'left', 'right', 'stop'];
    controls.forEach(control => {
        const btn = document.getElementById(control);
        if (btn) {
            btn.addEventListener('mousedown', () => sendCommand(control));
            btn.addEventListener('mouseup', () => sendCommand('stop'));
            btn.addEventListener('touchstart', () => sendCommand(control));
            btn.addEventListener('touchend', () => sendCommand('stop'));
        }
    });
});