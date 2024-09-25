document.getElementById('ipv6Form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const ipv6Address = document.getElementById('ipv6Address').value;
    const prefixLength = parseInt(document.getElementById('prefixLength').value);
  
    // Perform the IPv6 subnet calculations
    const results = calculateIPv6Subnet(ipv6Address, prefixLength);
  
    // Display the results
    document.getElementById('networkAddress').innerText = results.networkAddress;
    document.getElementById('firstUsable').innerText = results.firstUsable;
    document.getElementById('lastUsable').innerText = results.lastUsable;
    document.getElementById('totalAddresses').innerText = results.totalAddresses;
  
  });
  
  function calculateIPv6Subnet(ipv6Address, prefixLength) {
    try {
      // the Ip is splitted with ":" then each part is filled with 0 on the left to complete the formart i.e. (20010db8000000000000000000000000)
      const ip = BigInt(`0x${ipv6Address.split(':').map(padWithZeros).join('')}`);
      //  the network mask is  the number "1" shifted to the number of the host bits (i.e. 1000000000000000 ) then - 1 ( ffffffffffff) then shifting left
      let networkMask = (BigInt(1) << BigInt(128 - prefixLength)) - BigInt(1);
      networkMask = networkMask << BigInt(128 - prefixLength)
      // the network address is AND operation between the ip address and the network mask 
      const networkAddress = (ip & networkMask);
      const firstUsable = (ip & networkMask) + BigInt(1);
      const broadcast = networkAddress | ( networkMask >> BigInt(prefixLength) )
      const lastUsable = broadcast - BigInt(1);
      return {
        networkAddress: formatIPv6(networkAddress.toString(16).padStart(32, '0')),
        // subnetMask: formatIPv6(networkMask.toString(16).padStart(32, '0')),
        firstUsable: formatIPv6(firstUsable.toString(16).padStart(32, '0')),
        lastUsable: formatIPv6((lastUsable).toString(16).padStart(32, "0")),
        totalAddresses: (BigInt(1) << BigInt(128 - prefixLength))
      };
    } catch (error) {
      console.error(error);
      return {
        networkAddress: 'Error',
        // subnetMask: 'Error',
        firstUsable: 'Error',
        lastUsable: 'Error',
        totalAddresses: 'Error'
      };
    }
  }
  
  function padWithZeros(segment) {
    return segment.padStart(4, '0');
  }
  
  function formatIPv6(hex) {
    const segments = [];
    for (let i = 0; i < 32; i += 4) {
      segments.push(hex.slice(i, i + 4));
    }
    return segments.join(':').replace(/(:0{1,3})+/g, ':').replace(/^0+|:$/, '');
  }
  