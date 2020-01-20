window.onload = () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('keyup', handleArrowUpPressed);
    let positionX = canvas.width / 2 - 30;
    let positionY = canvas.height - 60;
    let enemies = [];
    let shotX = positionX + 25;
    let shotY = positionY - 15;
    let brickColumnCount = 3;
    let brickRowCount = 10;
    const enemyWidth = 40;
    const enemyHeigth = 20;
    let flagX = 1;
    let conditional = true;
    let shotIsRendering = false;
    let shotStatus = true;
    let playerVelocity = 0;
    let leftKeyIsPress = false;
    let rightKeyIsPress = false;
    let spaceIsPressed = false;
    let statusCount = 0;
    let playerLife = 100;
    let enemyShotX = 0;
    let enemyShotY = 0;
    let enemyShotOnFire = false;
    let enemyData = {};
    let enemyShotPos = 0;
    for(let y = 0; y < brickColumnCount; y++) {
        enemies[y] = []
        for(let x = 0; x < brickRowCount; x++) {
            enemies[y][x] = {x:0, y:0, status:1};
        }
    }
    
    renderCanvas();
    function renderCanvas() {
        ctx.fillStyle = "#ccc";
        ctx.fillRect(0,0,600,400);
        
    }

    function renderGame() {
        checkVictory();
        checkGameOver();
        ctx.clearRect(0,0,600,400);
        renderCanvas();
        drawPlayer();
        startEnemies();
        drawShot();
        drawPlayerLife();
        renderEnemyShot();
    }

    function drawPlayer() {
        ctx.fillStyle = "green";
        ctx.fillRect(positionX, positionY, 60,20);
        if(positionX >= 540 && playerVelocity == 5) {
            positionX = 540;
        }
        else if(positionX <= 0 && playerVelocity == -5) {
            positionX = 0;
        }
        else {
            positionX += playerVelocity;
        }
        
    }
    

    function drawShot() {
        if(shotStatus) {
            ctx.fillStyle = "#333";
            ctx.fillRect(shotX,shotY, 5,20);
            shotY -= 5;
            
        }
        checkShotColision();
    }

    function checkShotColision() {
        if(shotY <= 0 && shotStatus) {
            shotX = positionX + 25;
            shotY = positionY - 15;
            shotStatus = false;
            spaceIsPressed = false;
        }
        
    }

    function startEnemies() {
        checkEnemyColision();
        for(let y = 0; y < brickColumnCount; y++) {
            for(let x = 0; x < brickRowCount; x++) {
                if(enemies[y][x].status == 1) {
                    enemies[y][x].x = (x * (10 + enemyWidth)) + flagX;
                
                    enemies[y][x].y = (y * (10 + enemyHeigth));
                    ctx.beginPath();
                    ctx.rect(enemies[y][x].x,enemies[y][x].y, enemyWidth, enemyHeigth);
                    ctx.fillStyle = "#222";
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
        
    }

    function handleKeyPress(event) {
        if(event.key.toUpperCase() == "ARROWLEFT") {
            playerVelocity = -5;   
        }
        else if(event.key.toUpperCase() == "ARROWRIGHT") {
            playerVelocity = 5;
        }
        

        
    }

    function handleArrowUpPressed(event) {
        if(event.key.toUpperCase() == "ARROWUP") {
            if(!spaceIsPressed) {
                shotX = positionX + 25;
                shotY = positionY - 15;
                shotStatus = true;
                spaceIsPressed = true;
            }
        }
    }

    function handleKeyUp(event) {
        if(rightKeyIsPress || leftKeyIsPress) {
            
        }

        else if(event.key.toUpperCase() == "ARROWRIGHT" || event.key.toUpperCase() == "ARROWLEFT") {
            playerVelocity = 0;
        }
        
    }

    function checkEnemyColision() {
        for(let y = 0; y < brickColumnCount; y++) {
            for(let x = 0; x < brickRowCount; x++) {
                if(shotY >= enemies[y][x].y && 
                    shotY <= enemies[y][x].y + 10 && 
                    shotX >= enemies[y][x].x && 
                    shotX <= enemies[y][x].x + 40 &&
                    enemies[y][x].status == 1
                    ) { 
                    shotX = positionX + 25;
                    shotY = positionY - 15;
                    enemies[y][x].status = 0;
                    shotStatus = false;
                    spaceIsPressed = false;
                    statusCount++;
                }
            }
        }
    }

    let firstInterval = setInterval(() => {
        renderGame();
    }, 10)

    function checkVictory() {
        const statusObjective = brickColumnCount * brickRowCount;
        if(statusCount == statusObjective) {
            alert("Parabens você venceu");
            clearInterval(firstInterval);
        }
    }

    function checkGameOver() {
        if(playerLife == 0) {
            alert("Game over");
            clearInterval(firstInterval);
        }
    }

    function drawPlayerLife() {
        ctx.fillStyle = "black";
        ctx.font = "10px Arial black";
        ctx.fillText("Vida Atual: ", 0, 395);
        ctx.fillStyle = "black";
        ctx.fillRect(70, 390, playerLife, 10);
        
    }
    
    function renderEnemyShot() {
        if(!enemyShotOnFire) {
            
            const max1 = brickRowCount - 1;
            const max2 = brickColumnCount - 1;
            const randomColumnNumber = Math.round(Math.random() * (max1 - 0) + 0);
            const randomRowNumber = Math.round(Math.random() * (max2 - 0) + 0);
            if(enemies[randomRowNumber][randomColumnNumber].status == 1) {
                enemyData = enemies[randomRowNumber][randomColumnNumber];
                enemyShotPos = enemyData.y;
            }
            enemyShotOnFire = true;
            
        }
        else {
            enemyShotPos = enemyShotPos + 2.5;
            ctx.fillStyle = "red";
            ctx.fillRect(enemyData.x + 15, enemyShotPos, 5, 20);
            checkPlayerShotColision();
            checkShotLimit();
        }
        
    }

    function checkPlayerShotColision() {
        if(enemyData.x >= positionX - 30 && enemyData.x <= positionX + 30 && enemyShotPos == positionY) {
            enemyShotOnFire = false;
            playerLife -= 25;
        }
    }
    
    function checkShotLimit() {
        if(enemyShotPos >= 400) {
            enemyShotOnFire = false;
        }
    }

    

      
} 
