export default function calculateAddress(port = 80) {
    port = Number(port);
    if (port === 80) {
        return 'http://' + window.location.host
    } else {
        return 'http://' + window.location.host + ':' + port
    }
}