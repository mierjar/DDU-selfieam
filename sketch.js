//client er den variabel der bruges til at oprette forbindelse til mqtt serveren
let client 
//en counter som er sat på 3 som tæller ned til når billedet bliver taget
let counter = 3;
//
let video
let videoVisible = true
let snapBtn, relBtn, fsBtn


//setup er den funktion der kører, før selve web-appen starter 
function setup() {
  snapBtn = select('#snapBtn')
  relBtn = select('#relBtn')
  fsBtn = select('#fsBtn')

  snapBtn.mousePressed(countdown)
  relBtn.mousePressed(()=>window.location.reload(true))
  fsBtn.mousePressed(()=>select('body').elt.requestFullscreen())

  
  //forsøg at oprette forbindelse til MQTT serveren 
  client = mqtt.connect('wss://mqtt.nextservices.dk')

  //hvis forbindelsen lykkes kaldes denne funktion
  client.on('connect', (m) => {
    console.log('Client connected: ', m)
  })
  
  //subscribe poå emnet programmering
  client.subscribe('selfiebooth')
  
  //når vi modtager beskeder fra MQTT serveren kaldes denne funktion
  client.on('message', (topic, message) => {
    console.log('Received Message: ' + message.toString())
    console.log('On Topic: ' + topic)


  //når mqtt for beskeden "on" så vil den aktivere funktionen "countdown"
  if(message.toString()=="on")countdown();

  //når mqtt for beskeden "off" så vil den aktivere funktionen "showVideo"
  if(message.toString()=="off")showVideo(video.height);
  }) 

  // 
  let c = createCanvas(640, 480);
  select('main').child(c)
  background(51);

  //access live webcam
  video = createCapture(VIDEO);
  video.size(640, 480);
}

function draw(){
  if(videoVisible){
    image(video, 0, 0, 640, 480)
  }
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
  videoVisible = false
  image(video,0 , 0, 640, 480);
  setTimeout(showVideo, 5000)
}

//en funktion som vil "reset" kameret, den reseter counteren, sætter en background for at skjule det sidste billede og viser webcam igen
function showVideo() {
  background(0)
  select('#counter').html('')
  counter = 3
  videoVisible = true;

}

function keyPressed(key){
  if(key.key=='Enter'){
    takesnap()
    window.requestFullscreen()
  }
}

