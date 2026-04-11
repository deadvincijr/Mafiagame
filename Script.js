window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Player object
    const player = {
        x: 1000, // Start position x
        y: 1000, // Start position y
        width: 50,
        height: 50,
        color: 'red',
        speed: 5
    };

    // World object
    const world = {
        width: 5000,
        height: 5000,
    };

    // Tile properties
    const tile = {
        size: 100,
        color1: '#34495e', // A slightly lighter dark blue/grey
        color2: '#2c3e50'  // The original background color
    };

    // Keep track of pressed keys
    const keysPressed = {};

    window.addEventListener('keydown', function(e) {
        keysPressed[e.key] = true;
    });

    window.addEventListener('keyup', function(e) {
        keysPressed[e.key] = false;
    });

    // Handle window resizing
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    function update() {
        // Move player using Arrow keys or WASD
        if (keysPressed['ArrowUp'] || keysPressed['w']) {
            player.y -= player.speed;
        }
        if (keysPressed['ArrowDown'] || keysPressed['s']) {
            player.y += player.speed;
        }
        if (keysPressed['ArrowLeft'] || keysPressed['a']) {
            player.x -= player.speed;
        }
        if (keysPressed['ArrowRight'] || keysPressed['d']) {
            player.x += player.speed;
        }

        // World boundaries collision to prevent player from going off-map
        player.x = Math.max(0, Math.min(player.x, world.width - player.width));
        player.y = Math.max(0, Math.min(player.y, world.height - player.height));

        draw();

        // Create the game loop
        requestAnimationFrame(update);
    }

    function draw() {
        // Clear the canvas on each frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Save the current state of the context
        ctx.save();

        // Center the camera on the player
        // We do this by translating the entire world in the opposite direction of the player
        let camX = -player.x + canvas.width / 2;
        let camY = -player.y + canvas.height / 2;
        ctx.translate(camX, camY);

        // Draw the tiled world background
        for (let x = 0; x < world.width; x += tile.size) {
            for (let y = 0; y < world.height; y += tile.size) {
                // Simple checkerboard pattern
                const isEvenTile = ((x / tile.size) + (y / tile.size)) % 2 === 0;
                ctx.fillStyle = isEvenTile ? tile.color1 : tile.color2;
                ctx.fillRect(x, y, tile.size, tile.size);
            }
        }

        // Draw the player
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Restore the context to its original state
        ctx.restore();
    }

    update();
};