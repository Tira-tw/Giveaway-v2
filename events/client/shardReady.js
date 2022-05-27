module.exports = async (client, id) => {
  try {
    client.logger(`Shard #${id} 連線中..`.brightGreen);
  } catch {
    /* */ }
}