let port;
let writer;
let triggerTmp = 30;
let sound;
let played = false;
let preAlert=false;
document.querySelector('#preAlert').addEventListener('change', e => preAlert=e.srcElement.checked)

//document.querySelector("input[name=doneness]")//
//try to fetch the value from the 'doneness' on the website//
document.querySelectorAll("input[name='doneness']")
    .forEach(d => d.addEventListener('change', e => {
        triggerTmp = parseInt(document.querySelector("input[name='doneness']:checked").value)
        console.log(triggerTmp)
        played = false;
    }))


document.querySelectorAll("input[name='sound']")
    .forEach(d => d.addEventListener('change', async e => {
        let soundName = document.querySelector("input[name='sound']:checked").value
        console.log(soundName)
        sound = await loadSound(`${soundName}.mp3`);
    }))

// target html elements
const connectBtn = document.querySelector('#connectBtn');

async function setup() {
    noCanvas();
    sound = await loadSound('bell.mp3');
}

connectBtn.addEventListener('click', async function(){
    try {
        // Request the user to select the HUZZAH32 serial/COM port
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });
        writer = port.writable.getWriter();
        
        // when connected, we can disable connect button and interact with send button
        connectBtn.disabled = true;
        document.querySelector('#statusText').innerText = 'Connected';

        // Read incoming data from the HUZZAH32
        while (port.readable) {
            const textDecoder = new TextDecoderStream();
            const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
            const reader = textDecoder.readable.getReader();

            try {
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;

                    // we receive the incoming data in the variable value
                    // (2 lines above). Now you can do stuff with the data
                    // you just received !
                    console.log(value);
                    let tmp = parseFloat(value);    
                    document.querySelector('#tempValue').innerText = tmp;

                    if(tmp > (preAlert ? triggerTmp - 5 : triggerTmp)){
                        //then trigger an MP3
                        if(!played) {
                            sound.play();
                            played = true;
                        }
                    }
                    
                }
            } 
            catch (error) { // we keep this to handle the errors that might happen
                console.error(error);
            } 
            finally {
                reader.releaseLock();
            }
        }
    } catch (err) {
    console.error("Error opening serial port:", err);
    }
});