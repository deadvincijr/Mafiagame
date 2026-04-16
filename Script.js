window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const adminPanel = document.getElementById('adminPanel');
    const roleButtons = document.querySelectorAll('.role-btn');
    const secretRoleButtons = document.querySelectorAll('.secret-role-btn');
    const currentRoleSpan = document.getElementById('currentRole');
    const currentSecretRoleSpan = document.getElementById('currentSecretRole');
    const currentGoldSpan = document.getElementById('currentGold');
    const abilitiesContainer = document.getElementById('abilities');

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
        speed: 5,
        role: null,
        secretRole: null,
        gold: 0,
        baseGold: 0
    };

    // NPC array
    const npcs = [{
        x: 1200,
        y: 1000,
        width: 50,
        height: 50,
        color: 'blue',
        name: 'Villager',
        gold: 100,
        isAlive: true
    }];

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

    const INTERACTION_DISTANCE = 75;

    // Keep track of pressed keys
    const keysPressed = {};

    window.addEventListener('keydown', function(e) {
        keysPressed[e.key.toLowerCase()] = true;

        if (e.key.toLowerCase() === 'p') {
            adminPanel.classList.toggle('hidden');
        }
    });

    window.addEventListener('keyup', function(e) {
        keysPressed[e.key.toLowerCase()] = false;
    });

    // Handle window resizing
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Handle role selection
    roleButtons.forEach(button => {
        button.addEventListener('click', () => {
            player.role = button.dataset.role;
            switch (player.role) {
                case 'Lord':
                    player.baseGold = 500;
                    break;
                case 'Bodyguard':
                    // Assuming bodyguard protects Lord (500 gold * 0.75)
                    player.baseGold = 375;
                    break;
                case 'Bishop':
                    player.baseGold = 125;
                    break;
                case 'Merchant':
                    player.baseGold = 300;
                    break;
                default:
                    player.baseGold = 0;
            }
            currentRoleSpan.textContent = player.role;
            recalculatePlayerGold();
            updateAbilitiesUI();
            console.log(`Role changed to: ${player.role}`);
        });
    });

    // Handle secret role selection
    secretRoleButtons.forEach(button => {
        button.addEventListener('click', () => {
            player.secretRole = button.dataset.role;
            currentSecretRoleSpan.textContent = player.secretRole;
            recalculatePlayerGold();
            updateAbilitiesUI();
            console.log(`Secret Role changed to: ${player.secretRole}`);
        });
    });

    function recalculatePlayerGold() {
        let currentGold = player.baseGold;
        if (player.secretRole === 'Farmer') {
            currentGold -= 10;
        }
        player.gold = currentGold;
        updateGoldDisplay();
    }

    function updateGoldDisplay() {
        currentGoldSpan.textContent = player.gold;
    }

    function getNearbyNPC() {
        for (const npc of npcs) {
            const distance = Math.sqrt(
                Math.pow(player.x + player.width / 2 - (npc.x + npc.width / 2), 2) +
                Math.pow(player.y + player.height / 2 - (npc.y + npc.height / 2), 2)
            );
            if (distance < INTERACTION_DISTANCE && npc.isAlive) {
                return npc;
            }
        }
        return null;
    }

    function levyTaxes() {
        const target = getNearbyNPC();
        if (target) {
            const taxAmount = Math.floor(target.gold * 0.10);
            target.gold -= taxAmount;
            player.gold += taxAmount;
            updateGoldDisplay();
            alert(`You collected ${taxAmount} gold in taxes from ${target.name}.`);
        } else {
            alert("No target in range.");
        }
    }

    function appraise() {
        const target = getNearbyNPC();
        if (target) {
            alert(`${target.name} has ${target.gold} gold.`);
        } else {
            alert("No target in range.");
        }
    }

    function assassinate() {
        const target = getNearbyNPC();
        if (target) {
            target.isAlive = false;
            alert(`You have assassinated ${target.name}.`);
        } else {
            alert("No target in range.");
        }
    }

    function summon() {
        const target = getNearbyNPC();
        if (target) {
            target.x = player.x + 60;
            target.y = player.y;
            alert(`You have summoned ${target.name}.`);
        } else {
            alert("No target in range.");
        }
    }

    function inciteMob() {
        const target = getNearbyNPC();
        if (target) {
            target.x += (Math.random() - 0.5) * 400;
            target.y += (Math.random() - 0.5) * 400;
            alert(`You have incited a mob against ${target.name}, causing them to flee.`);
        } else {
            alert("No target in range.");
        }
    }

    function bribe() {
        const target = getNearbyNPC();
        if (target) {
            const bribeAmount = 50;
            if (player.gold >= bribeAmount) {
                player.gold -= bribeAmount;
                target.gold += bribeAmount;
                updateGoldDisplay();
                alert(`You bribed ${target.name} with ${bribeAmount} gold.`);
            } else {
                alert("Not enough gold to bribe.");
            }
        } else {
            alert("No target in range.");
        }
    }

    function soundTheAlarm() {
        alert(`ALARM! The Bodyguard at (${Math.round(player.x)}, ${Math.round(player.y)}) requires assistance!`);
    }

    function updateAbilitiesUI() {
        abilitiesContainer.innerHTML = '<h3>Abilities</h3>'; // Clear previous buttons

        if (player.role === 'Lord') {
            const levyBtn = document.createElement('button');
            levyBtn.textContent = 'Levy Taxes';
            levyBtn.onclick = levyTaxes;
            abilitiesContainer.appendChild(levyBtn);

            const summonBtn = document.createElement('button');
            summonBtn.textContent = 'Summon';
            summonBtn.onclick = summon;
            abilitiesContainer.appendChild(summonBtn);
        }

        if (player.role === 'Bodyguard') {
            const alarmBtn = document.createElement('button');
            alarmBtn.textContent = 'Sound the Alarm';
            alarmBtn.onclick = soundTheAlarm;
            abilitiesContainer.appendChild(alarmBtn);
        }

        if (player.role === 'Bishop') {
            const inciteBtn = document.createElement('button');
            inciteBtn.textContent = 'Incite Mob';
            inciteBtn.onclick = inciteMob;
            abilitiesContainer.appendChild(inciteBtn);
        }

        if (player.role === 'Merchant') {
            const appraiseBtn = document.createElement('button');
            appraiseBtn.textContent = 'Appraise';
            appraiseBtn.onclick = appraise;
            abilitiesContainer.appendChild(appraiseBtn);

            const bribeBtn = document.createElement('button');
            bribeBtn.textContent = 'Bribe';
            bribeBtn.onclick = bribe;
            abilitiesContainer.appendChild(bribeBtn);
        }

        if (player.secretRole === 'Assassin') {
            const assassinateBtn = document.createElement('button');
            assassinateBtn.textContent = 'Assassinate';
            assassinateBtn.onclick = assassinate;
            abilitiesContainer.appendChild(assassinateBtn);
        }
    }

    function update() {
        // Only allow player movement if the admin panel is hidden
        if (adminPanel.classList.contains('hidden')) {
            // Move player using Arrow keys or WASD
            if (keysPressed['arrowup'] || keysPressed['w']) {
                player.y -= player.speed;
            }
            if (keysPressed['arrowdown'] || keysPressed['s']) {
                player.y += player.speed;
            }
            if (keysPressed['arrowleft'] || keysPressed['a']) {
                player.x -= player.speed;
            }
            if (keysPressed['arrowright'] || keysPressed['d']) {
                player.x += player.speed;
            }
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

        // Draw NPCs
        npcs.forEach(npc => {
            ctx.fillStyle = npc.isAlive ? npc.color : 'grey';
            ctx.fillRect(npc.x, npc.y, npc.width, npc.height);
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.font = '14px sans-serif';
            ctx.fillText(npc.name, npc.x + npc.width / 2, npc.y - 5);
        });

        // Draw the player
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Restore the context to its original state
        ctx.restore();
    }

    update();
};