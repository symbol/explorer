
class helper{
    static timeSince(date) {

        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
          return interval + " years";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
          return interval + " months";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
          return interval + " days";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
          return interval + " hours";
        }
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
          return interval + " minutes";
        }
        return Math.floor(seconds) + " seconds";
      }

    static uint64ToString(high, low) {
        // Use a buffer to alloc a single allocation, the maximum a 64-bit integer
        // can write is 20 digits (2**64 is ~4.2e19).
        var result = ''
        while (true) {
          var mod = (high % 10) * 0x100000000 + low
          high = Math.floor(high / 10)
          low = Math.floor(mod / 10)
          result = (mod % radix).toString(radix) + result
          if (!high && !low) {
            break
          }
        }
        result
  }
}
export default helper;
