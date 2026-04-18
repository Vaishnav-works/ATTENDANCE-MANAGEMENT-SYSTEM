import dns from 'dns';

dns.resolveSrv('_mongodb._tcp.cluster0.nxys3uq.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('DNS SRV lookup failed:', err);
  } else {
    console.log('SRV Records found:', addresses);
  }
});
