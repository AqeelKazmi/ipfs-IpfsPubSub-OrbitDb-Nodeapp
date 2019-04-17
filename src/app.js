const IPFS = require('ipfs');
const Room = require('ipfs-pubsub-room');
const OrbitDB = require('orbit-db')

const ipfs = new IPFS({
    repo: repo(),
    start: true,
    EXPERIMENTAL:{
        pubsub: true
    },
    config: {
        Addresses: {
          Swarm: [
            '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
          ]
        }
      }
})

// ipfs.on('ready', async () => {
//   const orbitdb = new OrbitDB(ipfs);
//   const db = await orbitdb.keyvalue('first-database');
//   await db.put('name', 'hello');
//   const value = db.get('name');
//   console.log(value);
// })

ipfs.on('ready', async () =>{ 

// Create OrbitDB instance
const orbitdb = new OrbitDB(ipfs);
const access = {
  // Give write access to everyone
  create: true,
  overwrite: true,
  // Load only the local version of the database,
  // don't load the latest from the network yet
  localOnly: false,
  type: 'keyvalue',
  write: ['*']
}

let db = await orbitdb.keyvalue("orderbook3", access);
//let db = await orbitdb.kvstore('example', { overwrite: true })
//  console.log(orbitdb.key.getPublic('hex'));

await db.load()

console.log(`database string: ${db.address.toString()}`)
console.log(`db public key: ${db.key.getPublic('hex')}`)


// db.events.on('ready', () => {
//   console.log(`Database is ready!`)
// })


db.events.on('replicated', () => {
  console.log(`Databse replicated. Check for new prices.`)
})

    ipfs.id((err,info) => {
          if(err) { throw err}
         // console.log("IPFS  ready with address " + info.id);


const room = Room(ipfs, 'DEXipfs')
console.log(room);

room.on('subscribed', () => {
  console.log('Now connected!')
})  ;




let add= document.getElementById('receiverAdd').value;
room.on('peer joined', (peer) => { room.sendTo(add, ' Hello ' + add + ' ! '); console.log('Peer joined the room', peer) })
room.on('message', (message) =>
console.log('Got message from ' + message.from + ' : ' + message.data.toString()  ))

room.on('peer left', (peer) => {
      console.log('Peer left...', peer)
    })
   
    // setInterval(() =>  {
    //         let peerArr= room.getPeers();
    //        console.log("Total peers in room",peerArr.length + 1);
    //       }, 10000);

 //setInterval(() => { console.log("Broadcasted"+room.broadcast("hey! This is scheduled broadcasted message after every 100 seconds"))}, 1000);



})

}

);



function repo () {
    return 'ipfs/pubsub-demo/' + Math.random()
  }

