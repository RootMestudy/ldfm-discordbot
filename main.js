const Discord = require('discord.js');
const tcpp = require('tcp-ping');
const config = require('./config.json');
const client = new Discord.Client();
const prefix = config.prefix;
const version = config.version;
const serverip = config.server_ip
const serverport = config.server_port;
const nameserver = config.name_server;

client.on('message', message => {

    // split de l'argument des commandes Discord
    const args = message.content.slice(prefix.length).split(' ');
    const command = args.shift().toLowerCase();

//----------------------------------Ajout de la commande !info----------------------------------------

if (message.content.search(prefix + "info") == 0){
    //Retourne toute les infos par rapport au serveur
        tcpp.ping({ address: serverip, port: serverport }, function(err, available) {
            //Retourne si le serveur est on ou off en réponse de la commande !info
            tcpp.probe(serverip, serverport, function(err, data) {
                //Si le serveur est on, le bot renvoie un embed
                if(data == true){
                    const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#32a852')
            .setTitle('Server is up! :smiley:')
            .setURL('http://wwii.lfdm.free.fr/')
            .setAuthor(nameserver, 'https://i.imgur.com/vDDU7iD.png', 'http://wwii.lfdm.free.fr/')
            .setDescription('Here some infos about the server')
            .addFields(
                { name: 'Server IP', value: serverip },
                { name: 'Server Port', value: serverport },
                { name: 'Ping Average (ms)', value: available.avg },
                { name: 'Ping Max (ms)', value: available.max },
                { name: 'Ping Min (ms)', value: available.min }
            )
            .addFields({name: '\u200B', value: '\u200B'})
            .setTimestamp()
            .setFooter(nameserver + ' - ' + version, 'https://i.imgur.com/vDDU7iD.png');

        message.channel.send(exampleEmbed);
                }
                //Si le serveur est down, le bot envoie un message
                if(data == false){
                    message.channel.send("Server is down :frowning2:")
                }
            });
        });

    }


})

client.setInterval(function(){
    //----------------------------------Ajout du ping constant----------------------------------------
    tcpp.probe(serverip, serverport, function(err, data) {
        const state = {
            val: data,
            get someBool() { 
              return this.val;
            },
            set someBool(data) {
              if (data !== this.val){
                  console.log("value changing to", data)
                  if(data == false){
                    client.channels.get(config.broadcast_channel).send("Server is up! :slight_smile:")
                  }
                  if(data == true){
                    client.channels.get(config.broadcast_channel).send("Server crashed! :open_mouth:")
                  }
            };
              this.val = data;
            }
          };          
    })
}, 1000)

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });
  
  client.login(config.token); 

