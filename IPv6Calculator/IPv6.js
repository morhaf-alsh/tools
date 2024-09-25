document.getElementById('ipv6Form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const ipv6Address = document.getElementById('ipv6Address').value;
    const prefixLength = parseInt(document.getElementById('prefixLength').value);
  
    // Perform the IPv6 subnet calculations
    const results = calculateIPv6Subnet(ipv6Address, prefixLength);
  
    // Display the results
    document.getElementById('networkAddress').innerText = results.networkAddress;
    document.getElementById('subnetMask').innerText = results.subnetMask;
    document.getElementById('firstUsable').innerText = results.firstUsable;
    document.getElementById('lastUsable').innerText = results.lastUsable;
    document.getElementById('totalAddresses').innerText = results.totalAddresses;
  
    document.getElementById('results').classList.remove('hidden');
  });
  
  function calculateIPv6Subnet(ipv6Address, prefixLength) {
    try {
      const ip = BigInt(`0x${ipv6Address.split(':').map(padWithZeros).join('')}`);
      let networkMask = (BigInt(1) << BigInt(128 - prefixLength)) - BigInt(1);
      networkMask = networkMask << BigInt(128 - prefixLength)

      const networkAddress = (ip & networkMask);
      const firstUsable = (ip & networkMask) + BigInt(1);
      const broadcast = ip | networkMask;
      console.log(broadcast.toString(16))
      const lastUsable = networkMask | ip;
      return {
        networkAddress: formatIPv6(networkAddress.toString(16).padStart(32, '0')),
        subnetMask: formatIPv6(networkMask.toString(16).padStart(32, '0')),
        firstUsable: formatIPv6(firstUsable.toString(16).padStart(32, '0')),
        lastUsable: formatIPv6((lastUsable).toString(16)),
        totalAddresses: (BigInt(1) << BigInt(128 - prefixLength))
      };
    } catch (error) {
      console.error(error);
      return {
        networkAddress: 'Error',
        subnetMask: 'Error',
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
  