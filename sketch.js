//client er den variabel der bruges til at oprette forbindelse til mqtt serveren
let client 
//connectionDiv peger på et DIV element i HTML siden 
let connectionDiv
//en counter som er sat på 3 som tæller ned til når billedet bliver taget
let counter = 3;
//
let video;


//setup er den funktion der kører, før selve web-appen starter 
function setup() {
  //tag fat i en div i HTML dokumentet - med id "connection"
  connectionDiv = select('#connection')
  
  //forsøg at oprette forbindelse til MQTT serveren 
  client = mqtt.connect('wss://mqtt.nextservices.dk')

  //hvis forbindelsen lykkes kaldes denne funktion
  client.on('connect', (m) => {
    console.log('Client connected: ', m)
    connectionDiv.html('You are now connected to mqtt.nextservices.dk')
  })
  
  //subscribe poå emnet programmering
  client.subscribe('selfiebooth')
  
  //når vi modtager beskeder fra MQTT serveren kaldes denne funktion
  client.on('message', (topic, message) => {
    console.log('Received Message: ' + message.toString())
    console.log('On Topic: ' + topic)

  //Sæt beskeden ind på hjemmesiden 
  connectionDiv.html('Received message: <b>' + message + '</b> on topic: <b>' + topic + '</b>')

  //når mqtt for beskeden "on" så vil den aktivere funktionen "countdown"
  if(message.toString()=="on")countdown();

  //når mqtt for beskeden "off" så vil den aktivere funktionen "showVideo"
  if(message.toString()=="off")showVideo();
  }) 

  // 
  let c = createCanvas(windowWidth, windowHeight);
  select('#canvasContainer').child(c)
  background(51);

  //access live webcam
  video = createCapture(VIDEO);
  video.size(1600, 720);
  video.position(0,0);
}

//en countdown funktion som vil tæller ned med -1 og når den lander på 0 vil den "takesnap"
function countdown() {
  select('#counter').html(counter)
  counter = counter - 1
  if(counter == 0) {
    takesnap();
    return;
  } else {
    setTimeout(countdown, 1000);
  }
}

//en takesnap funktion som der vil skjule det live webcam og gemme et screenshot som bliver vist
function takesnap() {
  video.hide()
  select('#counter').html('')
  image(video,320, 0, 976, 720, 0, 0);
}

//en funktion som vil "reset" kameret, den reseter counteren, sætter en background for at skjule det sidste billede og viser webcam igen
function showVideo() {
  background(0)
  counter = 3
  video.show();

}

function keyPressed(key){
  if(key.key=='Enter'){
    takesnap()
  }
}