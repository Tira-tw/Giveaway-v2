module.exports = async (client, event, id) => {
  client.logger(`Shard #${id} 斷開連接`.brightRed);
}